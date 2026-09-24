import React, { useRef, useState } from 'react';
import { IntegrasiKeislamanItem } from '../../types';
import { copyTableToClipboard } from '../../utils/copyTable';
import {
  Copy,
  Check,
  Edit3,
  Save,
  RefreshCw,
  AlertTriangle,
  BookMarked,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface TabKeislamanProps {
  data: IntegrasiKeislamanItem[];
  catatanKejujuran?: string;
  onUpdate: (updated: IntegrasiKeislamanItem[], catatan?: string) => void;
  onRegenerate: () => void;
}

export const TabKeislaman: React.FC<TabKeislamanProps> = ({
  data,
  catatanKejujuran,
  onUpdate,
  onRegenerate,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sources, setSources] = useState<IntegrasiKeislamanItem[]>(data);
  const [catatan, setCatatan] = useState<string>(catatanKejujuran || '');

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdate(sources, catatan);
    setIsEditing(false);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...sources];
    updated[index] = { ...updated[index], [field]: value };
    setSources(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Bagian I: Integrasi Al-Qur'an, Hadis, & Kitab Kuning
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rujukan keislaman terverifikasi dan jujur secara akademik, diklasifikasikan sebagai integrasi konseptual atau nilai.
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
                setSources(data);
                setCatatan(catatanKejujuran || '');
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
            title="Buat ulang integrasi sumber keislaman"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buat Ulang</span>
          </button>
        </div>
      </div>

      {/* MANDATORY WARNING BANNER */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
            PERINGATAN AKADEMIK & KEJUJURAN RUJUKAN
          </h4>
          <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
            <strong>Verifikasi teks Arab, nomor ayat, dan terjemahan dengan Qur'an Kemenag</strong> (
            <a
              href="https://quran.kemenag.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-rose-950 inline-flex items-center gap-0.5"
            >
              quran.kemenag.go.id
              <ExternalLink className="w-3 h-3" />
            </a>
            ) atau kitab asli sebelum dicetak dan digunakan dalam modul ajar. Jangan pernah mengarang sanad, matan hadis, atau takwil ayat.
          </p>
        </div>
      </div>

      {/* Catatan Kejujuran Sumber (Jika ada) */}
      {(catatanKejujuran || isEditing) && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Catatan Kejujuran Akademik AI:</span>
          </div>
          {isEditing ? (
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded mt-1"
            />
          ) : (
            <p className="leading-relaxed text-slate-600">{catatanKejujuran}</p>
          )}
        </div>
      )}

      {/* Kartu Rujukan Keislaman */}
      <div className="space-y-5">
        {(isEditing ? sources : data).map((sumber, idx) => {
          const isLowConfidence = (sumber.tingkatKeyakinan || '').toLowerCase().includes('rendah');
          const isMediumConfidence = (sumber.tingkatKeyakinan || '').toLowerCase().includes('sedang');
          const isHighConfidence = (sumber.tingkatKeyakinan || '').toLowerCase().includes('tinggi');

          const isKonseptual = (sumber.jenisIntegrasi || '').toLowerCase().includes('konseptual');

          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs transition ${
                isLowConfidence
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              {/* Header: Jenis Sumber, Rujukan, Jenis Integrasi, Keyakinan */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 mb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-900 text-white flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5" />
                    {sumber.jenisSumber}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {sumber.rujukan}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge Integrasi */}
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${
                      isKonseptual
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}
                  >
                    Integrasi {sumber.jenisIntegrasi}
                  </span>

                  {/* Badge Keyakinan (Red for low) */}
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${
                      isLowConfidence
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isMediumConfidence
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    Keyakinan {sumber.tingkatKeyakinan}
                  </span>
                </div>
              </div>

              {/* Editing Form controls if in Edit Mode */}
              {isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-xs font-semibold block text-slate-600 mb-1">Rujukan:</label>
                    <input
                      type="text"
                      value={sumber.rujukan}
                      onChange={(e) => handleItemChange(idx, 'rujukan', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block text-slate-600 mb-1">Jenis Integrasi:</label>
                    <select
                      value={sumber.jenisIntegrasi}
                      onChange={(e) => handleItemChange(idx, 'jenisIntegrasi', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                    >
                      <option value="konseptual">Integrasi Konseptual</option>
                      <option value="nilai">Integrasi Nilai</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block text-slate-600 mb-1">Tingkat Keyakinan:</label>
                    <select
                      value={sumber.tingkatKeyakinan}
                      onChange={(e) => handleItemChange(idx, 'tingkatKeyakinan', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                    >
                      <option value="tinggi">Tinggi</option>
                      <option value="sedang">Sedang</option>
                      <option value="rendah">Rendah (Perlu Cek Ulang)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Teks Arab (Font Amiri RTL) */}
              {sumber.teksArab ? (
                <div className="my-4 p-4 rounded-xl bg-amber-50/40 border border-amber-200/70">
                  {isEditing ? (
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={sumber.teksArab}
                      onChange={(e) => handleItemChange(idx, 'teksArab', e.target.value)}
                      className="w-full p-2.5 font-amiri text-lg text-slate-900 border border-amber-300 rounded bg-white text-right leading-loose"
                    />
                  ) : (
                    <p
                      dir="rtl"
                      className="font-amiri text-xl sm:text-2xl text-slate-900 text-right leading-loose tracking-wide"
                      style={{ fontFamily: "'Amiri', serif" }}
                    >
                      {sumber.teksArab}
                    </p>
                  )}
                </div>
              ) : (
                <div className="my-3 p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 italic">
                  (Teks Arab dikosongkan karena AI memprioritaskan kejujuran akademik; rujukan dan makna dicantumkan di bawah)
                </div>
              )}

              {/* Terjemahan atau Ringkasan Makna */}
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Terjemahan / Ringkasan Makna:
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={sumber.terjemahanAtauMakna}
                    onChange={(e) => handleItemChange(idx, 'terjemahanAtauMakna', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs leading-relaxed"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                    "{sumber.terjemahanAtauMakna}"
                  </p>
                )}
              </div>

              {/* Keterkaitan dengan Materi Pembelajaran */}
              <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Keterkaitan Konseptual / Karakter dengan Materi:
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={sumber.keterkaitan}
                    onChange={(e) => handleItemChange(idx, 'keterkaitan', e.target.value)}
                    className="w-full p-2 border border-emerald-300 bg-white rounded text-xs leading-relaxed"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    {sumber.keterkaitan}
                  </p>
                )}
              </div>

              {/* Low confidence warning note */}
              {isLowConfidence && (
                <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    Tingkat keyakinan rendah: Harap cocokkan langsung dengan mushaf Al-Qur'an Kemenag atau kitab rujukan asli sebelum pengesahan dokumen.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden Data Table for Quick Clipboard / Tabular View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Format Tabel Rujukan Keislaman</span>
          <span className="text-xs text-slate-400">Dapat disalin langsung</span>
        </div>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white">
                <th className="py-2.5 px-4 font-semibold w-1/4">Sumber & Rujukan</th>
                <th className="py-2.5 px-4 font-semibold w-1/3">Terjemahan / Makna</th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">Integrasi</th>
                <th className="py-2.5 px-4 font-semibold">Keterkaitan Materi</th>
                <th className="py-2.5 px-3 font-semibold text-center w-24">Keyakinan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-800 align-top">
                    {s.jenisSumber} - {s.rujukan}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 italic align-top">{s.terjemahanAtauMakna}</td>
                  <td className="py-2.5 px-3 text-center align-top">{s.jenisIntegrasi}</td>
                  <td className="py-2.5 px-4 text-slate-700 align-top">{s.keterkaitan}</td>
                  <td className="py-2.5 px-3 text-center font-semibold align-top">{s.tingkatKeyakinan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
