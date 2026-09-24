import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Anda adalah pakar kurikulum madrasah, evaluator pendidikan, dan penulis artikel ilmiah. Tugas Anda menganalisis CP dan merumuskan TP dengan aturan berikut.

A. ANALISIS CP
Uraikan CP menjadi: (1) kompetensi utama, (2) pengetahuan yang harus dikuasai, (3) keterampilan yang harus ditunjukkan, (4) konteks penerapan, (5) tingkat kompleksitas kompetensi, (6) potensi penguatan karakter. Sajikan dalam tabel dengan kolom: CP | Kompetensi | Pengetahuan | Keterampilan | Kompleksitas.

B. ANALISIS MATERI
Pecah materi menjadi submateri/kompetensi yang logis dengan urutan: konsep dasar → keterkaitan konsep → penerapan → penalaran → pemecahan masalah → kreasi/komunikasi, sesuai karakter materi. Jangan memaksakan semua tahap jika tidak diperlukan; jelaskan alasan jika ada tahap yang tidak digunakan.

C. TAKSONOMI BLOOM REVISI
Gunakan sebagai dasar proses kognitif dengan KKO berikut:
C1 Mengingat: menyebutkan, mengidentifikasi, mendata, memilih, mengenali, mengingat kembali.
C2 Memahami: menjelaskan, menguraikan, menginterpretasikan, mengklasifikasikan, memberikan contoh, membandingkan, menyimpulkan.
C3 Menerapkan: menghitung, menentukan, menggunakan, menerapkan, menyelesaikan, menunjukkan, mendemonstrasikan.
C4 Menganalisis: menganalisis, membedakan, menghubungkan, mengorganisasikan, menemukan pola, menguraikan hubungan, memeriksa.
C5 Mengevaluasi: menilai, mengevaluasi, memeriksa, mengkritisi, membuktikan, memberikan alasan, mempertimbangkan.
C6 Mencipta: merancang, membuat, menyusun, mengembangkan, menghasilkan, memodelkan, menciptakan strategi/solusi.
Jangan menggunakan C1–C6 secara otomatis. Pilih level berdasarkan tuntutan CP, karakteristik materi, fase/kelas, dan kedalaman kompetensi. Untuk Matematika MTs, prioritaskan C2–C4; gunakan C5–C6 hanya jika sesuai karakter materi dan tuntutan CP. Berikan alasan pemilihan level.

D. TAKSONOMI SOLO
Gunakan untuk menentukan kedalaman struktur pemahaman:
Prestructural: hanya informasi diagnostik, JANGAN dijadikan TP.
Unistructural: satu aspek (mengidentifikasi, menyebutkan, menentukan, menggunakan satu prosedur, menunjukkan).
Multistructural: beberapa aspek belum terhubung (menjelaskan beberapa konsep, menggunakan beberapa prosedur, mengklasifikasikan, menyelesaikan beberapa langkah, membandingkan beberapa karakteristik).
Relational: menghubungkan konsep menjadi utuh (menghubungkan, menganalisis, mengintegrasikan, menjelaskan hubungan, menerapkan konsep dalam konteks, memecahkan masalah, menyimpulkan berdasarkan hubungan antarkonsep).
Extended Abstract: transfer dan generalisasi (mengevaluasi, menggeneralisasi, merancang, mengembangkan, memodelkan, menciptakan, menyusun strategi, mentransfer konsep ke situasi baru).

E. HUBUNGAN BLOOM DAN SOLO
Acuan umum (bukan aturan mutlak): C1–Unistructural; C2–Unistructural/Multistructural; C3–Multistructural/Relational; C4–Relational; C5–Relational/Extended Abstract; C6–Extended Abstract. Bloom menentukan proses berpikir, SOLO menentukan kedalaman struktur pemahaman. Jika TP ber-level C3 tetapi menuntut penghubungan beberapa konsep, tetapkan SOLO Relational dan jelaskan alasannya.

F. GRADASI TP
Susun bertahap: TP awal → TP pengembangan → TP penerapan → TP penalaran/pemecahan masalah → TP pengembangan/transfer. Jumlah TP disesuaikan dengan bobot materi, jumlah submateri, alokasi waktu, dan CP. Jangan membuat TP berlebihan. Setiap TP memiliki satu kompetensi utama, kondisi/konteks, tingkat kemampuan yang jelas, dan bukti ketercapaian yang terukur. Pada bagian TP ini, fokuskan murni pada rumusan kompetensi dan kriteria ketercapaian (alokasi waktu dialihkan khusus ke ATP).

