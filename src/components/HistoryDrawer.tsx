import React from 'react';
import { RiwayatDokumen } from '../types';
import { History, X, Trash2, ArrowUpRight, Calendar, BookOpen, Clock } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: RiwayatDokumen[];
  onSelect: (item: RiwayatDokumen) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyList,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Riwayat Perumusan TP</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {historyList.length === 0 ? (
            <div className="text-center py-16 px-4">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Belum Ada Riwayat Tersimpan</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Setiap kali Anda merumuskan TP, dokumen akan otomatis disimpan di peramban ini agar dapat diakses kembali sewaktu-waktu.
              </p>
            </div>
          ) : (
            historyList.map((item) => {
              const dateStr = new Date(item.waktuDibuat).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.input.jenjang} · {item.input.faseKelas}
                    </span>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-slate-300 hover:text-rose-600 transition p-1"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-900 transition">
                    {item.input.mataPelajaran}: {item.input.materiPokok}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.input.teksCP}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>

                    <button
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <span>Buka</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {historyList.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              {historyList.length} dokumen tersimpan
            </span>
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              Hapus Semua
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
