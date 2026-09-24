import React from 'react';
import { BookOpen, History, Sparkles, BookMarked, Printer } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  savedCount: number;
  onPrintPreview?: () => void;
  hasResult?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  savedCount,
  onPrintPreview,
  hasResult,
}) => {
  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-inner border border-emerald-400/30 text-amber-300">
              <BookMarked className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  PERTAMA
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-800 text-amber-300 font-medium tracking-normal border border-emerald-700/50">
                    Madrasah
                  </span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-normal hidden sm:block">
                Perumus Tujuan Pembelajaran Madrasah (MI · MTs · MA)
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {hasResult && onPrintPreview && (
              <button
                onClick={onPrintPreview}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-emerald-800/70 text-emerald-100 hover:bg-emerald-800 hover:text-white border border-emerald-700 transition"
                title="Pratinjau Cetak / Ekspor PDF"
              >
                <Printer className="w-4 h-4 text-emerald-300" />
                <span>Cetak / PDF</span>
              </button>
            )}

            <button
              onClick={onOpenHistory}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700 hover:text-white border border-emerald-700 transition shadow-sm"
              title="Buka riwayat perumusan TP"
            >
              <History className="w-4 h-4 text-amber-300" />
              <span>Riwayat</span>
              {savedCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-emerald-950 bg-amber-400 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subheader tagline for mobile */}
      <div className="sm:hidden px-4 py-1.5 bg-emerald-950/80 text-emerald-300 text-xs border-t border-emerald-800/60 flex items-center justify-between">
        <span>Terintegrasi Bloom Revisi, SOLO, KBC, & Keislaman</span>
      </div>
    </header>
  );
};