G. FORMAT RUMUSAN TP
Pola: Peserta didik mampu + KKO + kompetensi/materi + konteks/kondisi + kriteria keberhasilan (jika perlu). Hindari lebih dari satu atau dua KKO dalam satu TP.

H. INTEGRASI KBC
Setelah TP kognitif selesai, integrasikan Panca Cinta secara proporsional: Cinta Allah dan Rasul-Nya, Cinta Ilmu, Cinta Diri dan Sesama, Cinta Lingkungan, Cinta Tanah Air. Pilih hanya nilai yang relevan; jangan memaksakan semuanya ke setiap TP. Rumusan harus memuat perilaku yang dapat diamati, sikap yang dikembangkan, keterampilan sosial, dan penerapan dalam kehidupan. Hindari rumusan tidak terukur seperti 'Peserta didik mampu mencintai Allah'.

I. INTEGRASI AL-QUR'AN / HADIS / KITAB KUNING
Cari sumber yang relevan dengan konsep, nilai, konteks, karakter, atau penerapan materi. Klasifikasikan setiap sumber sebagai 'Integrasi konseptual' (hubungan langsung dengan gagasan keilmuan) atau 'Integrasi nilai' (mendukung nilai/karakter). Jangan mengklaim ayat sebagai 'ayat matematika' jika hanya berkaitan nilai.
ATURAN KEJUJURAN MUTLAK: Jangan mengarang teks Arab, nomor ayat, terjemahan, hadis, perawi, atau kutipan kitab. Jika tidak yakin pada teks Arab persis, kosongkan field teks Arab dan cukup cantumkan rujukan (nama surah dan nomor ayat) beserta ringkasan makna. Beri tingkat keyakinan (tinggi/sedang/rendah) pada setiap sumber. Jika tidak ditemukan sumber yang benar-benar relevan, nyatakan dengan jujur.

J. ALUR TUJUAN PEMBELAJARAN (ATP) DAN ALOKASI WAKTU
Petakan seluruh TP ke dalam urutan kronologis pembelajaran yang logis dari awal hingga akhir pertemuan. Setiap butir ATP memuat: urutanAlur (1, 2, 3...), kodeTP (misal 'TP.1'), rumusanTP, lingkupMateri yang spesifik, alokasiJP (angka bulat, total alokasiJP seluruh item ATP harus sama persis dengan total alokasi JP yang diinputkan guru), alokasiPertemuan (misal 'Pertemuan 1 (2 JP)' atau 'Pertemuan 2-3 (4 JP)'), rencanaAsesmen (formatif/sumatif), dan kegiatanPembelajaranInti.

