import React, { useRef, useState } from 'react';
import { HasilPerumusanTP, FormInputData } from '../../types';
import { BLOOM_INFO, SOLO_INFO } from '../../utils/constants';
import { copyTableToClipboard } from '../../utils/copyTable';
import { Copy, Check, Info } from 'lucide-react';

interface TabRekapProps {
  data: HasilPerumusanTP;
  input: FormInputData;
  onNavigateToATP?: () => void;
}

export const TabRekap: React.FC<TabRekapProps> = ({ data, input, onNavigateToATP }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Map KBC to each TP
  const getPancaCintaForTP = (kode: string) => {
    const kbc = data.integrasiKBC.find((k) => k.kodeTP === kode);
    if (!kbc) return '-';
    if (Array.isArray(kbc.nilaiPancaCinta)) {
      return kbc.nilaiPancaCinta.join(', ');
    }
    return String(kbc.nilaiPancaCinta);
  };

  return (
    <div className="space-y-5">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            Rekapitulasi Rumusan Tujuan Pembelajaran (TP)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ringkasan rumusan TP mencakup proses kognitif Bloom, kedalaman SOLO, integrasi KBC, serta kriteria asesmen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToATP && (
            <button
              onClick={onNavigateToATP}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
            >
              <span>Lihat Alokasi Waktu di ATP</span>
              <span>→</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tabel Tersalin!' : 'Salin Tabel Rekap'}</span>
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Rumusan TP</span>
          <p className="text-xl font-extrabold text-emerald-800 mt-1">{data.tujuanPembelajaran.length} TP</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Alokasi Waktu (ATP)</span>
          <p className="text-base font-bold text-slate-800 mt-1">
            {input.alokasiJP} JP <span className="text-xs font-normal text-slate-500">({input.alokasiPertemuan} PTM)</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rentang Kognitif</span>
          <p className="text-base font-bold text-slate-800 mt-1">{data.pemilihanLevelKognitif.rentangBloom || 'C2 - C4'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Integrasi KBC</span>
          <p className="text-xl font-extrabold text-teal-800 mt-1">{data.integrasiKBC.length} Panca Cinta</p>
        </div>
      </div>

      {/* Table Container without JP column */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white border-b border-emerald-800">
                <th className="py-3 px-3 font-semibold text-center w-14">Kode</th>
                <th className="py-3 px-4 font-semibold min-w-[280px]">Rumusan Tujuan Pembelajaran (TP)</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Bloom</th>
                <th className="py-3 px-3 font-semibold text-center w-28">SOLO</th>
                <th className="py-3 px-4 font-semibold min-w-[190px]">Nilai Panca Cinta (KBC)</th>
                <th className="py-3 px-4 font-semibold min-w-[230px]">Bukti Ketercapaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.tujuanPembelajaran.map((tp, idx) => {
                const bloomMeta = BLOOM_INFO[tp.levelBloom] || BLOOM_INFO['C3'];
                const soloMeta = SOLO_INFO[tp.levelSOLO] || SOLO_INFO['Relational'];
                const pancaCinta = getPancaCintaForTP(tp.kode);

                return (
                  <tr key={tp.kode || idx} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-center text-emerald-900 align-top">
                      {tp.kode}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium leading-relaxed align-top">
                      {tp.rumusan}
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md ${bloomMeta.badgeBg} ${bloomMeta.badgeText} border ${bloomMeta.badgeBorder}`}>
                        {tp.levelBloom}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md ${soloMeta.badgeBg} ${soloMeta.badgeText} border ${soloMeta.badgeBorder}`}>
                        {tp.levelSOLO}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-xs leading-relaxed align-top">
                      {pancaCinta}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed align-top">
                      {tp.buktiKetercapaian}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
