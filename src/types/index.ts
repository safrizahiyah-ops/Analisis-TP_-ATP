export type JenjangMadrasah = 'MI' | 'MTs' | 'MA';
export type Semester = 'Ganjil' | 'Genap';

export interface FormInputData {
  namaMadrasah: string;
  jenjang: JenjangMadrasah;
  mataPelajaran: string;
  faseKelas: string;
  semester: Semester;
  elemenCP: string;
  teksCP: string;
  materiPokok: string;
  alokasiJP: number;
  alokasiPertemuan: number;
  catatanGuru: string;
}

export interface AnalisisCPTabelRow {
  cp: string;
  kompetensi: string;
  pengetahuan: string;
  keterampilan: string;
  kompleksitas: string;
}

export interface AnalisisCPData {
  tabel: AnalisisCPTabelRow[];
  konteksPenerapan: string;
  potensiKarakter: string;
}

export type TahapMateri = 
  | 'konsep dasar'
  | 'keterkaitan konsep'
  | 'penerapan'
  | 'penalaran'
  | 'pemecahan masalah'
  | 'kreasi/komunikasi';

export interface SubmateriItem {
  urutan: number;
  tahap: TahapMateri | string;
  submateri: string;
  deskripsi: string;
}

export interface PemilihanLevelKognitif {
  rentangBloom: string;
  alasan: string;
}

export type GradasiTP = 
  | 'awal'
  | 'pengembangan'
  | 'penerapan'
  | 'penalaran/pemecahan masalah'
  | 'pengembangan/transfer';

export type LevelBloom = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
export type LevelSOLO = 'Prestructural' | 'Unistructural' | 'Multistructural' | 'Relational' | 'Extended Abstract';

export interface TujuanPembelajaranItem {
  kode: string;
  gradasi: GradasiTP | string;
  rumusan: string;
  kko: string;
  levelBloom: LevelBloom | string;
  levelSOLO: LevelSOLO | string;
  alasanLevel: string;
  buktiKetercapaian: string;
  estimasiJP?: number;
}

export interface AlurTujuanPembelajaranItem {
  urutanAlur: number;
  kodeTP: string;
  rumusanTP: string;
  lingkupMateri: string;
  alokasiJP: number;
  alokasiPertemuan: string;
  kegiatanPembelajaranInti?: string;
  rencanaAsesmen?: string;
}

export type NilaiPancaCinta = 
  | 'Cinta Allah dan Rasul-Nya'
  | 'Cinta Ilmu'
  | 'Cinta Diri dan Sesama'
  | 'Cinta Lingkungan'
  | 'Cinta Tanah Air';

export interface IntegrasiKBCItem {
  kodeTP: string;
  nilaiPancaCinta: (NilaiPancaCinta | string)[];
  rumusan: string;
  perilakuTeramati: string;
  penerapanKehidupan: string;
}

export type JenisSumberIslam = "Al-Qur'an" | 'Hadis' | 'Kitab Kuning';
export type JenisIntegrasiIslam = 'konseptual' | 'nilai';
export type TingkatKeyakinan = 'tinggi' | 'sedang' | 'rendah';

export interface IntegrasiKeislamanItem {
  jenisSumber: JenisSumberIslam | string;
  rujukan: string;
  teksArab: string;
  terjemahanAtauMakna: string;
  jenisIntegrasi: JenisIntegrasiIslam | string;
  keterkaitan: string;
  tingkatKeyakinan: TingkatKeyakinan | string;
}

export interface HasilPerumusanTP {
  analisisCP: AnalisisCPData;
  analisisMateri: SubmateriItem[];
  catatanTahapTidakDigunakan: string;
  pemilihanLevelKognitif: PemilihanLevelKognitif;
  tujuanPembelajaran: TujuanPembelajaranItem[];
  alurTujuanPembelajaran?: AlurTujuanPembelajaranItem[];
  integrasiKBC: IntegrasiKBCItem[];
  integrasiKeislaman: IntegrasiKeislamanItem[];
  catatanKejujuranSumber: string;
}

export interface RiwayatDokumen {
  id: string;
  judul: string;
  waktuDibuat: string;
  input: FormInputData;
  hasil: HasilPerumusanTP;
}

export interface ValidasiTPResult {
  hasMultipleKKO: boolean;
  isPrestructural: boolean;
  kbcIssues: string[];
}
