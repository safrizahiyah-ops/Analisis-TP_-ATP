import { FormInputData, HasilPerumusanTP } from '../types';
import { ensureAlurTujuanPembelajaran } from './atpHelper';

export async function copyFullDocumentToClipboard(
  input: FormInputData,
  data: HasilPerumusanTP
): Promise<{ success: boolean; isHtml: boolean }> {
  const atpList = ensureAlurTujuanPembelajaran(data, input);
  const totalAtpJP = atpList.reduce((acc, curr) => acc + (Number(curr.alokasiJP) || 0), 0);

  // 1. Generate Plain Text representation
  const plainText = `=== DOKUMEN PERENCANAAN PEMBELAJARAN MADRASAH (PERTAMA) ===
Satuan Pendidikan : ${input.namaMadrasah || `Madrasah (${input.jenjang})`}
Mata Pelajaran    : ${input.mataPelajaran} (${input.jenjang} - ${input.faseKelas})
Semester          : ${input.semester}
Elemen CP         : ${input.elemenCP || '-'}
Materi Pokok      : ${input.materiPokok}
Alokasi Waktu     : ${input.alokasiJP} JP (${input.alokasiPertemuan} Pertemuan)
Total JP Terencana: ${totalAtpJP} JP

--- CAPAIAN PEMBELAJARAN (CP) ---
${input.teksCP}

--- A. ANALISIS CAPAIAN PEMBELAJARAN (CP) ---
${data.analisisCP.tabel
  .map(
    (t, idx) =>
      `${idx + 1}. CP: ${t.cp}\n   Kompetensi: ${t.kompetensi} | Pengetahuan: ${t.pengetahuan} | Keterampilan: ${t.keterampilan} | Kompleksitas: ${t.kompleksitas}`
  )
  .join('\n\n')}
Konteks Penerapan: ${data.analisisCP.konteksPenerapan}
Potensi Karakter : ${data.analisisCP.potensiKarakter}

--- B. ANALISIS MATERI POKOK ---
${data.analisisMateri
  .map(
    (m) =>
      `${m.urutan}. [${m.tahap.toUpperCase()}] ${m.submateri}\n   Deskripsi: ${m.deskripsi}`
  )
  .join('\n\n')}
Catatan Tahap yang Tidak Digunakan: ${data.catatanTahapTidakDigunakan || '-'}

--- C–E. PEMILIHAN LEVEL KOGNITIF (BLOOM REVISI & SOLO) ---
${data.tujuanPembelajaran
  .map(
    (tp) =>
      `• [${tp.kode}] ${tp.rumusan}\n  Level Bloom: ${tp.levelBloom} | Level SOLO: ${tp.levelSOLO}\n  KKO: ${tp.kko}\n  Alasan: ${tp.alasanLevel}`
  )
  .join('\n\n')}

--- F. RUMUSAN TUJUAN PEMBELAJARAN (TP) BERGRADASI ---
${data.tujuanPembelajaran
  .map(
    (tp) =>
      `• [${tp.kode}] (${tp.gradasi})\n  Rumusan: ${tp.rumusan}\n  Bukti Ketercapaian: ${tp.buktiKetercapaian}`
  )
  .join('\n\n')}

--- G. ALUR TUJUAN PEMBELAJARAN (ATP) & ALOKASI WAKTU ---
${atpList
  .map(
    (a) =>
      `• Alur ke-${a.urutanAlur} [${a.kodeTP}]\n  Rumusan TP    : ${a.rumusanTP}\n  Lingkup Materi: ${a.lingkupMateri}\n  Alokasi Waktu : ${a.alokasiJP} JP (${a.alokasiPertemuan})\n  Rencana Asesmen: ${a.rencanaAsesmen || '-'}\n  Kegiatan Inti : ${a.kegiatanPembelajaranInti || '-'}`
  )
  .join('\n\n')}
Total Alokasi Waktu: ${totalAtpJP} JP (Target: ${input.alokasiJP} JP)

--- H. INTEGRASI KURIKULUM BERBASIS CINTA (KBC) ---
${data.integrasiKBC
  .map(
    (k) =>
      `• [${k.kodeTP}] Nilai Panca Cinta: ${Array.isArray(k.nilaiPancaCinta) ? k.nilaiPancaCinta.join(', ') : k.nilaiPancaCinta}\n  Rumusan   : ${k.rumusan}\n  Perilaku  : ${k.perilakuTeramati}\n  Penerapan : ${k.penerapanKehidupan}`
  )
  .join('\n\n')}
`;

  // 2. Generate Rich HTML representation for Microsoft Word & Google Docs pasting
  const htmlText = `
<div style="font-family: Arial, 'Segoe UI', sans-serif; color: #1e293b; line-height: 1.5; font-size: 11pt;">
  <div style="text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 8px; margin-bottom: 16px;">
    <h3 style="margin: 0; font-size: 11pt; text-transform: uppercase; color: #475569;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
    <h1 style="margin: 4px 0 0 0; font-size: 15pt; font-weight: bold; color: #065f46; text-transform: uppercase;">
      ${input.namaMadrasah || `MADRASAH (${input.jenjang})`}
    </h1>
    <p style="margin: 4px 0 0 0; font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #1e293b;">
      DOKUMEN PERENCANAAN PEMBELAJARAN: ANALISIS CP, TP, DAN ALUR TUJUAN PEMBELAJARAN (ATP)
    </p>
    <p style="margin: 2px 0 0 0; font-size: 9pt; font-style: italic; color: #64748b;">
      Terintegrasi Taksonomi Bloom Revisi, SOLO, dan Kurikulum Berbasis Cinta (KBC)
    </p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background-color: #f8fafc; font-size: 10pt;">
    <tr>
      <td style="padding: 4px 8px; font-weight: bold; width: 22%;">Satuan Pendidikan:</td>
      <td style="padding: 4px 8px;">${input.namaMadrasah || `Madrasah (${input.jenjang})`}</td>
      <td style="padding: 4px 8px; font-weight: bold; width: 20%;">Mata Pelajaran:</td>
      <td style="padding: 4px 8px;">${input.mataPelajaran} (${input.jenjang})</td>
    </tr>
    <tr>
      <td style="padding: 4px 8px; font-weight: bold;">Fase / Kelas:</td>
      <td style="padding: 4px 8px;">${input.faseKelas} (Semester ${input.semester})</td>
      <td style="padding: 4px 8px; font-weight: bold;">Elemen CP:</td>
      <td style="padding: 4px 8px;">${input.elemenCP || '-'}</td>
    </tr>
    <tr>
      <td style="padding: 4px 8px; font-weight: bold;">Materi Pokok:</td>
      <td style="padding: 4px 8px;">${input.materiPokok}</td>
      <td style="padding: 4px 8px; font-weight: bold;">Alokasi Waktu:</td>
      <td style="padding: 4px 8px; font-weight: bold; color: #065f46;">${input.alokasiJP} JP (${input.alokasiPertemuan} Pertemuan)</td>
    </tr>
  </table>

  <h2 style="font-size: 12pt; color: #065f46; border-left: 4px solid #065f46; padding-left: 8px; margin: 16px 0 8px 0;">
    Capaian Pembelajaran (CP)
  </h2>
  <div style="background-color: #f1f5f9; padding: 10px; border-radius: 4px; font-style: italic; margin-bottom: 16px;">
    "${input.teksCP}"
  </div>

  <h2 style="font-size: 12pt; color: #065f46; border-left: 4px solid #065f46; padding-left: 8px; margin: 16px 0 8px 0;">
    A. Analisis Capaian Pembelajaran (CP)
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 9.5pt;" border="1" cellpadding="6">
    <thead style="background-color: #047857; color: white;">
      <tr>
        <th style="padding: 6px;">Capaian Pembelajaran (CP)</th>
        <th style="padding: 6px;">Kompetensi Utama</th>
        <th style="padding: 6px;">Pengetahuan</th>
        <th style="padding: 6px;">Keterampilan</th>
        <th style="padding: 6px;">Kompleksitas</th>
      </tr>
    </thead>
    <tbody>
      ${data.analisisCP.tabel
        .map(
          (t) => `
        <tr>
          <td style="padding: 6px;">${t.cp}</td>
          <td style="padding: 6px;">${t.kompetensi}</td>
          <td style="padding: 6px;">${t.pengetahuan}</td>
          <td style="padding: 6px;">${t.keterampilan}</td>
          <td style="padding: 6px; text-align: center;">${t.kompleksitas}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>
  <p><strong>Konteks Penerapan:</strong> ${data.analisisCP.konteksPenerapan}</p>
  <p><strong>Potensi Karakter:</strong> ${data.analisisCP.potensiKarakter}</p>

  <h2 style="font-size: 12pt; color: #065f46; border-left: 4px solid #065f46; padding-left: 8px; margin: 16px 0 8px 0;">
    B. Analisis Materi Pokok & Urutan Perkembangan
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 9.5pt;" border="1" cellpadding="6">
    <thead style="background-color: #047857; color: white;">
      <tr>
        <th style="padding: 6px; width: 6%;">No</th>
        <th style="padding: 6px; width: 24%;">Tahap Perkembangan</th>
        <th style="padding: 6px; width: 28%;">Submateri / Topik</th>
        <th style="padding: 6px; width: 42%;">Deskripsi Pembelajaran</th>
      </tr>
    </thead>
    <tbody>
      ${data.analisisMateri
        .map(
          (m) => `
        <tr>
          <td style="padding: 6px; text-align: center;">${m.urutan}</td>
          <td style="padding: 6px; font-weight: bold;">${m.tahap}</td>
          <td style="padding: 6px;">${m.submateri}</td>
          <td style="padding: 6px;">${m.deskripsi}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2 style="font-size: 12pt; color: #065f46; border-left: 4px solid #065f46; padding-left: 8px; margin: 16px 0 8px 0;">
    F. Rumusan Tujuan Pembelajaran (TP) Bergradasi
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 9.5pt;" border="1" cellpadding="6">
    <thead style="background-color: #047857; color: white;">
      <tr>
        <th style="padding: 6px; width: 10%;">Kode</th>
        <th style="padding: 6px; width: 18%;">Gradasi</th>
        <th style="padding: 6px; width: 44%;">Rumusan Tujuan Pembelajaran (TP)</th>
        <th style="padding: 6px; width: 28%;">Bukti Ketercapaian (Asesmen)</th>
      </tr>
    </thead>
    <tbody>
      ${data.tujuanPembelajaran
        .map(
          (tp) => `
        <tr>
          <td style="padding: 6px; text-align: center; font-weight: bold;">${tp.kode}</td>
          <td style="padding: 6px;">${tp.gradasi}</td>
          <td style="padding: 6px; font-weight: 500;">${tp.rumusan}</td>
          <td style="padding: 6px;">${tp.buktiKetercapaian}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2 style="font-size: 12pt; color: #065f46; border-left: 4px solid #065f46; padding-left: 8px; margin: 16px 0 8px 0;">
    G. Alur Tujuan Pembelajaran (ATP) & Distribusi Alokasi Waktu
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 9.5pt;" border="1" cellpadding="6">
    <thead style="background-color: #047857; color: white;">
      <tr>
        <th style="padding: 6px; width: 7%;">Alur</th>
        <th style="padding: 6px; width: 38%;">Tujuan Pembelajaran (TP)</th>
        <th style="padding: 6px; width: 20%;">Lingkup Materi</th>
        <th style="padding: 6px; width: 15%;">Alokasi Waktu</th>
        <th style="padding: 6px; width: 20%;">Rencana Asesmen / Kegiatan</th>
      </tr>
    </thead>
    <tbody>
      ${atpList
        .map(
          (atp) => `
        <tr>
          <td style="padding: 6px; text-align: center; font-weight: bold;">${atp.urutanAlur}</td>
          <td style="padding: 6px;"><strong>[${atp.kodeTP}]</strong> ${atp.rumusanTP}</td>
          <td style="padding: 6px;">${atp.lingkupMateri}</td>
          <td style="padding: 6px; text-align: center; font-weight: bold; color: #047857;">
            ${atp.alokasiJP} JP<br><span style="font-size: 8.5pt; font-weight: normal; color: #64748b;">${atp.alokasiPertemuan}</span>
          </td>
          <td style="padding: 6px;">${atp.rencanaAsesmen || atp.kegiatanPembelajaranInti || '-'}</td>
        </tr>`
        )
        .join('')}
      <tr style="background-color: #f1f5f9; font-weight: bold;">
        <td colspan="3" style="padding: 6px; text-align: right;">Total Alokasi Waktu Terencana:</td>
        <td style="padding: 6px; text-align: center; color: #065f46;">${totalAtpJP} JP</td>
        <td style="padding: 6px; font-size: 8.5pt; color: #64748b;">Target: ${input.alokasiJP} JP (${input.alokasiPertemuan} Pertemuan)</td>
      </tr>
    </tbody>
  </table>

  <h2 style="font-size: 12pt; color: #065f46; border-left: 4px solid #065f46; padding-left: 8px; margin: 16px 0 8px 0;">
    H. Integrasi Kurikulum Berbasis Cinta (KBC)
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 9.5pt;" border="1" cellpadding="6">
    <thead style="background-color: #047857; color: white;">
      <tr>
        <th style="padding: 6px; width: 10%;">Kode TP</th>
        <th style="padding: 6px; width: 22%;">Nilai Panca Cinta</th>
        <th style="padding: 6px; width: 28%;">Rumusan Integrasi</th>
        <th style="padding: 6px; width: 20%;">Perilaku Teramati</th>
        <th style="padding: 6px; width: 20%;">Penerapan Nyata</th>
      </tr>
    </thead>
    <tbody>
      ${data.integrasiKBC
        .map(
          (k) => `
        <tr>
          <td style="padding: 6px; text-align: center; font-weight: bold;">${k.kodeTP}</td>
          <td style="padding: 6px; font-weight: bold; color: #047857;">
            ${Array.isArray(k.nilaiPancaCinta) ? k.nilaiPancaCinta.join(', ') : k.nilaiPancaCinta}
          </td>
          <td style="padding: 6px;">${k.rumusan}</td>
          <td style="padding: 6px;">${k.perilakuTeramati}</td>
          <td style="padding: 6px;">${k.penerapanKehidupan}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>
</div>
`;

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([htmlText], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });
      await navigator.clipboard.write([item]);
      return { success: true, isHtml: true };
    } else {
      await navigator.clipboard.writeText(plainText);
      return { success: true, isHtml: false };
    }
  } catch (err) {
    console.warn('ClipboardItem write failed, falling back to writeText:', err);
    try {
      await navigator.clipboard.writeText(plainText);
      return { success: true, isHtml: false };
    } catch (e2) {
      console.error('All clipboard methods failed:', e2);
      return { success: false, isHtml: false };
    }
  }
}
