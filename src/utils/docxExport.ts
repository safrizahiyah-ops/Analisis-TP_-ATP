import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  Packer,
  ShadingType,
} from 'docx';
import { FormInputData, HasilPerumusanTP } from '../types';
import { ensureAlurTujuanPembelajaran } from './atpHelper';

export async function exportToWordDocx(input: FormInputData, data: HasilPerumusanTP): Promise<Blob> {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  };

  const headerBg = '047857'; // Emerald 700

  // Helper for Header Cells
  const createHeaderCell = (text: string, widthPercent: number) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: headerBg },
      borders: tableBorder,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text,
              bold: true,
              color: 'FFFFFF',
              size: 20, // 10pt
            }),
          ],
        }),
      ],
    });
  };

  // Helper for Data Cells
  const createCell = (
    text: string,
    widthPercent: number,
    align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT,
    isBold = false
  ) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      borders: tableBorder,
      children: [
        new Paragraph({
          alignment: align,
          children: [
            new TextRun({
              text: text || '-',
              size: 19, // 9.5pt
              bold: isBold,
            }),
          ],
        }),
      ],
    });
  };

  // Table A: Analisis CP
  const tableARows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Capaian Pembelajaran (CP)', 30),
        createHeaderCell('Kompetensi Utama', 18),
        createHeaderCell('Pengetahuan', 18),
        createHeaderCell('Keterampilan', 18),
        createHeaderCell('Kompleksitas', 16),
      ],
    }),
    ...data.analisisCP.tabel.map(
      (r) =>
        new TableRow({
          children: [
            createCell(r.cp, 30),
            createCell(r.kompetensi, 18),
            createCell(r.pengetahuan, 18),
            createCell(r.keterampilan, 18),
            createCell(r.kompleksitas, 16),
          ],
        })
    ),
  ];

  // Table B: Analisis Materi
  const tableBRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('No', 8),
        createHeaderCell('Tahap Perkembangan', 25),
        createHeaderCell('Submateri / Topik', 27),
        createHeaderCell('Deskripsi Pembelajaran', 40),
      ],
    }),
    ...data.analisisMateri.map(
      (m) =>
        new TableRow({
          children: [
            createCell(String(m.urutan), 8, AlignmentType.CENTER),
            createCell(m.tahap, 25, AlignmentType.LEFT, true),
            createCell(m.submateri, 27),
            createCell(m.deskripsi, 40),
          ],
        })
    ),
  ];

  // Table C-E: Bloom & SOLO
  const tableCERows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Kode', 10),
        createHeaderCell('Rumusan Tujuan Pembelajaran', 38),
        createHeaderCell('Level Bloom', 14),
        createHeaderCell('Level SOLO', 18),
        createHeaderCell('Alasan Penetapan Level', 20),
      ],
    }),
    ...data.tujuanPembelajaran.map(
      (tp) =>
        new TableRow({
          children: [
            createCell(tp.kode, 10, AlignmentType.CENTER, true),
            createCell(tp.rumusan, 38),
            createCell(tp.levelBloom, 14, AlignmentType.CENTER, true),
            createCell(tp.levelSOLO, 18, AlignmentType.CENTER),
            createCell(tp.alasanLevel, 20),
          ],
        })
    ),
  ];

  // Table F: TP Bergradasi
  const tableFGRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Kode', 12),
        createHeaderCell('Gradasi', 18),
        createHeaderCell('Rumusan Tujuan Pembelajaran (TP)', 42),
        createHeaderCell('Bukti Ketercapaian (Asesmen)', 28),
      ],
    }),
    ...data.tujuanPembelajaran.map(
      (tp) =>
        new TableRow({
          children: [
            createCell(tp.kode, 12, AlignmentType.CENTER, true),
            createCell(tp.gradasi, 18),
            createCell(tp.rumusan, 42),
            createCell(tp.buktiKetercapaian, 28),
          ],
        })
    ),
  ];

  // Table G: Alur Tujuan Pembelajaran (ATP)
  const atpList = ensureAlurTujuanPembelajaran(data, input);
  const totalAtpJP = atpList.reduce((acc, curr) => acc + (Number(curr.alokasiJP) || 0), 0);

  const tableATPRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Alur', 8),
        createHeaderCell('Tujuan Pembelajaran (TP)', 38),
        createHeaderCell('Lingkup Materi', 20),
        createHeaderCell('Alokasi Waktu', 14),
        createHeaderCell('Rencana Asesmen / Kegiatan', 20),
      ],
    }),
    ...atpList.map(
      (atp) =>
        new TableRow({
          children: [
            createCell(String(atp.urutanAlur), 8, AlignmentType.CENTER, true),
            createCell(`[${atp.kodeTP}] ${atp.rumusanTP}`, 38),
            createCell(atp.lingkupMateri, 20),
            createCell(`${atp.alokasiJP} JP\n(${atp.alokasiPertemuan})`, 14, AlignmentType.CENTER, true),
            createCell(atp.rencanaAsesmen || atp.kegiatanPembelajaranInti || '-', 20),
          ],
        })
    ),
    new TableRow({
      children: [
        createCell('Total Alokasi Waktu ATP', 66, AlignmentType.RIGHT, true),
        createCell(`${totalAtpJP} JP`, 14, AlignmentType.CENTER, true),
        createCell(`Target: ${input.alokasiJP} JP (${input.alokasiPertemuan} PTM)`, 20, AlignmentType.CENTER),
      ],
    }),
  ];

  // Table H: KBC
  const tableHRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Kode TP', 10),
        createHeaderCell('Nilai Panca Cinta', 25),
        createHeaderCell('Rumusan Integrasi KBC', 27),
        createHeaderCell('Perilaku Teramati (Observable)', 20),
        createHeaderCell('Penerapan Kehidupan Nyata', 18),
      ],
    }),
    ...data.integrasiKBC.map(
      (k) =>
        new TableRow({
          children: [
            createCell(k.kodeTP, 10, AlignmentType.CENTER, true),
            createCell(Array.isArray(k.nilaiPancaCinta) ? k.nilaiPancaCinta.join(', ') : String(k.nilaiPancaCinta), 25),
            createCell(k.rumusan, 27),
            createCell(k.perilakuTeramati, 20),
            createCell(k.penerapanKehidupan, 18),
          ],
        })
    ),
  ];

  const totalJP = data.tujuanPembelajaran.reduce((acc, curr) => acc + (curr.estimasiJP || 0), 0);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Kop Madrasah
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: input.namaMadrasah ? input.namaMadrasah.toUpperCase() : `MADRASAH ${input.jenjang}`,
                bold: true,
                size: 26,
                color: '047857',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DOKUMEN ANALISIS CAPAIAN PEMBELAJARAN (CP) DAN PERUMUSAN TUJUAN PEMBELAJARAN (TP)',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Terintegrasi Taksonomi Bloom Revisi, SOLO, dan Kurikulum Berbasis Cinta (KBC)',
                italics: true,
                size: 18,
                color: '666666',
              }),
            ],
          }),
          new Paragraph({ text: '_________________________________________________________________________________' }),
          new Paragraph({ text: '' }),

          // Identitas
          new Paragraph({
            children: [
              new TextRun({ text: 'IDENTITAS PEMBELAJARAN', bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Satuan Pendidikan\t: ', bold: true }),
              new TextRun({ text: input.namaMadrasah || `Madrasah (${input.jenjang})` }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Mata Pelajaran\t: ', bold: true }),
              new TextRun({ text: `${input.mataPelajaran} (${input.jenjang})` }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Fase / Kelas\t: ', bold: true }),
              new TextRun({ text: `${input.faseKelas} | Semester ${input.semester}` }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Elemen CP\t\t: ', bold: true }),
              new TextRun({ text: input.elemenCP || '-' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Materi Pokok\t: ', bold: true }),
              new TextRun({ text: input.materiPokok }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Alokasi Waktu\t: ', bold: true }),
              new TextRun({
                text: `${input.alokasiJP} JP (${input.alokasiPertemuan} Pertemuan) — Total JP Terencana: ${totalJP} JP`,
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Bagian A
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'A. Analisis Capaian Pembelajaran (CP)', bold: true, color: '047857' })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Teks Asli CP: ', bold: true }),
              new TextRun({ text: input.teksCP, italics: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Konteks Penerapan: ', bold: true }),
              new TextRun({ text: data.analisisCP.konteksPenerapan }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Potensi Penguatan Karakter: ', bold: true }),
              new TextRun({ text: data.analisisCP.potensiKarakter }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableARows,
          }),
          new Paragraph({ text: '' }),

          // Bagian B
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'B. Analisis Materi Pembelajaran Berurutan', bold: true, color: '047857' })],
          }),
          data.catatanTahapTidakDigunakan
            ? new Paragraph({
                children: [
                  new TextRun({ text: 'Catatan Tahap Perkembangan: ', bold: true }),
                  new TextRun({ text: data.catatanTahapTidakDigunakan, italics: true }),
                ],
              })
            : new Paragraph({ text: '' }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableBRows,
          }),
          new Paragraph({ text: '' }),

          // Bagian C-E
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'C–E. Analisis Taksonomi Bloom Revisi dan Kedalaman SOLO',
                bold: true,
                color: '047857',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rentang Kognitif Bloom: ', bold: true }),
              new TextRun({ text: data.pemilihanLevelKognitif.rentangBloom + ' — ' }),
              new TextRun({ text: data.pemilihanLevelKognitif.alasan, italics: true }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableCERows,
          }),
          new Paragraph({ text: '' }),

          // Bagian F: Rumusan TP Bergradasi
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'F. Rumusan Tujuan Pembelajaran (TP) Bergradasi',
                bold: true,
                color: '047857',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableFGRows,
          }),
          new Paragraph({ text: '' }),

          // Bagian G: Alur Tujuan Pembelajaran (ATP)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'G. Alur Tujuan Pembelajaran (ATP) & Alokasi Waktu',
                bold: true,
                color: '047857',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Alur kronologis-pedagogis yang memetakan Tujuan Pembelajaran (TP), lingkup materi, alokasi waktu (JP dan pertemuan), serta rencana asesmen.',
                italics: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableATPRows,
          }),
          new Paragraph({ text: '' }),

          // Bagian H
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'H. Integrasi Kurikulum Berbasis Cinta (KBC)',
                bold: true,
                color: '047857',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableHRows,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),

          // Tanda Tangan
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Ditetapkan pada: ${new Date().toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}`,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mengetahui,\nKepala Madrasah', bold: true })] }),
                      new Paragraph({ text: '\n\n\n' }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( _______________________ )' })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NIP. ...................................' })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Guru Mata Pelajaran,', bold: true })] }),
                      new Paragraph({ text: '\n\n\n' }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '( _______________________ )' })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NIP. ...................................' })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