Kembalikan jawaban HANYA dalam format JSON sesuai skema.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analisisCP: {
      type: Type.OBJECT,
      properties: {
        tabel: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cp: { type: Type.STRING },
              kompetensi: { type: Type.STRING },
              pengetahuan: { type: Type.STRING },
              keterampilan: { type: Type.STRING },
              kompleksitas: { type: Type.STRING },
            },
            required: ['cp', 'kompetensi', 'pengetahuan', 'keterampilan', 'kompleksitas'],
          },
        },
        konteksPenerapan: { type: Type.STRING },
        potensiKarakter: { type: Type.STRING },
      },
      required: ['tabel', 'konteksPenerapan', 'potensiKarakter'],
    },
    analisisMateri: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          urutan: { type: Type.INTEGER },
          tahap: {
            type: Type.STRING,
            description: 'konsep dasar|keterkaitan konsep|penerapan|penalaran|pemecahan masalah|kreasi/komunikasi',
          },
          submateri: { type: Type.STRING },
          deskripsi: { type: Type.STRING },
        },
        required: ['urutan', 'tahap', 'submateri', 'deskripsi'],
      },
    },
    catatanTahapTidakDigunakan: { type: Type.STRING },
    pemilihanLevelKognitif: {
      type: Type.OBJECT,
      properties: {
        rentangBloom: { type: Type.STRING },
        alasan: { type: Type.STRING },
      },
      required: ['rentangBloom', 'alasan'],
    },
    tujuanPembelajaran: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          kode: { type: Type.STRING },
          gradasi: {
            type: Type.STRING,
            description: 'awal|pengembangan|penerapan|penalaran/pemecahan masalah|pengembangan/transfer',
          },
          rumusan: { type: Type.STRING },
          kko: { type: Type.STRING },
          levelBloom: { type: Type.STRING },
          levelSOLO: {
            type: Type.STRING,
            description: 'Unistructural|Multistructural|Relational|Extended Abstract',
          },
          alasanLevel: { type: Type.STRING },
          buktiKetercapaian: { type: Type.STRING },
          estimasiJP: { type: Type.INTEGER },
        },
        required: [
          'kode',
          'gradasi',
          'rumusan',
          'kko',
          'levelBloom',
          'levelSOLO',
          'alasanLevel',
          'buktiKetercapaian',
        ],
      },
    },
    alurTujuanPembelajaran: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          urutanAlur: { type: Type.INTEGER },
          kodeTP: { type: Type.STRING },
          rumusanTP: { type: Type.STRING },
          lingkupMateri: { type: Type.STRING },
          alokasiJP: { type: Type.INTEGER },
          alokasiPertemuan: { type: Type.STRING },
          rencanaAsesmen: { type: Type.STRING },
          kegiatanPembelajaranInti: { type: Type.STRING },
        },
        required: [
          'urutanAlur',
          'kodeTP',
          'rumusanTP',
          'lingkupMateri',
          'alokasiJP',
          'alokasiPertemuan',
        ],
      },
    },
    integrasiKBC: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          kodeTP: { type: Type.STRING },
          nilaiPancaCinta: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          rumusan: { type: Type.STRING },
          perilakuTeramati: { type: Type.STRING },
          penerapanKehidupan: { type: Type.STRING },
        },
        required: ['kodeTP', 'nilaiPancaCinta', 'rumusan', 'perilakuTeramati', 'penerapanKehidupan'],
      },
    },
    integrasiKeislaman: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          jenisSumber: {
            type: Type.STRING,
            description: "Al-Qur'an|Hadis|Kitab Kuning",
          },
          rujukan: { type: Type.STRING },
          teksArab: { type: Type.STRING },
          terjemahanAtauMakna: { type: Type.STRING },
          jenisIntegrasi: {
            type: Type.STRING,
            description: 'konseptual|nilai',
          },
          keterkaitan: { type: Type.STRING },
          tingkatKeyakinan: {
            type: Type.STRING,
            description: 'tinggi|sedang|rendah',
          },
        },
        required: [
          'jenisSumber',
          'rujukan',
          'teksArab',
          'terjemahanAtauMakna',
          'jenisIntegrasi',
          'keterkaitan',
          'tingkatKeyakinan',
        ],
      },
    },
    catatanKejujuranSumber: { type: Type.STRING },
  },
  required: [
    'analisisCP',
    'analisisMateri',
    'catatanTahapTidakDigunakan',
    'pemilihanLevelKognitif',
    'tujuanPembelajaran',
    'alurTujuanPembelajaran',
    'integrasiKBC',
    'integrasiKeislaman',
    'catatanKejujuranSumber',
  ],
};

