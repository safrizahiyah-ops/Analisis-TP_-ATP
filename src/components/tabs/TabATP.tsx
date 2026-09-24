import React, { useRef, useState } from 'react';
import { HasilPerumusanTP, FormInputData, AlurTujuanPembelajaranItem } from '../../types';
import { ensureAlurTujuanPembelajaran } from '../../utils/atpHelper';
import { copyTableToClipboard } from '../../utils/copyTable';
import {
  Copy,
  Check,
  Edit3,
  Save,
  RefreshCw,
  Clock,
  Route,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  BookOpen,
  Plus,
  Trash2,
  ListOrdered,
  Kanban,
} from 'lucide-react';

interface TabATPProps {
  data: HasilPerumusanTP;
  input: FormInputData;
  onUpdateATP: (updatedList: AlurTujuanPembelajaranItem[]) => void;
  onRegenerate: () => void;
}

export const TabATP: React.FC<TabATPProps> = ({
  data,
  input,
  onUpdateATP,
  onRegenerate,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'tabel' | 'alur'>('tabel');

  // Get current ATP items using helper
  const currentATPList = ensureAlurTujuanPembelajaran(data, input);
  const [editList, setEditList] = useState<AlurTujuanPembelajaranItem[]>(currentATPList);

  const displayList = isEditing ? editList : currentATPList;

  const totalJP = displayList.reduce((acc, curr) => acc + (Number(curr.alokasiJP) || 0), 0);
  const targetJP = Number(input.alokasiJP) || 0;
  const isJPExceeded = totalJP > targetJP;
  const isJPLess = totalJP < targetJP;

  const handleCopy = async () => {
    const success = await copyTableToClipboard(tableRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdateATP(editList);
    setIsEditing(false);
  };

  const handleItemChange = (index: number, field: keyof AlurTujuanPembelajaranItem, value: any) => {
    const updated = [...editList];
    updated[index] = { ...updated[index], [field]: value };
    setEditList(updated);
  };

  const handleAddItem = () => {
    const nextUrutan = editList.length + 1;
    const newItem: AlurTujuanPembelajaranItem = {
      urutanAlur: nextUrutan,
      kodeTP: `TP-${nextUrutan}`,
      rumusanTP: 'Peserta didik mampu...',
      lingkupMateri: input.materiPokok,
      alokasiJP: 2,
      alokasiPertemuan: `Pertemuan ${nextUrutan}`,
      kegiatanPembelajaranInti: 'Aktivitas pembelajaran dan diskusi konsep.',
      rencanaAsesmen: 'Asesmen formatif unjuk kerja dan lembar kerja.',
    };
    setEditList([...editList, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    if (editList.length <= 1) {
      alert('Alur Tujuan Pembelajaran minimal memiliki 1 langkah.');
      return;
    }
    const updated = editList
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, urutanAlur: idx + 1 }));
    setEditList(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
              Fitur Baru
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Route className="w-5 h-5 text-emerald-700" />
              Alur Tujuan Pembelajaran (ATP) & Alokasi Waktu
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Alur kronologis-pedagogis yang memetakan Tujuan Pembelajaran (TP), lingkup materi, serta alokasi waktu (JP & pertemuan).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SubView toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveSubView('tabel')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeSubView === 'tabel'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Tabel Formal</span>
            </button>
            <button
              onClick={() => setActiveSubView('alur')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeSubView === 'alur'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Bagan Alur</span>
            </button>
          </div>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan ATP</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditList(currentATPList);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit ATP</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tabel Tersalin' : 'Salin Tabel'}</span>
          </button>

          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
            title="Buat ulang alur ATP dengan AI"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Buat Ulang ATP</span>
          </button>
        </div>
      </div>

      {/* Alokasi Waktu Verification Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 transition shadow-xs ${
          isJPExceeded
            ? 'bg-amber-50/90 border-amber-300 text-amber-950'
            : isJPLess
            ? 'bg-sky-50/90 border-sky-300 text-sky-950'
            : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
        }`}
      >
        <div
          className={`p-2 rounded-xl mt-0.5 ${
            isJPExceeded
              ? 'bg-amber-200/70 text-amber-800'
              : isJPLess
              ? 'bg-sky-200/70 text-sky-800'
              : 'bg-emerald-200/70 text-emerald-800'
          }`}
        >
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              Pusat Alokasi Waktu Pembelajaran (ATP):
            </span>
            <span className="text-sm sm:text-base font-extrabold">
              Total {totalJP} JP dari Target {targetJP} JP ({input.alokasiPertemuan} Pertemuan)
            </span>
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                !isJPExceeded && !isJPLess
                  ? 'bg-emerald-200 text-emerald-900'
                  : isJPExceeded
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-sky-200 text-sky-900'
              }`}
            >
              {!isJPExceeded && !isJPLess
                ? '✓ Pas & Proporsional'
                : isJPExceeded
                ? '⚠️ Melebihi Target'
                : 'ℹ Di Bawah Target'}
            </span>
          </div>

          {isJPExceeded && (
            <p className="text-xs sm:text-sm mt-1.5 text-amber-800 font-medium leading-relaxed">
              Total alokasi waktu pada ATP ({totalJP} JP) melebihi batas rencana guru ({targetJP} JP). Anda dapat mengklik tombol <strong>"Edit ATP"</strong> di atas untuk menyesuaikan JP per langkah alur agar sesuai dengan beban belajar madrasah.
            </p>
          )}

          {isJPLess && (
            <p className="text-xs sm:text-sm mt-1.5 text-sky-800 font-medium leading-relaxed">
              Total alokasi waktu ({totalJP} JP) masih di bawah target rencana ({targetJP} JP). Terdapat selisih {targetJP - totalJP} JP yang dapat dialokasikan untuk penguatan, asesmen diagnostik, atau refleksi kontekstual.
            </p>
          )}

          {!isJPExceeded && !isJPLess && (
            <p className="text-xs sm:text-sm mt-1.5 text-emerald-800 font-medium leading-relaxed">
              Distribusi alokasi waktu pada alur ATP sudah seimbang, tepat {targetJP} JP untuk {input.alokasiPertemuan} pertemuan tatap muka.
            </p>
          )}
        </div>
      </div>

      {/* Main ATP Content: Table or Visual Roadmap */}
      {activeSubView === 'tabel' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-emerald-900 text-white border-b border-emerald-800">
                  <th className="py-3 px-3 font-semibold text-center w-16">Alur</th>
                  <th className="py-3 px-4 font-semibold min-w-[280px]">
                    Tujuan Pembelajaran (TP)
                  </th>
                  <th className="py-3 px-4 font-semibold min-w-[190px]">
                    Lingkup Materi / Submateri
                  </th>
                  <th className="py-3 px-3 font-semibold text-center min-w-[130px]">
                    Alokasi Waktu
                  </th>
                  <th className="py-3 px-4 font-semibold min-w-[220px]">
                    Rencana Kegiatan & Asesmen
                  </th>
                  {isEditing && <th className="py-3 px-2 text-center w-12">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    {/* Urutan Alur */}
                    <td className="py-3.5 px-3 font-extrabold text-center text-emerald-900 align-top">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.urutanAlur || idx + 1}
                      </span>
                    </td>

                    {/* TP: Kode & Rumusan */}
                    <td className="py-3.5 px-4 text-slate-800 align-top">
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.kodeTP}
                              onChange={(e) => handleItemChange(idx, 'kodeTP', e.target.value)}
                              placeholder="Kode TP"
                              className="w-24 p-1.5 border border-slate-300 rounded text-xs font-bold text-emerald-900"
                            />
                            <span className="text-xs text-slate-400">Kode Tujuan</span>
                          </div>
                          <textarea
                            rows={3}
                            value={item.rumusanTP}
                            onChange={(e) => handleItemChange(idx, 'rumusanTP', e.target.value)}
                            placeholder="Rumusan Tujuan Pembelajaran"
                            className="w-full p-2 border border-slate-300 rounded text-xs leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="inline-flex items-center gap-1.5 mb-1">
                            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-900 rounded">
                              {item.kodeTP}
                            </span>
                          </div>
                          <p className="font-medium text-slate-900 leading-relaxed">
                            {item.rumusanTP}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Lingkup Materi */}
                    <td className="py-3.5 px-4 text-slate-700 align-top">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={item.lingkupMateri}
                          onChange={(e) => handleItemChange(idx, 'lingkupMateri', e.target.value)}
                          placeholder="Materi pokok / submateri"
                          className="w-full p-2 border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        <div className="font-semibold text-slate-800 flex items-start gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item.lingkupMateri}</span>
                        </div>
                      )}
                    </td>

                    {/* Alokasi Waktu (JP & Pertemuan) */}
                    <td className="py-3.5 px-3 text-center align-top whitespace-nowrap">
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={1}
                              max={30}
                              value={item.alokasiJP}
                              onChange={(e) =>
                                handleItemChange(idx, 'alokasiJP', Number(e.target.value) || 1)
                              }
                              className="w-14 p-1 border border-slate-300 rounded text-xs text-center font-bold"
                            />
                            <span className="text-xs font-bold text-slate-600">JP</span>
                          </div>
                          <input
                            type="text"
                            value={item.alokasiPertemuan}
                            onChange={(e) => handleItemChange(idx, 'alokasiPertemuan', e.target.value)}
                            placeholder="Misal Pertemuan 1"
                            className="w-full p-1 border border-slate-300 rounded text-[11px] text-center"
                          />
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg">
                            {item.alokasiJP} JP
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {item.alokasiPertemuan}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Rencana Kegiatan & Asesmen */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed align-top">
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500">Kegiatan Inti:</span>
                            <textarea
                              rows={2}
                              value={item.kegiatanPembelajaranInti || ''}
                              onChange={(e) =>
                                handleItemChange(idx, 'kegiatanPembelajaranInti', e.target.value)
                              }
                              placeholder="Deskripsi kegiatan inti"
                              className="w-full p-1.5 border border-slate-300 rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500">Rencana Asesmen:</span>
                            <textarea
                              rows={2}
                              value={item.rencanaAsesmen || ''}
                              onChange={(e) =>
                                handleItemChange(idx, 'rencanaAsesmen', e.target.value)
                              }
                              placeholder="Asesmen formatif / KKTP"
                              className="w-full p-1.5 border border-slate-300 rounded text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {item.kegiatanPembelajaranInti && (
                            <p>
                              <strong className="text-slate-700">Kegiatan:</strong>{' '}
                              {item.kegiatanPembelajaranInti}
                            </p>
                          )}
                          {item.rencanaAsesmen && (
                            <p className="text-slate-500">
                              <strong className="text-slate-700">Asesmen:</strong>{' '}
                              {item.rencanaAsesmen}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Delete button in editing mode */}
                    {isEditing && (
                      <td className="py-3.5 px-2 text-center align-top">
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus langkah alur"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td colSpan={3} className="py-3 px-4 text-right text-slate-700">
                    Total Alokasi Waktu Seluruh Alur ATP:
                  </td>
                  <td className="py-3 px-3 text-center text-emerald-900 font-extrabold whitespace-nowrap">
                    {totalJP} JP
                  </td>
                  <td colSpan={isEditing ? 2 : 1} className="py-3 px-4 text-xs text-slate-500">
                    Target Alokasi Guru: {targetJP} JP ({input.alokasiPertemuan} Pertemuan)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Add Step Button when Editing */}
          {isEditing && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl transition shadow-xs"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Tambah Langkah Alur ATP</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Visual Roadmap View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayList.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-700 text-white font-extrabold text-xs">
                      {step.urutanAlur || idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-900 rounded">
                        {step.kodeTP}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-800 rounded">
                        {step.alokasiJP} JP
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {step.lingkupMateri}
                  </h4>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed mt-2 mb-3">
                    {step.rumusanTP}
                  </p>

                  {step.kegiatanPembelajaranInti && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1 mb-2">
                      <span className="font-bold text-slate-700 block">Pengalaman Belajar:</span>
                      <p>{step.kegiatanPembelajaranInti}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {step.alokasiPertemuan}
                  </span>
                  {idx < displayList.length - 1 && (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      Lanjut ke Alur {idx + 2}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
