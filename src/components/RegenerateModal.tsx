import React, { useState } from 'react';
import { RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';

interface RegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName: string;
  sectionTitle: string;
  onConfirm: (instructions: string) => void;
  isRegenerating: boolean;
}

export const RegenerateModal: React.FC<RegenerateModalProps> = ({
  isOpen,
  onClose,
  sectionName,
  sectionTitle,
  onConfirm,
  isRegenerating,
}) => {
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(instructions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-800">
              Buat Ulang (Regenerate) Bagian Ini
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isRegenerating}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Target: {sectionTitle}
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Hanya bagian ini yang akan diperbarui oleh AI. Bagian lain dari perencanaan Anda akan tetap utuh.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Instruksi Tambahan Guru (Opsional)
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Contoh: Fokuskan pada perbandingan bertingkat dan tambahkan konteks jual-beli di koperasi madrasah..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm"
              disabled={isRegenerating}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isRegenerating}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isRegenerating}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition flex items-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Sedang Membuat Ulang...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Proses Pembaruan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