function parseAndFormatError(err: any): { message: string; isHighDemand: boolean; code?: number } {
  let rawMsg = err?.message || String(err);
  let parsedJson: any = null;

  if (err?.error && typeof err.error === 'object') {
    parsedJson = err;
  } else if (typeof rawMsg === 'string') {
    const startIdx = rawMsg.indexOf('{');
    const endIdx = rawMsg.lastIndexOf('}');
    if (startIdx !== -1 && endIdx > startIdx) {
      try {
        parsedJson = JSON.parse(rawMsg.slice(startIdx, endIdx + 1));
      } catch {}
    }
  }

  const code = parsedJson?.error?.code || (err?.status as number);
  const status = parsedJson?.error?.status || '';
  const innerMsg = parsedJson?.error?.message || rawMsg;

  const isHighDemand =
    code === 503 ||
    status === 'UNAVAILABLE' ||
    innerMsg.toLowerCase().includes('high demand') ||
    innerMsg.toLowerCase().includes('overloaded') ||
    innerMsg.toLowerCase().includes('temporarily') ||
    innerMsg.toLowerCase().includes('spikes in demand') ||
    innerMsg.includes('503');

  const isRateLimited =
    code === 429 ||
    status === 'RESOURCE_EXHAUSTED' ||
    innerMsg.toLowerCase().includes('quota') ||
    innerMsg.toLowerCase().includes('rate limit');

  if (isHighDemand) {
    return {
      message:
        'Layanan AI Google saat ini sedang mengalami lonjakan antrean trafik tinggi (503 High Demand). Silakan klik "Coba Lagi" dalam beberapa detik.',
      isHighDemand: true,
      code: 503,
    };
  }

  if (isRateLimited) {
    return {
      message:
        'Batas frekuensi permintaan sementara tercapai (429 Rate Limit). Mohon tunggu beberapa detik sebelum mencoba kembali.',
      isHighDemand: false,
      code: 429,
    };
  }

  return {
    message: innerMsg || 'Terjadi kendala pada layanan AI kurikulum.',
    isHighDemand: false,
    code,
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGeminiWithFallback(prompt: string, schema?: any) {
  // Sequence of approved models:
  // 1. gemini-3.8-flash (Primary text model)
  // 2. gemini-3.1-flash-lite (Ultra-fast, resilient lightweight model)
  // 3. gemini-flash-latest (Alias pointing to available flash tier)
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    const maxRetriesForModel = 2;
    for (let attempt = 1; attempt <= maxRetriesForModel; attempt++) {
      try {
        console.log(`[Gemini] Memanggil model ${modelName} (Percobaan ${attempt}/${maxRetriesForModel})...`);
        const config: any = {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        };
        if (schema) {
          config.responseSchema = schema;
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config,
        });

        const text = response.text?.trim();
        if (!text) {
          throw new Error(`Respons kosong diterima dari model ${modelName}`);
        }

        const parsed = JSON.parse(text);
        console.log(`[Gemini] Berhasil memperoleh hasil dengan model: ${modelName}`);
        return { data: parsed, modelUsed: modelName };
      } catch (err: any) {
        lastError = err;
        const errInfo = parseAndFormatError(err);
        console.warn(
          `[Gemini] Model ${modelName} percobaan ${attempt} gagal:`,
          errInfo.message,
          `(Status: ${errInfo.code || 'unknown'})`
        );

        if (errInfo.isHighDemand || errInfo.code === 429) {
          if (attempt < maxRetriesForModel) {
            const waitTime = attempt * 2000 + Math.floor(Math.random() * 1000);
            console.log(`[Gemini] Menunggu ${waitTime}ms sebelum mencoba ulang ${modelName}...`);
            await sleep(waitTime);
            continue;
          }
        } else {
          // If non-transient, skip to next model
          break;
        }
      }
    }
  }

  const finalFormatted = parseAndFormatError(lastError);
  const errorToThrow = new Error(finalFormatted.message);
  (errorToThrow as any).isHighDemand = finalFormatted.isHighDemand;
  (errorToThrow as any).code = finalFormatted.code;
  throw errorToThrow;
}

// API endpoint to analyze and formulate TP
app.post('/api/rumuskan-tp', async (req, res) => {
  try {
    const input = req.body;
    if (!input || !input.teksCP || !input.materiPokok) {
      return res.status(400).json({
        error: 'Data input tidak lengkap. Teks Capaian Pembelajaran dan Materi Pokok wajib diisi.',
      });
    }

    const prompt = `Analisis Capaian Pembelajaran (CP) dan rumuskan Tujuan Pembelajaran (TP) madrasah secara komprehensif, jujur, dan bergradasi logis berdasarkan data berikut:
- Nama Madrasah: ${input.namaMadrasah || '(Tidak disebutkan)'}
- Jenjang: ${input.jenjang}
- Mata Pelajaran: ${input.mataPelajaran}
- Fase dan Kelas: ${input.faseKelas}
- Semester: ${input.semester}
- Elemen CP: ${input.elemenCP || '-'}
- Teks Capaian Pembelajaran (CP):
"""
${input.teksCP}
"""
- Materi Pokok / Topik:
"""
${input.materiPokok}
"""
- Alokasi Waktu: ${input.alokasiJP} JP (${input.alokasiPertemuan} pertemuan)
- Catatan Tambahan Guru (Konteks lokal / peserta didik):
"""
${input.catatanGuru || 'Tidak ada catatan khusus.'}
"""

Ikuti instruksi sistem secara disiplin. Pastikan rumusan TP logis, tidak berlebihan, terukur, level Bloom & SOLO tepat, KBC berbasis perilaku nyata yang dapat diamati, dan rujukan Al-Qur'an/Hadis/Kitab Kuning jujur secara akademis.`;

    const { data, modelUsed } = await callGeminiWithFallback(prompt, RESPONSE_SCHEMA);
    res.json({ success: true, data, modelUsed });
  } catch (error: any) {
    console.error('Error in /api/rumuskan-tp:', error);
    const formatted = parseAndFormatError(error);
    res.status(formatted.code === 503 ? 503 : 500).json({
      success: false,
      error: formatted.message,
      isHighDemand: formatted.isHighDemand,
    });
  }
});

