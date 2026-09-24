import React, { useRef, useState } from 'react';
import { SubmateriItem } from '../../types';
import { copyTableToClipboard } from '../../utils/copyTable';
import { Copy, Check, Edit3, Save, RefreshCw, ArrowDown, ArrowRight, Layers, AlertCircle } from 'lucide-react';

interface TabAnalisisMateriProps {
  data: SubmateriItem[];
  catatanTahapTidakDigunakan?: string;
  onUpdate: (updated: SubmateriItem[], catatan?: string) => void;
  onRegenerate: () => void;
}

const TAHAP_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'konsep dasar': { bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-900', dot: 'bg-emerald-600' },
  'keterkaitan konsep': { bg: 'bg-teal-50/70', border: 'border-teal-200', text: 'text-teal-900', dot: 'bg-teal-600' },
  'penerapan': { bg: 'bg-sky-50/70', border: 'border-sky-200', text: 'text-sky-900', dot: 'bg-sky-600' },
  'penalaran': { bg: 'bg-indigo-50/70', border: 'border-indigo-200', text: 'text-indigo-900', dot: 'bg-indigo-600' },
  'pemecahan masalah': { bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-900', dot: 'bg-amber-600' },
  'kreasi/komunikasi': { bg: 'bg-purple-50/70', border: 'border-purple-200', text: 'text-purple-900', dot: 'bg-purple-600' },
};

export const TabAnalisisMateri: React.FC<TabAnalisisMateriProps> = ({
  data,
  catatanTahapTidakDigunakan,
  onUpdate,
  onRegenerate,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<SubmateriItem[]>(data);
  const [catatan, setCatatan] = useState<string>(catatanTahapTidakDigunakan || '');

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdate(items, catatan);
    setIsEditing(false);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Bagian B: Analisis Materi Pembelajaran & Diagram Alur
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pecahan submateri berurutan secara psikopedagogis: Konsep Dasar → Keterkaitan → Penerapan → Pemecahan Masalah.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setItems(data);
                setCatatan(catatanTahapTidakDigunakan || '');
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Bagian Ini</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Tabel'}</span>
          </button>

          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
            title="Buat ulang hanya bagian Analisis Materi"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buat Ulang</span>
          </button>
        </div>
      </div>

      {/* Catatan Tahap Tidak Digunakan */}
      {(catatanTahapTidakDigunakan || isEditing) && (
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
              Catatan Akademik Tahap Perkembangan Materi
            </span>
            {isEditing ? (
              <textarea
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Jelaskan alasan jika ada tahapan kognitif yang tidak digunakan..."
                className="w-full text-xs sm:text-sm p-2 bg-white border border-amber-300 rounded"
              />
            ) : (
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {catatanTahapTidakDigunakan}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Visual Diagram Alur Bertingkat dengan Panah */}
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Diagram Alur Progresi Kognitif Submateri</span>
        </div>

        <div className="space-y-3">
          {(isEditing ? items : data).map((item, idx, arr) => {
            const tahapKey = (item.tahap || '').toLowerCase().trim();
            const colors = TAHAP_COLORS[tahapKey] || {
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
              text: 'text-emerald-900',
              dot: 'bg-emerald-600',
            };

            return (
              <div key={idx} className="relative">
                <div
                  className={`p-4 sm:p-5 rounded-xl border ${colors.bg} ${colors.border} transition shadow-2xs hover:shadow-xs`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-white font-extrabold text-xs flex items-center justify-center text-slate-800 shadow-2xs border border-slate-200">
                        {item.urutan || idx + 1}
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/80 border ${colors.border} ${colors.text}`}>
                        {item.tahap}
                      </span>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        value={item.submateri}
                        onChange={(e) => handleItemChange(idx, 'submateri', e.target.value)}
                        placeholder="Nama Submateri"
                        className="w-full text-sm font-bold p-2 bg-white border border-slate-300 rounded"
                      />
                      <textarea
                        rows={2}
                        value={item.deskripsi}
                        onChange={(e) => handleItemChange(idx, 'deskripsi', e.target.value)}
                        placeholder="Deskripsi pembelajaran..."
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                        {item.submateri}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </div>
                  )}
                </div>

                {/* Arrow connector between steps */}
                {idx < arr.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hidden/Collapsible Data Table for Copy/Export */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Format Tabel Analisis Materi</span>
          <span className="text-xs text-slate-400">Dapat disalin langsung ke Word / Excel</span>
        </div>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white">
                <th className="py-2.5 px-3 font-semibold text-center w-12">No</th>
                <th className="py-2.5 px-4 font-semibold w-1/4">Tahap Perkembangan</th>
                <th className="py-2.5 px-4 font-semibold w-1/3">Submateri / Topik</th>
                <th className="py-2.5 px-4 font-semibold">Deskripsi Kegiatan Pembelajaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-600 align-top">{m.urutan || idx + 1}</td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-900 align-top">{m.tahap}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-800 align-top">{m.submateri}</td>
                  <td className="py-2.5 px-4 text-slate-700 leading-relaxed align-top">{m.deskripsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
