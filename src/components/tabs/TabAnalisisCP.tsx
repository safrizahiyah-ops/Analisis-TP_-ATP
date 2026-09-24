import React, { useRef, useState } from 'react';
import { AnalisisCPData } from '../../types';
import { copyTableToClipboard } from '../../utils/copyTable';
import { Copy, Check, Edit3, Save, RefreshCw, Compass, Sparkles } from 'lucide-react';

interface TabAnalisisCPProps {
  data: AnalisisCPData;
  onUpdate: (updated: AnalisisCPData) => void;
  onRegenerate: () => void;
}

export const TabAnalisisCP: React.FC<TabAnalisisCPProps> = ({
  data,
  onUpdate,
  onRegenerate,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<AnalisisCPData>(data);

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleRowChange = (index: number, field: string, value: string) => {
    const newTabel = [...editForm.tabel];
    newTabel[index] = { ...newTabel[index], [field]: value };
    setEditForm({ ...editForm, tabel: newTabel });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Bagian A: Analisis Capaian Pembelajaran (CP)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dekomposisi Capaian Pembelajaran menjadi kompetensi, pengetahuan, keterampilan, dan tingkat kompleksitas.
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
                setEditForm(data);
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
            title="Buat ulang hanya bagian Analisis CP"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buat Ulang</span>
          </button>
        </div>
      </div>

      {/* Konteks Penerapan & Potensi Penguatan Karakter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Konteks Penerapan Pembelajaran</span>
          </div>
          {isEditing ? (
            <textarea
              rows={3}
              value={editForm.konteksPenerapan}
              onChange={(e) => setEditForm({ ...editForm, konteksPenerapan: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-200"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {data.konteksPenerapan || 'Belum diuraikan.'}
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Potensi Penguatan Karakter Madrasah</span>
          </div>
          {isEditing ? (
            <textarea
              rows={3}
              value={editForm.potensiKarakter}
              onChange={(e) => setEditForm({ ...editForm, potensiKarakter: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-200"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {data.potensiKarakter || 'Belum diuraikan.'}
            </p>
          )}
        </div>
      </div>

      {/* Tabel Analisis CP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white border-b border-emerald-800">
                <th className="py-3 px-4 font-semibold w-1/4">Teks Capaian Pembelajaran (CP)</th>
                <th className="py-3 px-4 font-semibold w-1/5">Kompetensi Utama</th>
                <th className="py-3 px-4 font-semibold w-1/5">Pengetahuan Inti</th>
                <th className="py-3 px-4 font-semibold w-1/5">Keterampilan Konkret</th>
                <th className="py-3 px-4 font-semibold w-[15%]">Tingkat Kompleksitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(isEditing ? editForm.tabel : data.tabel).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-slate-800 font-medium leading-relaxed align-top">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={row.cp}
                        onChange={(e) => handleRowChange(idx, 'cp', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded text-xs"
                      />
                    ) : (
                      row.cp
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 align-top">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={row.kompetensi}
                        onChange={(e) => handleRowChange(idx, 'kompetensi', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded text-xs"
                      />
                    ) : (
                      row.kompetensi
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 align-top">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={row.pengetahuan}
                        onChange={(e) => handleRowChange(idx, 'pengetahuan', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded text-xs"
                      />
                    ) : (
                      row.pengetahuan
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 align-top">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={row.keterampilan}
                        onChange={(e) => handleRowChange(idx, 'keterampilan', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded text-xs"
                      />
                    ) : (
                      row.keterampilan
                    )}
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.kompleksitas}
                        onChange={(e) => handleRowChange(idx, 'kompleksitas', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded text-xs"
                      />
                    ) : (
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-900 border border-amber-200">
                        {row.kompleksitas}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
