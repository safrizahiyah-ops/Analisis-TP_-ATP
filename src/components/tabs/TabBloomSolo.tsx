import React, { useRef, useState } from 'react';
import { TujuanPembelajaranItem, PemilihanLevelKognitif } from '../../types';
import { BLOOM_INFO, SOLO_INFO } from '../../utils/constants';
import { copyTableToClipboard } from '../../utils/copyTable';
import { Copy, Check, Edit3, Save, RefreshCw, HelpCircle, Layers, Lightbulb } from 'lucide-react';

interface TabBloomSoloProps {
  tujuanPembelajaran: TujuanPembelajaranItem[];
  pemilihanLevel: PemilihanLevelKognitif;
  onUpdate: (tpList: TujuanPembelajaranItem[], levelKognitif: PemilihanLevelKognitif) => void;
  onRegenerate: () => void;
}

export const TabBloomSolo: React.FC<TabBloomSoloProps> = ({
  tujuanPembelajaran,
  pemilihanLevel,
  onUpdate,
  onRegenerate,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tpList, setTpList] = useState<TujuanPembelajaranItem[]>(tujuanPembelajaran);
  const [levelConfig, setLevelConfig] = useState<PemilihanLevelKognitif>(pemilihanLevel);

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdate(tpList, levelConfig);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Bagian C–E: Penyelarasan Taksonomi Bloom Revisi & SOLO
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bloom menentukan proses berpikir (C1–C6), sedangkan SOLO menentukan kedalaman struktur pemahaman konsep.
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
                setTpList(tujuanPembelajaran);
                setLevelConfig(pemilihanLevel);
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
            title="Buat ulang bagian Level Kognitif & TP"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buat Ulang</span>
          </button>
        </div>
      </div>

      {/* Rationale & Cognitive Range Card */}
      <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200/80">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Landasan Pemilihan Level Kognitif & Rentang Bloom
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-700 text-white shadow-2xs">
                Rentang: {levelConfig.rentangBloom}
              </span>
            </div>
            {isEditing ? (
              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  value={levelConfig.rentangBloom}
                  onChange={(e) => setLevelConfig({ ...levelConfig, rentangBloom: e.target.value })}
                  placeholder="Rentang Bloom, misal: C2 - C4"
                  className="w-full text-xs p-2 bg-white border border-emerald-300 rounded font-bold"
                />
                <textarea
                  rows={2}
                  value={levelConfig.alasan}
                  onChange={(e) => setLevelConfig({ ...levelConfig, alasan: e.target.value })}
                  placeholder="Alasan akademik pemilihan level..."
                  className="w-full text-xs p-2 bg-white border border-emerald-300 rounded"
                />
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                {pemilihanLevel.alasan}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Guide/Legend Bloom & SOLO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bloom Legend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Panduan Taksonomi Bloom Revisi (Proses Kognitif)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(BLOOM_INFO).map(([key, info]) => (
              <div key={key} className={`p-2 rounded-lg border text-xs ${info.badgeBg} ${info.badgeBorder}`}>
                <span className={`font-bold block ${info.badgeText}`}>{key}</span>
                <span className="text-[11px] text-slate-600 block line-clamp-1">{info.label.split(' - ')[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SOLO Legend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Panduan Taksonomi SOLO (Kedalaman Struktur Pemahaman)
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SOLO_INFO).filter(([k]) => k !== 'Prestructural').map(([key, info]) => (
              <div key={key} className={`p-2 rounded-lg border text-xs ${info.badgeBg} ${info.badgeBorder}`}>
                <span className={`font-bold block ${info.badgeText}`}>{key}</span>
                <span className="text-[11px] text-slate-600 block line-clamp-1">{info.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table of Bloom & SOLO per TP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white border-b border-emerald-800">
                <th className="py-3 px-3 font-semibold text-center w-14">Kode</th>
                <th className="py-3 px-4 font-semibold min-w-[260px]">Rumusan TP & Kata Kerja Operasional (KKO)</th>
                <th className="py-3 px-3 font-semibold text-center w-28">Level Bloom</th>
                <th className="py-3 px-3 font-semibold text-center w-36">Level SOLO</th>
                <th className="py-3 px-4 font-semibold min-w-[240px]">Alasan Hubungan & Penetapan Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(isEditing ? tpList : tujuanPembelajaran).map((tp, idx) => {
                const bloomMeta = BLOOM_INFO[tp.levelBloom] || BLOOM_INFO['C3'];
                const soloMeta = SOLO_INFO[tp.levelSOLO] || SOLO_INFO['Relational'];

                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-center text-emerald-900 align-top">
                      {tp.kode}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 align-top">
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={2}
                            value={tp.rumusan}
                            onChange={(e) => handleTPChange(idx, 'rumusan', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-xs"
                          />
                          <input
                            type="text"
                            value={tp.kko}
                            onChange={(e) => handleTPChange(idx, 'kko', e.target.value)}
                            placeholder="KKO Utama"
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-slate-900 leading-relaxed mb-1">{tp.rumusan}</p>
                          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            KKO: <strong>{tp.kko}</strong>
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center align-top">
                      {isEditing ? (
                        <select
                          value={tp.levelBloom}
                          onChange={(e) => handleTPChange(idx, 'levelBloom', e.target.value)}
                          className="p-1 border border-slate-300 rounded text-xs font-bold"
                        >
                          {Object.keys(BLOOM_INFO).map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div>
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${bloomMeta.badgeBg} ${bloomMeta.badgeText} border ${bloomMeta.badgeBorder}`}
                          >
                            {tp.levelBloom}
                          </span>
                          <span className="block text-[11px] text-slate-500 mt-0.5">
                            {bloomMeta.label.split(' - ')[1]}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center align-top">
                      {isEditing ? (
                        <select
                          value={tp.levelSOLO}
                          onChange={(e) => handleTPChange(idx, 'levelSOLO', e.target.value)}
                          className="p-1 border border-slate-300 rounded text-xs"
                        >
                          {Object.keys(SOLO_INFO).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div>
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg ${soloMeta.badgeBg} ${soloMeta.badgeText} border ${soloMeta.badgeBorder}`}
                          >
                            {tp.levelSOLO}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs leading-relaxed align-top">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={tp.alasanLevel}
                          onChange={(e) => handleTPChange(idx, 'alasanLevel', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        tp.alasanLevel
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