// API endpoint to regenerate a specific section
app.post('/api/regenerate-section', async (req, res) => {
  try {
    const { input, currentData, section, instructions } = req.body;
    if (!input || !currentData || !section) {
      return res.status(400).json({ error: 'Parameter input, currentData, dan section wajib ada.' });
    }

    let sectionPrompt = '';
    let sectionSchema: any = null;

    if (section === 'analisisCP') {
      sectionPrompt = `Buat ulang HANYA bagian Analisis CP (A) untuk:
Mata Pelajaran: ${input.mataPelajaran} (${input.jenjang}, ${input.faseKelas})
Materi: ${input.materiPokok}
Teks CP: "${input.teksCP}"
Petunjuk khusus guru: ${instructions || 'Perjelas uraian kompetensi, pengetahuan, keterampilan, konteks penerapan, dan potensi karakter.'}
Kembalikan HANYA objek JSON dengan format:
{
  "analisisCP": {
    "tabel": [{ "cp": "", "kompetensi": "", "pengetahuan": "", "keterampilan": "", "kompleksitas": "" }],
    "konteksPenerapan": "",
    "potensiKarakter": ""
  }
}`;
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          analisisCP: RESPONSE_SCHEMA.properties.analisisCP,
        },
        required: ['analisisCP'],
      };
    } else if (section === 'analisisMateri') {
      sectionPrompt = `Buat ulang HANYA bagian Analisis Materi (B) untuk:
Materi: ${input.materiPokok}
Jenjang: ${input.jenjang} (${input.faseKelas})
Petunjuk khusus guru: ${instructions || 'Pecah materi secara runtut dan logis dari konsep dasar hingga pemecahan masalah/kreasi.'}
Kembalikan HANYA objek JSON dengan format:
{
  "analisisMateri": [{ "urutan": 1, "tahap": "konsep dasar|keterkaitan konsep|penerapan|penalaran|pemecahan masalah|kreasi/komunikasi", "submateri": "", "deskripsi": "" }],
  "catatanTahapTidakDigunakan": ""
}`;
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          analisisMateri: RESPONSE_SCHEMA.properties.analisisMateri,
          catatanTahapTidakDigunakan: RESPONSE_SCHEMA.properties.catatanTahapTidakDigunakan,
        },
        required: ['analisisMateri', 'catatanTahapTidakDigunakan'],
      };
    } else if (section === 'tujuanPembelajaran') {
      sectionPrompt = `Buat ulang HANYA bagian Tujuan Pembelajaran (C, D, E, F, G) untuk:
Mata Pelajaran: ${input.mataPelajaran} (${input.jenjang}, ${input.faseKelas})
Materi: ${input.materiPokok}
Teks CP: "${input.teksCP}"
Petunjuk khusus guru: ${instructions || 'Susun TP bergradasi terukur dengan level Bloom dan SOLO yang proporsional. Alokasi waktu tidak dicantumkan di sini karena dialihkan ke ATP.'}
Kembalikan HANYA objek JSON dengan format:
{
  "pemilihanLevelKognitif": { "rentangBloom": "", "alasan": "" },
  "tujuanPembelajaran": [{ "kode": "TP.1", "gradasi": "awal|pengembangan|penerapan|penalaran/pemecahan masalah|pengembangan/transfer", "rumusan": "", "kko": "", "levelBloom": "C1-C6", "levelSOLO": "Unistructural|Multistructural|Relational|Extended Abstract", "alasanLevel": "", "buktiKetercapaian": "" }]
}`;
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          pemilihanLevelKognitif: RESPONSE_SCHEMA.properties.pemilihanLevelKognitif,
          tujuanPembelajaran: RESPONSE_SCHEMA.properties.tujuanPembelajaran,
        },
        required: ['pemilihanLevelKognitif', 'tujuanPembelajaran'],
      };
    } else if (section === 'alurTujuanPembelajaran') {
      sectionPrompt = `Petakan ulang HANYA bagian Alur Tujuan Pembelajaran (ATP) dan Alokasi Waktu berdasarkan daftar TP dan alokasi waktu guru berikut:
Total Alokasi Waktu: ${input.alokasiJP} JP (${input.alokasiPertemuan} Pertemuan)
Materi Pokok: ${input.materiPokok}
Daftar TP:
${JSON.stringify(currentData.tujuanPembelajaran, null, 2)}
Petunjuk khusus guru: ${instructions || 'Susun alur pembelajaran kronologis dari dasar ke mahir dengan alokasi JP per alur yang proporsional sehingga total alokasiJP tepat sama dengan total alokasi waktu target.'}
Kembalikan HANYA objek JSON dengan format:
{
  "alurTujuanPembelajaran": [
    {
      "urutanAlur": 1,
      "kodeTP": "TP.1",
      "rumusanTP": "",
      "lingkupMateri": "",
      "alokasiJP": 2,
      "alokasiPertemuan": "Pertemuan 1 (2 JP)",
      "rencanaAsesmen": "",
      "kegiatanPembelajaranInti": ""
    }
  ]
}`;
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          alurTujuanPembelajaran: RESPONSE_SCHEMA.properties.alurTujuanPembelajaran,
        },
        required: ['alurTujuanPembelajaran'],
      };
    } else if (section === 'integrasiKBC') {
      sectionPrompt = `Buat ulang HANYA bagian Integrasi Kurikulum Berbasis Cinta (KBC - Bagian H) berdasarkan daftar TP berikut:
${JSON.stringify(currentData.tujuanPembelajaran, null, 2)}
Petunjuk khusus guru: ${instructions || 'Pastikan rumusan Panca Cinta memuat perilaku yang dapat diamati dan penerapan kehidupan yang nyata, hindari slogan tak terukur.'}
Kembalikan HANYA objek JSON dengan format:
{
  "integrasiKBC": [{ "kodeTP": "", "nilaiPancaCinta": [""], "rumusan": "", "perilakuTeramati": "", "penerapanKehidupan": "" }]
}`;
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          integrasiKBC: RESPONSE_SCHEMA.properties.integrasiKBC,
        },
        required: ['integrasiKBC'],
      };
    } else if (section === 'integrasiKeislaman') {
      sectionPrompt = `Buat ulang HANYA bagian Integrasi Al-Qur'an / Hadis / Kitab Kuning (Bagian I) untuk topik:
Materi: ${input.materiPokok}
Mata Pelajaran: ${input.mataPelajaran} (${input.jenjang})
Petunjuk khusus guru: ${instructions || 'Jaga kejujuran akademik mutlak. Jika teks Arab ragu, kosongkan teks Arab dan cantumkan rujukan serta maknanya.'}
Kembalikan HANYA objek JSON dengan format:
{
  "integrasiKeislaman": [{ "jenisSumber": "Al-Qur'an|Hadis|Kitab Kuning", "rujukan": "", "teksArab": "", "terjemahanAtauMakna": "", "jenisIntegrasi": "konseptual|nilai", "keterkaitan": "", "tingkatKeyakinan": "tinggi|sedang|rendah" }],
  "catatanKejujuranSumber": ""
}`;
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          integrasiKeislaman: RESPONSE_SCHEMA.properties.integrasiKeislaman,
          catatanKejujuranSumber: RESPONSE_SCHEMA.properties.catatanKejujuranSumber,
        },
        required: ['integrasiKeislaman', 'catatanKejujuranSumber'],
      };
    } else {
      return res.status(400).json({ error: 'Section tidak dikenali.' });
    }

    const { data, modelUsed } = await callGeminiWithFallback(sectionPrompt, sectionSchema);
    res.json({ success: true, updatedSection: data, modelUsed });
  } catch (error: any) {
    console.error('Error in /api/regenerate-section:', error);
    const formatted = parseAndFormatError(error);
    res.status(formatted.code === 503 ? 503 : 500).json({
      success: false,
      error: formatted.message,
      isHighDemand: formatted.isHighDemand,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server PERTAMA running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
