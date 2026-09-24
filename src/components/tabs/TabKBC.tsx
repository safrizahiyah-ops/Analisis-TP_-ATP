import React, { useRef, useState } from 'react';
import { IntegrasiKBCItem } from '../../types';
import { PANCA_CINTA_META } from '../../utils/constants';
import { validasiIntegrasiKBC } from '../../utils/validation';
import { copyTableToClipboard } from '../../utils/copyTable';
import {
  Copy,
  Check,
  Edit3,
  Save,
  RefreshCw,
  HeartHandshake,
  BookOpen,
  Users,
  Sprout,
  Flag,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface TabKBCProps {
  data: IntegrasiKBCItem[];
  onUpdate: (updated: IntegrasiKBCItem[]) => void;
  onRegenerate: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  HeartHandshake: <HeartHandshake className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Sprout: <Sprout className="w-4 h-4" />,
  Flag: <Flag className="w-4 h-4" />,
};

const ALL_PANCA_CINTA = [
  'Cinta Allah dan Rasul-Nya',
  'Cinta Ilmu',
  'Cinta Diri dan Sesama',
  'Cinta Lingkungan',
  'Cinta Tanah Air',
];

export const TabKBC: React.FC<TabKBCProps> = ({
  data,
  onUpdate,
  onRegenerate,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [kbcList, setKbcList] = useState<IntegrasiKBCItem[]>(data);

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdate(kbcList);
    setIsEditing(false);
  };

  const handleKBCChange = (index: number, field: string, value: any) => {
    const updated = [...kbcList];
    updated[index] = { ...updated[index], [field]: value };
    setKbcList(updated);
  };

  const handleToggleNilai = (index: number, nilai: string) => {
    const current = kbcList[index];
    const existing = Array.isArray(current.nilaiPancaCinta)
      ? current.nilaiPancaCinta
      : [String(current.nilaiPancaCinta)];
    
    let updatedNilai: string[];
    if (existing.includes(nilai)) {
      updatedNilai = existing.filter((n) => n !== nilai);
    } else {
      updatedNilai = [...existing, nilai];
    }
    handleKBCChange(index, 'nilaiPancaCinta', updatedNilai);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Bagian H: Integrasi Kurikulum Berbasis Cinta (KBC)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Panca Cinta terintegrasi proporsional: perilaku teramati, sikap dikembangkan, dan aksi nyata dalam kehidupan.
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
                setKbcList(data);
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
            title="Buat ulang integrasi KBC"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buat Ulang</span>
          </button>
        </div>
      </div>

      {/* Panca Cinta Info Card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {ALL_PANCA_CINTA.map((pc) => {
          const meta = PANCA_CINTA_META[pc] || {
            ringkas: pc,
            icon: 'HeartHandshake',
            border: 'border-emerald-200',
            bg: 'bg-emerald-50',
            text: 'text-emerald-900',
          };
          return (
            <div
              key={pc}
              className={`p-3 rounded-xl border ${meta.bg} ${meta.border} flex items-center gap-2`}
            >
              <div className={meta.text}>{ICON_MAP[meta.icon]}</div>
              <span className={`text-xs font-bold ${meta.text}`}>{meta.ringkas}</span>
            </div>
          );
        })}
      </div>

      {/* Kartu KBC per TP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(isEditing ? kbcList : data).map((kbc, idx) => {
          const validation = validasiIntegrasiKBC(kbc);
          const rawValues = Array.isArray(kbc.nilaiPancaCinta)
            ? kbc.nilaiPancaCinta
            : [String(kbc.nilaiPancaCinta)];

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition space-y-4"
            >
              {/* Header card with TP code and Panca Cinta icons */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-sm text-emerald-950 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                  {kbc.kodeTP}
                </span>

                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                  {rawValues.map((val) => {
                    const meta = PANCA_CINTA_META[val] || {
                      ringkas: val,
                      icon: 'HeartHandshake',
                      border: 'border-slate-200',
                      bg: 'bg-slate-50',
                      text: 'text-slate-700',
                    };
                    return (
                      <span
                        key={val}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta.bg} ${meta.border} ${meta.text}`}
                      >
                        {ICON_MAP[meta.icon]}
                        <span>{meta.ringkas}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Editing Nilai Selector */}
              {isEditing && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Pilih Nilai Panca Cinta:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_PANCA_CINTA.map((val) => {
                      const isSelected = rawValues.includes(val);
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleToggleNilai(idx, val)}
                          className={`text-xs px-2 py-1 rounded-md border font-medium transition ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rumusan Integrasi KBC */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Rumusan Integrasi KBC:
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={kbc.rumusan}
                    onChange={(e) => handleKBCChange(idx, 'rumusan', e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {kbc.rumusan}
                  </p>
                )}
              </div>

              {/* Perilaku Teramati (Observable Behavior) */}
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Perilaku Teramati (Dapat Diobservasi):
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={kbc.perilakuTeramati}
                    onChange={(e) => handleKBCChange(idx, 'perilakuTeramati', e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-emerald-300 rounded"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    {kbc.perilakuTeramati}
                  </p>
                )}
              </div>

              {/* Penerapan dalam Kehidupan Nyata */}
              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900 block mb-1">
                  Penerapan dalam Kehidupan Nyata:
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={kbc.penerapanKehidupan}
                    onChange={(e) => handleKBCChange(idx, 'penerapanKehidupan', e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-sky-300 rounded"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-sky-950 leading-relaxed">
                    {kbc.penerapanKehidupan}
                  </p>
                )}
              </div>

              {/* Validation Warning for Unmeasurable KBC Words */}
              {validation.warning && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{validation.warning}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden Data Table for Quick Clipboard / Tabular View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Format Tabel Integrasi KBC</span>
          <span className="text-xs text-slate-400">Dapat disalin langsung</span>
        </div>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white">
                <th className="py-2.5 px-3 font-semibold text-center w-16">Kode</th>
                <th className="py-2.5 px-4 font-semibold w-1/5">Nilai Panca Cinta</th>
                <th className="py-2.5 px-4 font-semibold w-1/4">Rumusan Integrasi</th>
                <th className="py-2.5 px-4 font-semibold w-1/4">Perilaku Teramati</th>
                <th className="py-2.5 px-4 font-semibold">Penerapan Kehidupan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((kbc, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-center text-slate-700 align-top">{kbc.kodeTP}</td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-900 align-top">
                    {Array.isArray(kbc.nilaiPancaCinta) ? kbc.nilaiPancaCinta.join(', ') : String(kbc.nilaiPancaCinta)}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800 align-top">{kbc.rumusan}</td>
                  <td className="py-2.5 px-4 text-slate-700 align-top">{kbc.perilakuTeramati}</td>
                  <td className="py-2.5 px-4 text-slate-700 align-top">{kbc.penerapanKehidupan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
