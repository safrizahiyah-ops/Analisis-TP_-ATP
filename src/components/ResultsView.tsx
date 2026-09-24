import React, { useState } from 'react';
import { HasilPerumusanTP, FormInputData } from '../types';
import { TabRekap } from './tabs/TabRekap';
import { TabATP } from './tabs/TabATP';
import { TabAnalisisCP } from './tabs/TabAnalisisCP';
import { TabAnalisisMateri } from './tabs/TabAnalisisMateri';
import { TabBloomSolo } from './tabs/TabBloomSolo';
import { TabGradasiTP } from './tabs/TabGradasiTP';
import { TabKBC } from './tabs/TabKBC';
import { RegenerateModal } from './RegenerateModal';
import { exportToWordDocx } from '../utils/docxExport';
import { ensureAlurTujuanPembelajaran } from '../utils/atpHelper';
import { copyFullDocumentToClipboard } from '../utils/clipboardHelper';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Layers,
  HeartHandshake,
  BookMarked,
  Route,
  CheckCircle2,
} from 'lucide-react';

interface ResultsViewProps {
  input: FormInputData;
  data: HasilPerumusanTP;
  onUpdateFullData: (updated: HasilPerumusanTP) => void;
  onPrintPreview: () => void;
  onNewAnalysis: () => void;
  onRegenerateSection: (section: string, instructions: string) => Promise<void>;
  isRegenerating: boolean;
}

type TabType =
  | 'rekap'
  | 'atp'
  | 'analisisCP'
  | 'analisisMateri'
  | 'bloomSolo'
  | 'gradasiTP'
  | 'kbc';

