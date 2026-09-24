import { HasilPerumusanTP, FormInputData, AlurTujuanPembelajaranItem } from '../types';

/**
 * Ensures a valid AlurTujuanPembelajaran (ATP) list exists for any HasilPerumusanTP,
 * generating a sensible fallback if missing from legacy records or partial outputs.
 */
export function ensureAlurTujuanPembelajaran(
  data: HasilPerumusanTP,
  input: FormInputData
): AlurTujuanPembelajaranItem[] {
  if (data.alurTujuanPembelajaran && Array.isArray(data.alurTujuanPembelajaran) && data.alurTujuanPembelajaran.length > 0) {
    return data.alurTujuanPembelajaran;
  }

  // Generate fallback ATP from existing tujuanPembelajaran list
  const tpList = data.tujuanPembelajaran || [];
  if (tpList.length === 0) return [];

  const totalJP = Number(input.alokasiJP) || 10;
  const totalPertemuan = Number(input.alokasiPertemuan) || 4;
  const count = tpList.length;

  // Distribute JP evenly with remainder added to early/penerapan TP
  const baseJP = Math.floor(totalJP / count);
  let remainderJP = totalJP % count;

  let currentMeeting = 1;
  const meetingsPerTP = Math.max(1, Math.round(totalPertemuan / count));

  return tpList.map((tp, idx) => {
    const allocatedJP = baseJP + (remainderJP > 0 ? 1 : 0);
    if (remainderJP > 0) remainderJP--;

    const startMeeting = currentMeeting;
    const endMeeting = Math.min(totalPertemuan, currentMeeting + meetingsPerTP - 1);
    currentMeeting = endMeeting + 1;

    const pertemuanText =
      startMeeting === endMeeting || endMeeting < startMeeting
        ? `Pertemuan ${startMeeting}`
        : `Pertemuan ${startMeeting}–${endMeeting}`;

    const materiName =
      data.analisisMateri && data.analisisMateri[idx]
        ? data.analisisMateri[idx].submateri
        : input.materiPokok;

    return {
      urutanAlur: idx + 1,
      kodeTP: tp.kode || `TP-${idx + 1}`,
      rumusanTP: tp.rumusan,
      lingkupMateri: materiName,
      alokasiJP: allocatedJP,
      alokasiPertemuan: pertemuanText,
      kegiatanPembelajaranInti: `Eksplorasi konsep dan praktik pemecahan masalah kontekstual pada materi ${materiName}.`,
      rencanaAsesmen: tp.buktiKetercapaian || 'Asesmen formatif observasi dan unjuk kerja.',
    };
  });
}
