import React, { useState, useEffect } from 'react';
import { FormInputData, HasilPerumusanTP, RiwayatDokumen } from './types';
import { CONTOH_DATA_MTS } from './utils/constants';
import {
  simpanRiwayat,
  dapatkanDaftarRiwayat,
  hapusRiwayat,
  hapusSemuaRiwayat,
} from './utils/storage';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ProcessIndicator } from './components/ProcessIndicator';
import { ResultsView } from './components/ResultsView';
import { PrintableView } from './components/PrintableView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AlertCircle, RotateCcw, Clock, RefreshCw } from 'lucide-react';

function extractCleanErrorMessage(err: any): { message: string; isHighDemand: boolean } {
  let raw = err?.message || String(err || '');

  // Detect if raw is JSON string or contains 503 / high demand signals
  const isHighDemand =
    raw.includes('503') ||
    raw.includes('UNAVAILABLE') ||
    raw.toLowerCase().includes('high demand') ||
    raw.toLowerCase().includes('spikes in demand') ||
    raw.toLowerCase().includes('overloaded');

  if (isHighDemand) {
    return {
      message:
        'Layanan AI Google saat ini sedang mengalami lonjakan antrean trafik tinggi (503 High Demand). Lonjakan ini bersifat sementara. Silakan klik tombol "Coba Lagi" di bawah.',
      isHighDemand: true,
    };
  }

  const isRateLimited =
    raw.includes('429') ||
    raw.includes('RESOURCE_EXHAUSTED') ||
    raw.toLowerCase().includes('quota');

  if (isRateLimited) {
    return {
      message:
        'Batas frekuensi permintaan sementara tercapai (429 Rate Limit). Mohon tunggu beberapa detik sebelum mencoba kembali.',
      isHighDemand: false,
    };
  }

  // Strip potential raw JSON wrapper if present
  try {
    if (raw.startsWith('{') && raw.endsWith('}')) {
      const parsed = JSON.parse(raw);
      if (parsed.error?.message) {
        raw = parsed.error.message;
      }
    }
  } catch {}

  return {
    message: raw || 'Terjadi kendala saat menghubungi perumus kurikulum AI. Pastikan koneksi stabil dan coba kembali.',
    isHighDemand: false,
  };
}