export const ResultsView: React.FC<ResultsViewProps> = ({
  input,
  data,
  onUpdateFullData,
  onPrintPreview,
  onNewAnalysis,
  onRegenerateSection,
  isRegenerating,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('rekap');
  const [regenerateTarget, setRegenerateTarget] = useState<{ section: string; title: string } | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const atpList = ensureAlurTujuanPembelajaran(data, input);
  const totalAtpJP = atpList.reduce((acc, curr) => acc + (Number(curr.alokasiJP) || 0), 0);

  const tabs = [
    { id: 'rekap', label: 'Rekap TP', icon: FileText, badge: `${data.tujuanPembelajaran.length} TP` },
    { id: 'atp', label: 'Alur TP (ATP)', icon: Route, badge: `${totalAtpJP} JP` },
    { id: 'analisisCP', label: 'Tab A: Analisis CP', icon: BookOpen },
    { id: 'analisisMateri', label: 'Tab B: Analisis Materi', icon: Layers },
    { id: 'bloomSolo', label: 'Tab C–E: Bloom & SOLO', icon: Sparkles },
    { id: 'gradasiTP', label: 'Tab F–G: Gradasi TP', icon: FileText },
    { id: 'kbc', label: 'Tab H: Integrasi KBC', icon: HeartHandshake },
  ];

  const handleDownloadWord = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await exportToWordDocx(input, data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `PERTAMA_TP_ATP_${input.mataPelajaran.replace(/\s+/g, '_')}_${input.jenjang}_${input.faseKelas.replace(/\s+/g, '_')}.docx`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export docx:', err);
      alert('Gagal mengekspor dokumen Word. Silakan gunakan tombol cetak/PDF.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleCopySummary = async () => {
    try {
      const res = await copyFullDocumentToClipboard(input, data);
      if (res.success) {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2500);
      }
    } catch (e) {
      console.error('Failed to copy document:', e);
    }
  };

  const triggerRegenerate = (section: string, title: string) => {
    setRegenerateTarget({ section, title });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Notification for Clipboard Copy */}
      {copiedAll && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-bold text-white">Dokumen Lengkap Berhasil Disalin!</p>
            <p className="text-[11px] text-emerald-200">Format rapi dengan tabel & teks siap ditempel di Microsoft Word atau Google Docs.</p>
          </div>
        </div>
      )}

      {/* Top Banner with Document Info & Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                {input.jenjang}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-600">{input.faseKelas}</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-600">Semester {input.semester}</span>
              {input.namaMadrasah && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs font-semibold text-emerald-800">{input.namaMadrasah}</span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {input.mataPelajaran}: {input.materiPokok}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500 mt-1.5">
              <span>Alokasi: <strong className="text-emerald-800 font-bold">{input.alokasiJP} JP</strong> ({input.alokasiPertemuan} Pertemuan)</span>
              <span>·</span>
              <span>Total TP: <strong className="text-slate-800 font-bold">{data.tujuanPembelajaran.length} TP</strong></span>
              <span>·</span>
              <span>Elemen CP: <strong className="text-slate-700">{input.elemenCP || '-'}</strong></span>
            </div>
          </div>

          {/* Action Toolbar (Prominent Buttons) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            {/* Word Export (.docx) */}
            <button
              onClick={handleDownloadWord}
              disabled={isExportingDocx}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition shadow-xs active:scale-95"
              title="Unduh dokumen lengkap dalam format Microsoft Word (.docx)"
            >
              <Download className="w-4 h-4 text-emerald-800" />
              <span>{isExportingDocx ? 'Mengekspor Word...' : 'Unduh Word (.docx)'}</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={onPrintPreview}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 border border-emerald-700 rounded-xl transition shadow-xs active:scale-95"
              title="Lihat format cetak resmi dan simpan sebagai PDF"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Unduh / Cetak PDF</span>
            </button>

            {/* Copy Summary / Full Doc */}
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition shadow-xs active:scale-95"
              title="Salin dokumen lengkap (format tabel HTML & teks untuk Word/Google Docs)"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-amber-800" />}
              <span>{copiedAll ? 'Tersalin ke Clipboard!' : 'Salin Dokumen (Copy Doc)'}</span>
            </button>

            {/* Reset / New Analysis */}
            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Kembali ke formulir input untuk mengubah parameter atau menganalisis CP baru"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Ubah Input</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Horizontal Scrolling on mobile) */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-emerald-950/60 text-amber-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        {activeTab === 'rekap' && (
          <TabRekap
            data={data}
            input={input}
            onNavigateToATP={() => setActiveTab('atp')}
          />
        )}

        {activeTab === 'atp' && (
          <TabATP
            data={data}
            input={input}
            onUpdateATP={(updated) => onUpdateFullData({ ...data, alurTujuanPembelajaran: updated })}
            onRegenerate={() => triggerRegenerate('alurTujuanPembelajaran', 'Alur Tujuan Pembelajaran (ATP)')}
          />
        )}

        {activeTab === 'analisisCP' && (
          <TabAnalisisCP
            data={data.analisisCP}
            onUpdate={(updated) => onUpdateFullData({ ...data, analisisCP: updated })}
            onRegenerate={() => triggerRegenerate('analisisCP', 'Bagian A: Analisis CP')}
          />
        )}

        {activeTab === 'analisisMateri' && (
          <TabAnalisisMateri
            data={data.analisisMateri}
            catatanTahapTidakDigunakan={data.catatanTahapTidakDigunakan}
            onUpdate={(updated, catatan) =>
              onUpdateFullData({
                ...data,
                analisisMateri: updated,
                catatanTahapTidakDigunakan: catatan !== undefined ? catatan : data.catatanTahapTidakDigunakan,
              })
            }
            onRegenerate={() => triggerRegenerate('analisisMateri', 'Bagian B: Analisis Materi')}
          />
        )}

        {activeTab === 'bloomSolo' && (
          <TabBloomSolo
            tujuanPembelajaran={data.tujuanPembelajaran}
            pemilihanLevel={data.pemilihanLevelKognitif}
            onUpdate={(tpList, levelKognitif) =>
              onUpdateFullData({
                ...data,
                tujuanPembelajaran: tpList,
                pemilihanLevelKognitif: levelKognitif,
              })
            }
            onRegenerate={() => triggerRegenerate('tujuanPembelajaran', 'Bagian C–E: Level Kognitif & TP')}
          />
        )}

        {activeTab === 'gradasiTP' && (
          <TabGradasiTP
            tujuanPembelajaran={data.tujuanPembelajaran}
            input={input}
            onUpdate={(updated) => onUpdateFullData({ ...data, tujuanPembelajaran: updated })}
            onRegenerate={() => triggerRegenerate('tujuanPembelajaran', 'Bagian F–G: Rumusan TP Bergradasi')}
            onNavigateToATP={() => setActiveTab('atp')}
          />
        )}

        {activeTab === 'kbc' && (
          <TabKBC
            data={data.integrasiKBC}
            onUpdate={(updated) => onUpdateFullData({ ...data, integrasiKBC: updated })}
            onRegenerate={() => triggerRegenerate('integrasiKBC', 'Bagian H: Integrasi KBC')}
          />
        )}
      </div>

      {/* Section Regenerate Modal */}
      {regenerateTarget && (
        <RegenerateModal
          isOpen={Boolean(regenerateTarget)}
          onClose={() => setRegenerateTarget(null)}
          sectionName={regenerateTarget.section}
          sectionTitle={regenerateTarget.title}
          isRegenerating={isRegenerating}
          onConfirm={async (instructions) => {
            const target = regenerateTarget.section;
            await onRegenerateSection(target, instructions);
            setRegenerateTarget(null);
          }}
        />
      )}

      {/* Persistent Floating Action Dock: Tetap ada tombol unduh (Word & PDF) / Copy Doc */}
      <aside aria-label="Aksi Cepat Dokumen" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
        <div className="hidden sm:flex items-center gap-2.5 min-w-0 pr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <div className="truncate text-xs leading-tight">
            <span className="font-bold text-white truncate block">
              {input.mataPelajaran} ({input.jenjang})
            </span>
            <span className="text-[11px] text-slate-400">
              {data.tujuanPembelajaran.length} TP · {totalAtpJP} JP Terencana
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          {/* Unduh Word */}
          <button
            onClick={handleDownloadWord}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-xl transition shadow-xs"
            title="Unduh dokumen lengkap format Microsoft Word (.docx)"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{isExportingDocx ? 'Mengekspor...' : 'Unduh Word'}</span>
          </button>

          {/* Unduh / Cetak PDF */}
          <button
            onClick={onPrintPreview}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 active:scale-95 rounded-xl transition shadow-xs border border-emerald-600/60"
            title="Cetak atau Simpan sebagai Dokumen PDF"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap">Unduh / Cetak PDF</span>
          </button>

          {/* Salin Dokumen */}
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition shadow-xs"
            title="Salin Dokumen Lengkap (Siap Tempel ke Word atau Google Docs)"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-900 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
            <span className="whitespace-nowrap">{copiedAll ? 'Tersalin!' : 'Copy Doc'}</span>
          </button>

          {/* Ubah Input */}
          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Ubah data input formulir"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Ubah Input</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
