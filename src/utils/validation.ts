import { DAFTAR_KKO_DIKETAHUI } from './constants';
import { TujuanPembelajaranItem, IntegrasiKBCItem } from '../types';

export interface ValidasiTPDetail {
  kode: string;
  isPrestructural: boolean;
  kkoDetected: string[];
  hasTooManyKKO: boolean;
  kkoWarning?: string;
  prestructuralWarning?: string;
}

export interface ValidasiKBCDetail {
  kodeTP: string;
  unmeasurableWordsFound: string[];
  lacksObservableBehavior: boolean;
  warning?: string;
}

const UNMEASURABLE_WORDS = [
  'mencintai',
  'memahami nilai',
  'menghayati',
  'meresapi',
  'memiliki rasa',
  'menyadari pentingnya',
];

export function validasiTujuanPembelajaran(tp: TujuanPembelajaranItem): ValidasiTPDetail {
  const isPrestructural = (tp.levelSOLO || '').toLowerCase().includes('prestructural');

  // Detect KKOs in the rumusan
  const textLower = (tp.rumusan || '').toLowerCase();
  const detectedKKO = DAFTAR_KKO_DIKETAHUI.filter((kko) => {
    const regex = new RegExp(`\\b${kko}\\b`, 'i');
    return regex.test(textLower);
  });

  // Also count if field 'kko' itself has comma separated values
  const kkoFieldList = (tp.kko || '')
    .split(/[,/&dan]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 2);

  const combinedKKOSet = new Set([...detectedKKO, ...kkoFieldList]);
  const kkoArray = Array.from(combinedKKOSet);
  const hasTooManyKKO = kkoArray.length > 2;

  let kkoWarning: string | undefined;
  if (hasTooManyKKO) {
    kkoWarning = `TP ini terdeteksi memiliki lebih dari 2 KKO (${kkoArray.slice(0, 3).join(', ')}...). Dianjurkan memfokuskan pada satu atau maksimal dua KKO utama agar terukur.`;
  }

  let prestructuralWarning: string | undefined;
  if (isPrestructural) {
    prestructuralWarning = 'Level Prestructural hanya untuk informasi diagnostik awal dan TIDAK boleh dijadikan Tujuan Pembelajaran.';
  }

  return {
    kode: tp.kode,
    isPrestructural,
    kkoDetected: kkoArray,
    hasTooManyKKO,
    kkoWarning,
    prestructuralWarning,
  };
}

export function validasiIntegrasiKBC(kbc: IntegrasiKBCItem): ValidasiKBCDetail {
  const rumusanLower = (kbc.rumusan || '').toLowerCase();
  const foundWords = UNMEASURABLE_WORDS.filter((word) => rumusanLower.includes(word));

  const hasPerilaku = (kbc.perilakuTeramati || '').trim().length > 10;
  const lacksObservableBehavior = !hasPerilaku;

  let warning: string | undefined;
  if (foundWords.length > 0 && lacksObservableBehavior) {
    warning = `Rumusan memuat kata tidak terukur ("${foundWords.join('", "')}") dan belum disertai deskripsi perilaku teramati yang spesifik. Harap lengkapi aksi nyata yang dapat diobservasi guru.`;
  } else if (foundWords.length > 0) {
    warning = `Memuat kata abstrak ("${foundWords.join('", "')}"). Pastikan asesmen diarahkan pada perilaku teramati: "${kbc.perilakuTeramati}".`;
  } else if (lacksObservableBehavior) {
    warning = 'Kolom perilaku teramati masih terlalu ringkas atau kosong. Berikan contoh tindakan nyata santri.';
  }

  return {
    kodeTP: kbc.kodeTP,
    unmeasurableWordsFound: foundWords,
    lacksObservableBehavior,
    warning,
  };
}
