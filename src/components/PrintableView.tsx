import React from 'react';
import { HasilPerumusanTP, FormInputData } from '../types';
import { BLOOM_INFO, SOLO_INFO } from '../utils/constants';
import { ensureAlurTujuanPembelajaran } from '../utils/atpHelper';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintableViewProps {
  input: FormInputData;
  data: HasilPerumusanTP;
  onBack: () => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({
  input,
  data,
  onBack,
}) => {
  const atpList = ensureAlurTujuanPembelajaran(data, input);
  const totalAtpJP = atpList.reduce((acc, curr) => acc + (Number(curr.alokasiJP) || 0), 0);

  const getPancaCintaText = (kode: string) => {
    const kbc = data.integrasiKBC.find((k) => k.kodeTP === kode);
    if (!kbc) return '-';
    return Array.isArray(kbc.nilaiPancaCinta) ? kbc.nilaiPancaCinta.join(', ') : String(kbc.nilaiPancaCinta);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      {/* Top Floating Controls (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Editor</span>
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-800 rounded-xl shadow-md hover:bg-emerald-900 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan ke PDF Sekarang</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 text-slate-900">
        {/* Kop Surat Madrasah */}
        <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Kementerian Agama Republik Indonesia
          </h4>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-emerald-900 mt-1">
            {input.namaMadrasah || `Madrasah ${input.jenjang}`}
          </h2>
          <p className="text-xs sm:text-sm font-semibold uppercase text-slate-700 mt-1">
            Dokumen Perencanaan Pembelajaran: Analisis Capaian Pembelajaran (CP) dan Perumusan Tujuan Pembelajaran (TP)
          </p>
          <p className="text-xs text-slate-500 italic mt-0.5">
            Terintegrasi Taksonomi Bloom Revisi, SOLO, Kurikulum Berbasis Cinta (KBC), dan Sumber Keislaman
          </p>
        </div>

        {/* Identitas Modul / Mapel */}
        <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm grid grid-cols-2 gap-y-2 gap-x-4">
          <div>
            <span className="font-bold text-slate-600">Satuan Pendidikan:</span>{' '}
            <span className="font-semibold text-slate-900">{input.namaMadrasah || `Madrasah (${input.jenjang})`}</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Mata Pelajaran:</span>{' '}
            <span className="font-semibold text-slate-900">{input.mataPelajaran} ({input.jenjang})</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Fase / Kelas:</span>{' '}
            <span className="font-semibold text-slate-900">{input.faseKelas} · Semester {input.semester}</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Elemen CP:</span>{' '}
            <span className="font-semibold text-slate-900">{input.elemenCP || '-'}</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Materi Pokok:</span>{' '}
            <span className="font-semibold text-slate-900">{input.materiPokok}</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Alokasi Waktu:</span>{' '}
            <span className="font-semibold text-slate-900">
              {input.alokasiJP} JP ({input.alokasiPertemuan} Pertemuan) · Total Terencana: {totalAtpJP} JP
            </span>
          </div>
        </div>

        {/* Section A: Analisis CP */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-2 border-b border-emerald-800 pb-1">
            A. Analisis Capaian Pembelajaran (CP)
          </h3>
          <p className="text-xs text-slate-600 italic mb-2">
            <strong>Teks CP:</strong> "{input.teksCP}"
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
            <div className="p-2.5 bg-slate-50 border rounded">
              <strong>Konteks Penerapan:</strong> {data.analisisCP.konteksPenerapan}
            </div>
            <div className="p-2.5 bg-slate-50 border rounded">
              <strong>Potensi Karakter:</strong> {data.analisisCP.potensiKarakter}
            </div>
          </div>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 w-1/4">CP</th>
                <th className="p-2 border-r border-slate-300 w-1/5">Kompetensi</th>
                <th className="p-2 border-r border-slate-300 w-1/5">Pengetahuan</th>
                <th className="p-2 border-r border-slate-300 w-1/5">Keterampilan</th>
                <th className="p-2 w-[15%]">Kompleksitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.analisisCP.tabel.map((r, i) => (
                <tr key={i}>
                  <td className="p-2 border-r border-slate-200 align-top">{r.cp}</td>
                  <td className="p-2 border-r border-slate-200 align-top">{r.kompetensi}</td>
                  <td className="p-2 border-r border-slate-200 align-top">{r.pengetahuan}</td>
                  <td className="p-2 border-r border-slate-200 align-top">{r.keterampilan}</td>
                  <td className="p-2 align-top font-semibold">{r.kompleksitas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section B: Analisis Materi */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-2 border-b border-emerald-800 pb-1">
            B. Analisis Materi Pembelajaran Berurutan
          </h3>
          {data.catatanTahapTidakDigunakan && (
            <p className="text-xs text-amber-900 italic mb-2">
              <strong>Catatan Tahap Perkembangan:</strong> {data.catatanTahapTidakDigunakan}
            </p>
          )}
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 w-10 text-center">No</th>
                <th className="p-2 border-r border-slate-300 w-1/4">Tahap Perkembangan</th>
                <th className="p-2 border-r border-slate-300 w-1/4">Submateri / Topik</th>
                <th className="p-2">Deskripsi Pembelajaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.analisisMateri.map((m, i) => (
                <tr key={i}>
                  <td className="p-2 border-r border-slate-200 text-center font-bold align-top">{m.urutan || i + 1}</td>
                  <td className="p-2 border-r border-slate-200 font-semibold align-top">{m.tahap}</td>
                  <td className="p-2 border-r border-slate-200 font-bold align-top">{m.submateri}</td>
                  <td className="p-2 align-top">{m.deskripsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section C-E: Bloom & SOLO */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-2 border-b border-emerald-800 pb-1">
            C–E. Penyelarasan Taksonomi Bloom Revisi dan SOLO
          </h3>
          <p className="text-xs text-slate-700 mb-2">
            <strong>Rentang Kognitif:</strong> {data.pemilihanLevelKognitif.rentangBloom} —{' '}
            <span className="italic">{data.pemilihanLevelKognitif.alasan}</span>
          </p>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 text-center w-12">Kode</th>
                <th className="p-2 border-r border-slate-300">Rumusan TP</th>
                <th className="p-2 border-r border-slate-300 text-center w-24">Bloom</th>
                <th className="p-2 border-r border-slate-300 text-center w-28">SOLO</th>
                <th className="p-2 w-1/3">Alasan Penetapan Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.tujuanPembelajaran.map((tp, i) => (
                <tr key={i}>
                  <td className="p-2 border-r border-slate-200 text-center font-bold align-top">{tp.kode}</td>
                  <td className="p-2 border-r border-slate-200 align-top font-medium">{tp.rumusan}</td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold align-top">{tp.levelBloom}</td>
                  <td className="p-2 border-r border-slate-200 text-center font-semibold align-top">{tp.levelSOLO}</td>
                  <td className="p-2 align-top text-slate-600">{tp.alasanLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section F-G: TP Bergradasi */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-2 border-b border-emerald-800 pb-1">
            F. Rumusan Tujuan Pembelajaran (TP) Bergradasi
          </h3>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 text-center w-14">Kode</th>
                <th className="p-2 border-r border-slate-300 w-28">Gradasi</th>
                <th className="p-2 border-r border-slate-300">Rumusan TP</th>
                <th className="p-2 w-1/3">Bukti Ketercapaian (Asesmen)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.tujuanPembelajaran.map((tp, i) => (
                <tr key={i}>
                  <td className="p-2 border-r border-slate-200 text-center font-bold align-top">{tp.kode}</td>
                  <td className="p-2 border-r border-slate-200 align-top font-semibold">{tp.gradasi}</td>
                  <td className="p-2 border-r border-slate-200 align-top font-medium leading-relaxed">{tp.rumusan}</td>
                  <td className="p-2 align-top text-slate-700">{tp.buktiKetercapaian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section G: Alur Tujuan Pembelajaran (ATP) */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-2 border-b border-emerald-800 pb-1">
            G. Alur Tujuan Pembelajaran (ATP) & Alokasi Waktu
          </h3>
          <p className="text-xs text-slate-600 mb-2 italic">
            Alur kronologis-pedagogis yang memetakan urutan TP beserta alokasi waktu (JP dan pertemuan) dan rencana asesmen.
          </p>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 text-center w-12">Alur</th>
                <th className="p-2 border-r border-slate-300 w-2/5">Tujuan Pembelajaran (TP)</th>
                <th className="p-2 border-r border-slate-300 w-1/5">Lingkup Materi</th>
                <th className="p-2 border-r border-slate-300 text-center w-28">Alokasi Waktu</th>
                <th className="p-2 w-1/4">Rencana Asesmen / Kegiatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {atpList.map((atp, i) => (
                <tr key={i}>
                  <td className="p-2 border-r border-slate-200 text-center font-bold align-top">{atp.urutanAlur || i + 1}</td>
                  <td className="p-2 border-r border-slate-200 align-top">
                    <span className="font-bold text-emerald-900 mr-1.5">[{atp.kodeTP}]</span>
                    <span>{atp.rumusanTP}</span>
                  </td>
                  <td className="p-2 border-r border-slate-200 align-top font-medium">{atp.lingkupMateri}</td>
                  <td className="p-2 border-r border-slate-200 text-center align-top whitespace-nowrap">
                    <div className="font-bold text-slate-900">{atp.alokasiJP} JP</div>
                    <div className="text-[11px] text-slate-500">{atp.alokasiPertemuan}</div>
                  </td>
                  <td className="p-2 align-top text-slate-600 text-[11px] leading-relaxed">
                    {atp.rencanaAsesmen || atp.kegiatanPembelajaranInti || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-300">
                <td colSpan={3} className="p-2 text-right">Total Alokasi Waktu ATP:</td>
                <td className="p-2 text-center text-emerald-900 font-black whitespace-nowrap">{totalAtpJP} JP</td>
                <td className="p-2 text-slate-500 text-[11px]">Target: {input.alokasiJP} JP ({input.alokasiPertemuan} Pertemuan)</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section H: KBC */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-2 border-b border-emerald-800 pb-1">
            H. Integrasi Kurikulum Berbasis Cinta (KBC)
          </h3>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 text-center w-12">Kode</th>
                <th className="p-2 border-r border-slate-300 w-1/4">Nilai Panca Cinta</th>
                <th className="p-2 border-r border-slate-300 w-1/4">Rumusan KBC</th>
                <th className="p-2 border-r border-slate-300 w-1/5">Perilaku Teramati</th>
                <th className="p-2">Penerapan Kehidupan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.integrasiKBC.map((kbc, i) => (
                <tr key={i}>
                  <td className="p-2 border-r border-slate-200 text-center font-bold align-top">{kbc.kodeTP}</td>
                  <td className="p-2 border-r border-slate-200 font-semibold align-top">
                    {Array.isArray(kbc.nilaiPancaCinta) ? kbc.nilaiPancaCinta.join(', ') : String(kbc.nilaiPancaCinta)}
                  </td>
                  <td className="p-2 border-r border-slate-200 font-medium align-top">{kbc.rumusan}</td>
                  <td className="p-2 border-r border-slate-200 align-top">{kbc.perilakuTeramati}</td>
                  <td className="p-2 align-top">{kbc.penerapanKehidupan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section I: Keislaman */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-2 border-b border-emerald-800 pb-1">
            I. Integrasi Al-Qur'an, Hadis, & Kitab Kuning
          </h3>
          <p className="text-[11px] text-rose-700 font-semibold mb-2">
            * Verifikasi teks Arab, nomor ayat, dan terjemahan dengan Qur'an Kemenag (quran.kemenag.go.id) atau kitab asli sebelum digunakan.
          </p>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 w-1/4">Sumber & Rujukan</th>
                <th className="p-2 border-r border-slate-300 w-1/3">Teks Arab & Makna</th>
                <th className="p-2 border-r border-slate-300 text-center w-24">Integrasi</th>
                <th className="p-2">Keterkaitan Materi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.integrasiKeislaman.map((s, i) => (
                <tr key={i}>
                  <td className="p-2 border-r border-slate-200 font-bold align-top">
                    {s.jenisSumber} - {s.rujukan}
                    <span className="block font-normal text-slate-500 mt-1">Keyakinan: {s.tingkatKeyakinan}</span>
                  </td>
                  <td className="p-2 border-r border-slate-200 align-top">
                    {s.teksArab && (
                      <p dir="rtl" className="font-amiri text-sm mb-1 text-right">
                        {s.teksArab}
                      </p>
                    )}
                    <p className="italic text-slate-700">"{s.terjemahanAtauMakna}"</p>
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-semibold align-top">{s.jenisIntegrasi}</td>
                  <td className="p-2 align-top">{s.keterkaitan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan */}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <div className="text-right text-xs mb-8">
            Ditetapkan di: ......................................., Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-2 text-center text-xs">
            <div>
              <p className="font-bold">Mengetahui,</p>
              <p className="font-semibold text-slate-700">Kepala Madrasah</p>
              <div className="h-16"></div>
              <p className="font-bold underline">( _____________________________ )</p>
              <p className="text-slate-500">NIP. ......................................................</p>
            </div>
            <div>
              <p className="font-bold">Penyusun,</p>
              <p className="font-semibold text-slate-700">Guru Mata Pelajaran</p>
              <div className="h-16"></div>
              <p className="font-bold underline">( _____________________________ )</p>
              <p className="text-slate-500">NIP. ......................................................</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