export default function App() {
  const [inputData, setInputData] = useState<FormInputData>(CONTOH_DATA_MTS);
  const [hasil, setHasil] = useState<HasilPerumusanTP | null>(null);
  const [currentDocId, setCurrentDocId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<{ message: string; isHighDemand: boolean } | null>(null);
  const [isPrintView, setIsPrintView] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<RiwayatDokumen[]>([]);

  // Load history on mount
  useEffect(() => {
    const list = dapatkanDaftarRiwayat();
    setHistoryList(list);
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorDetails(null);

    try {
      const response = await fetch('/api/rumuskan-tp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const rawErr = errorData.error || `Gagal menganalisis Capaian Pembelajaran (Status: ${response.status}).`;
        const cleaned = extractCleanErrorMessage(rawErr);
        if (errorData.isHighDemand) cleaned.isHighDemand = true;
        setErrorDetails(cleaned);
        return;
      }

      const resJson = await response.json();
      if (!resJson.success || !resJson.data) {
        throw new Error('Format balasan server tidak sesuai standar.');
      }

      const hasilData: HasilPerumusanTP = resJson.data;
      setHasil(hasilData);

      // Save to localStorage history
      const savedDoc = simpanRiwayat(inputData, hasilData);
      setCurrentDocId(savedDoc.id);
      setHistoryList(dapatkanDaftarRiwayat());

      // Scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error analyzing CP:', err);
      setErrorDetails(extractCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSection = async (section: string, instructions: string) => {
    if (!hasil) return;
    setIsRegenerating(true);
    setErrorDetails(null);

    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: inputData,
          currentData: hasil,
          section,
          instructions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const rawErr = errorData.error || 'Gagal meregenerasi bagian yang dipilih.';
        const cleaned = extractCleanErrorMessage(rawErr);
        if (errorData.isHighDemand) cleaned.isHighDemand = true;
        setErrorDetails(cleaned);
        return;
      }

      const resJson = await response.json();
      if (!resJson.success || !resJson.updatedSection) {
        throw new Error('Pembaruan bagian gagal diterima.');
      }

      const updatedData: HasilPerumusanTP = {
        ...hasil,
        ...resJson.updatedSection,
      };

      setHasil(updatedData);

      // Update current history doc
      simpanRiwayat(inputData, updatedData, currentDocId);
      setHistoryList(dapatkanDaftarRiwayat());
    } catch (err: any) {
      console.error('Error regenerating section:', err);
      setErrorDetails(extractCleanErrorMessage(err));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleUpdateFullData = (updated: HasilPerumusanTP) => {
    setHasil(updated);
    if (currentDocId) {
      simpanRiwayat(inputData, updated, currentDocId);
      setHistoryList(dapatkanDaftarRiwayat());
    }
  };

  const handleSelectHistory = (item: RiwayatDokumen) => {
    setInputData(item.input);
    setHasil(item.hasil);
    setCurrentDocId(item.id);
    setErrorDetails(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    const updated = hapusRiwayat(id);
    setHistoryList(updated);
    if (currentDocId === id) {
      setCurrentDocId(undefined);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat perencanaan?')) {
      hapusSemuaRiwayat();
      setHistoryList([]);
      setCurrentDocId(undefined);
    }
  };

  // If in Print View
  if (isPrintView && hasil) {
    return (
      <PrintableView
        input={inputData}
        data={hasil}
        onBack={() => setIsPrintView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 font-sans-app flex flex-col">
      {/* Top Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={historyList.length}
        onPrintPreview={hasil ? () => setIsPrintView(true) : undefined}
        hasResult={Boolean(hasil)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification banner if failed */}
        {errorDetails && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200 ${
              errorDetails.isHighDemand
                ? 'bg-amber-50/95 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {errorDetails.isHighDemand ? (
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span>
                    {errorDetails.isHighDemand
                      ? 'Server AI Sedang Mengalami Lonjakan Permintaan (503)'
                      : 'Terjadi Kendala Pemrosesan'}
                  </span>
                  {errorDetails.isHighDemand && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-amber-200 text-amber-800 rounded-full">
                      Trafik Padat
                    </span>
                  )}
                </h4>
                <p
                  className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                    errorDetails.isHighDemand ? 'text-amber-800' : 'text-rose-800'
                  }`}
                >
                  {errorDetails.message}
                </p>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition shadow-xs self-start sm:self-auto shrink-0 ${
                errorDetails.isHighDemand
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Sedang Memproses...' : 'Coba Lagi Sekarang'}</span>
            </button>
          </div>
        )}

        {/* Step Indicator when Loading */}
        <ProcessIndicator isLoading={isLoading} />

        {/* Form View (Visible when no result or when user wants to edit input) */}
        {!hasil ? (
          <InputForm
            inputData={inputData}
            onChange={setInputData}
            onSubmit={handleAnalyze}
            isLoading={isLoading}
          />
        ) : (
          /* Results View with Tabs & Accordion */
          <ResultsView
            input={inputData}
            data={hasil}
            onUpdateFullData={handleUpdateFullData}
            onPrintPreview={() => setIsPrintView(true)}
            onNewAnalysis={() => setHasil(null)}
            onRegenerateSection={handleRegenerateSection}
            isRegenerating={isRegenerating}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-slate-200/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="font-medium text-slate-700">
            PERTAMA — Perumus Tujuan Pembelajaran Madrasah (MI · MTs · MA)
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Terintegrasi Taksonomi Bloom Revisi, SOLO, Kurikulum Berbasis Cinta (KBC), dan Sumber Keislaman.
          </p>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
