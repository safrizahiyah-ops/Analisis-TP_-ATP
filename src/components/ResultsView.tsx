import React, { useState } from 'react';
import { HasilPerumusanTP, FormInputData } from '../types';
import { TabRekap } from './tabs/TabRekap';
import { TabATP } from './tabs/TabATP';
import { TabAnalisisCP } from './tabs/TabAnalisisCP';
import { TabAnalisisMateri } from './tabs/TabAnalisisMateri';
import { TabBloomSolo } from './tabs/TabBloomSolo';
import { TabGradasiTP } from './tabs/TabGradasiTP';
import { TabKBC } from './tabs/TabKBC';
import { TabKeislaman } from './tabs/TabKeislaman';
import { RegenerateModal } from './RegenerateModal';
import { exportToWordDocx } from '../utils/docxExport';
import { ensureAlurTujuanPembelajaran } from '../utils/atpHelper';
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
  Share2,
  Route,
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
  | 'kbc'
  | 'keislaman';

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

  const tabs = [
    { id: 'rekap', label: 'Rekap TP', icon: FileText, badge: `${data.tujuanPembelajaran.length} TP` },
    { id: 'atp', label: 'Alur TP (ATP)', icon: Route, badge: `${input.alokasiJP} JP` },
    { id: 'analisisCP', label: 'Tab A: Analisis CP', icon: BookOpen },
    { id: 'analisisMateri', label: 'Tab B: Analisis Materi', icon: Layers },
    { id: 'bloomSolo', label: 'Tab C–E: Bloom & SOLO', icon: Sparkles },
    { id: 'gradasiTP', label: 'Tab F–G: Gradasi TP', icon: FileText },
    { id: 'kbc', label: 'Tab H: Integrasi KBC', icon: HeartHandshake },
    { id: 'keislaman', label: 'Tab I: Sumber Keislaman', icon: BookMarked },
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
    const atpList = ensureAlurTujuanPembelajaran(data, input);

    const summaryText = `=== DOKUMEN PERENCANAAN PEMBELAJARAN MADRASAH (PERTAMA) ===
Madrasah: ${input.namaMadrasah || `Madrasah (${input.jenjang})`}
Mata Pelajaran: ${input.mataPelajaran} (${input.jenjang} - ${input.faseKelas})
Semester: ${input.semester}
Materi Pokok: ${input.materiPokok}
Alokasi Waktu: ${input.alokasiJP} JP (${input.alokasiPertemuan} Pertemuan)

Teks Capaian Pembelajaran (CP):
${input.teksCP}

RUMUSAN TUJUAN PEMBELAJARAN (TP):
${data.tujuanPembelajaran
  .map(
    (tp) =>
      `• [${tp.kode}] (${tp.levelBloom} - ${tp.levelSOLO})\n  Rumusan: ${tp.rumusan}\n  Bukti Ketercapaian: ${tp.buktiKetercapaian}`
  )
  .join('\n\n')}

ALUR TUJUAN PEMBELAJARAN (ATP) & ALOKASI WAKTU:
${atpList
  .map(
    (a) =>
      `• Alur ${a.urutanAlur} [${a.kodeTP}]: ${a.rumusanTP}\n  Materi: ${a.lingkupMateri}\n  Alokasi Waktu: ${a.alokasiJP} JP (${a.alokasiPertemuan})\n  Asesmen: ${a.rencanaAsesmen || '-'}`
  )
  .join('\n\n')}

INTEGRASI KURIKULUM BERBASIS CINTA (KBC):
${data.integrasiKBC
  .map(
    (k) =>
      `• [${k.kodeTP}] Nilai: ${Array.isArray(k.nilaiPancaCinta) ? k.nilaiPancaCinta.join(', ') : k.nilaiPancaCinta}\n  Rumusan: ${k.rumusan}\n  Perilaku: ${k.perilakuTeramati}\n  Penerapan: ${k.penerapanKehidupan}`
  )
  .join('\n\n')}

SUMBER KEISLAMAN TERINTEGRASI:
${data.integrasiKeislaman
  .map(
    (s) =>
      `• ${s.jenisSumber} - ${s.rujukan} [Integrasi ${s.jenisIntegrasi}, Keyakinan: ${s.tingkatKeyakinan}]\n  Makna: "${s.terjemahanAtauMakna}"\n  Keterkaitan: ${s.keterkaitan}`
  )
  .join('\n\n')}`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error('Failed to copy summary:', e);
    }
  };

  const triggerRegenerate = (section: string, title: string) => {
    setRegenerateTarget({ section, title });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Document Info & Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {input.mataPelajaran}: {input.materiPokok}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Alokasi: {input.alokasiJP} JP ({input.alokasiPertemuan} Pertemuan) · Elemen CP: {input.elemenCP || '-'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            {/* Word Export (.docx) */}
            <button
              onClick={handleDownloadWord}
              disabled={isExportingDocx}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-2xs"
              title="Unduh dokumen lengkap dalam format Microsoft Word (.docx)"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>{isExportingDocx ? 'Mengekspor Word...' : 'Ekspor Word (.docx)'}</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition shadow-2xs"
              title="Lihat format cetak resmi dan simpan sebagai PDF"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak / Ekspor PDF</span>
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              title="Salin ringkasan teks lengkap"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            {/* Reset / New Analysis */}
            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Formulir baru"
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

        {activeTab === 'keislaman' && (
          <TabKeislaman
            data={data.integrasiKeislaman}
            catatanKejujuran={data.catatanKejujuranSumber}
            onUpdate={(updated, catatan) =>
              onUpdateFullData({
                ...data,
                integrasiKeislaman: updated,
                catatanKejujuranSumber: catatan !== undefined ? catatan : data.catatanKejujuranSumber,
              })
            }
            onRegenerate={() => triggerRegenerate('integrasiKeislaman', "Bagian I: Integrasi Al-Qur'an & Kitab")}
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
    </div>
  );
};
