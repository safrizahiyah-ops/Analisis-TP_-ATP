import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ProcessIndicatorProps {
  isLoading: boolean;
}

const STEPS = [
  { id: 1, label: 'Menganalisis CP', desc: 'Membedah kompetensi, pengetahuan, keterampilan, & kompleksitas' },
  { id: 2, label: 'Menganalisis materi', desc: 'Menyusun alur tahapan submateri konsep hingga pemecahan masalah' },
  { id: 3, label: 'Menentukan level kognitif', desc: 'Menyelaraskan Taksonomi Bloom Revisi & Taksonomi SOLO' },
  { id: 4, label: 'Merumuskan TP', desc: 'Menyusun TP bergradasi logis, satu KKO terukur, & estimasi JP' },
  { id: 5, label: 'Mengintegrasikan KBC', desc: 'Menghubungkan Panca Cinta dengan perilaku teramati peserta didik' },
  { id: 6, label: 'Menelusuri sumber keislaman', desc: 'Mengintegrasikan Al-Qur\'an, Hadis, & Kitab Kuning dengan jujur' },
];

export const ProcessIndicator: React.FC<ProcessIndicatorProps> = ({ isLoading }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIndex(0);
      return;
    }

    // Progress through steps smoothly during the AI call
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-emerald-800/20 p-6 sm:p-8 my-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Kecerdasan Buatan Sedang Menganalisis Kurikulum...
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Memproses Capaian Pembelajaran sesuai standar Kurikulum Madrasah dan pedoman akademik Kemenag.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isUpcoming = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                isCurrent
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-400'
                  : isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-emerald-700 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {step.id}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-400">Langkah {step.id}</span>
                  <span className="text-xs text-slate-300">·</span>
                  <h4
                    className={`text-sm font-bold truncate ${
                      isCurrent ? 'text-emerald-950 font-extrabold' : isDone ? 'text-emerald-900' : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4">
        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-700 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-emerald-900 shrink-0">
          {Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}% Selesai
        </span>
      </div>
    </div>
  );
};
