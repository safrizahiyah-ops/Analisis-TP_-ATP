import React, { useRef, useState } from 'react';
import { TujuanPembelajaranItem, FormInputData } from '../../types';
import { validasiTujuanPembelajaran } from '../../utils/validation';
import { copyTableToClipboard } from '../../utils/copyTable';
import { Copy, Check, Edit3, Save, RefreshCw, AlertTriangle, AlertCircle, Sparkles, Route } from 'lucide-react';

interface TabGradasiTPProps {
  tujuanPembelajaran: TujuanPembelajaranItem[];
  input: FormInputData;
  onUpdate: (tpList: TujuanPembelajaranItem[]) => void;
  onRegenerate: () => void;
  onNavigateToATP?: () => void;
}

const GRADASI_ORDER = [
  'awal',
  'pengembangan',
  'penerapan',
  'penalaran/pemecahan masalah',
  'pengembangan/transfer',
];

const GRADASI_BADGE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  awal: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  pengembangan: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  penerapan: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  'penalaran/pemecahan masalah': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'pengembangan/transfer': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
};

export const TabGradasiTP: React.FC<TabGradasiTPProps> = ({
  tujuanPembelajaran,
  input,
  onUpdate,
  onRegenerate,
  onNavigateToATP,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tpList, setTpList] = useState<TujuanPembelajaranItem[]>(tujuanPembelajaran);

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdate(tpList);
    setIsEditing(false);
  };

  const handleTPChange = (index: number, field: string, value: any) => {
    const updated = [...tpList];
    updated[index] = { ...updated[index], [field]: value };
    setTpList(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            Bagian F–G: Rumusan Tujuan Pembelajaran (TP) Bergradasi
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Disusun bertahap: TP Awal → Pengembangan → Penerapan → Pemecahan Masalah → Transfer. Setiap TP fokus satu kompetensi utama.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan TP</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTpList(tujuanPembelajaran);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit TP</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Salin Tabel'}</span>
          </button>

          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
            title="Buat ulang rumusan TP"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Buat Ulang</span>
          </button>
        </div>
      </div>

      {/* Info Notice: Alokasi Waktu kini diatur di ATP */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Route className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Informasi Kurikulum:</strong> Alokasi waktu (JP dan pertemuan) kini dikelola secara terpusat pada tab <strong>Alur Tujuan Pembelajaran (ATP)</strong>.
          </span>
        </div>
        {onNavigateToATP && (
          <button
            onClick={onNavigateToATP}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0"
          >
            <span>Buka Tab ATP</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* TP Table without JP column */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white border-b border-emerald-800">
                <th className="py-3 px-3 font-semibold text-center w-14">Kode</th>
                <th className="py-3 px-3 font-semibold w-28">Gradasi</th>
                <th className="py-3 px-4 font-semibold min-w-[280px]">Rumusan Tujuan Pembelajaran (TP)</th>
                <th className="py-3 px-4 font-semibold min-w-[240px]">Bukti Ketercapaian (Kriteria Asesmen)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(isEditing ? tpList : tujuanPembelajaran).map((tp, idx) => {
                const validation = validasiTujuanPembelajaran(tp);
                const gradasiStyle =
                  GRADASI_BADGE_STYLE[tp.gradasi.toLowerCase()] || GRADASI_BADGE_STYLE['penerapan'];

                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-center text-emerald-900 align-top">
                      {tp.kode}
                    </td>

                    <td className="py-3.5 px-3 align-top">
                      {isEditing ? (
                        <select
                          value={tp.gradasi}
                          onChange={(e) => handleTPChange(idx, 'gradasi', e.target.value)}
                          className="w-full p-1 border border-slate-300 rounded text-xs"
                        >
                          {GRADASI_ORDER.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${gradasiStyle.bg} ${gradasiStyle.text} border ${gradasiStyle.border}`}
                        >
                          {tp.gradasi}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 align-top">
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={3}
                            value={tp.rumusan}
                            onChange={(e) => handleTPChange(idx, 'rumusan', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-xs leading-relaxed"
                          />
                          <input
                            type="text"
                            value={tp.kko}
                            onChange={(e) => handleTPChange(idx, 'kko', e.target.value)}
                            placeholder="KKO"
                            className="w-full p-1 border border-slate-300 rounded text-xs"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-slate-900 leading-relaxed mb-1.5">
                            {tp.rumusan}
                          </p>

                          {/* KKO & Format verification */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-slate-500">KKO:</span>
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {tp.kko}
                            </span>
                          </div>

                          {/* Validation Warnings */}
                          {validation.hasTooManyKKO && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>{validation.kkoWarning}</span>
                            </div>
                          )}

                          {validation.isPrestructural && (
                            <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-1.5">
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <span>{validation.prestructuralWarning}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 text-xs leading-relaxed align-top">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={tp.buktiKetercapaian}
                          onChange={(e) => handleTPChange(idx, 'buktiKetercapaian', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded text-xs leading-relaxed"
                        />
                      ) : (
                        tp.buktiKetercapaian
                      )}
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

