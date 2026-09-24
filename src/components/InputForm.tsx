import React, { useState } from 'react';
import { FormInputData, JenjangMadrasah, Semester } from '../types';
import { CONTOH_DATA_MTS } from '../utils/constants';
import { Sparkles, RotateCcw, AlertCircle, HelpCircle } from 'lucide-react';

interface InputFormProps {
  inputData: FormInputData;
  onChange: (data: FormInputData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const JENJANG_OPTIONS: JenjangMadrasah[] = ['MI', 'MTs', 'MA'];

const FASE_PRESETS: Record<JenjangMadrasah, string[]> = {
  MI: [
    'Fase A (Kelas I)',
    'Fase A (Kelas II)',
    'Fase B (Kelas III)',
    'Fase B (Kelas IV)',
    'Fase C (Kelas V)',
    'Fase C (Kelas VI)',
  ],
  MTs: [
    'Fase D (Kelas VII)',
    'Fase D (Kelas VIII)',
    'Fase D (Kelas IX)',
  ],
  MA: [
    'Fase E (Kelas X)',
    'Fase F (Kelas XI)',
    'Fase F (Kelas XII)',
  ],
};

const SUGGESTED_SUBJECTS: Record<JenjangMadrasah, string[]> = {
  MI: [
    'Al-Qur\'an Hadis',
    'Akidah Akhlak',
    'Fikih',
    'Sejarah Kebudayaan Islam (SKI)',
    'Bahasa Arab',
    'Matematika',
    'IPAS',
    'Bahasa Indonesia',
    'Pancasila',
  ],
  MTs: [
    'Al-Qur\'an Hadis',
    'Akidah Akhlak',
    'Fikih',
    'Sejarah Kebudayaan Islam (SKI)',
    'Bahasa Arab',
    'Matematika',
    'Ilmu Pengetahuan Alam (IPA)',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Bahasa Indonesia',
    'Bahasa Inggris',
  ],
  MA: [
    'Al-Qur\'an Hadis',
    'Akidah Akhlak',
    'Fikih',
    'SKI',
    'Bahasa Arab',
    'Matematika',
    'Fisika',
    'Kimia',
    'Biologi',
    'Ekonomi',
    'Sosiologi',
    'Geografi',
    'Tafsir',
    'Hadis',
    'Ushul Fikih',
  ],
};

export const InputForm: React.FC<InputFormProps> = ({
  inputData,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleJenjangChange = (jenjang: JenjangMadrasah) => {
    const defaultFase = FASE_PRESETS[jenjang][0];
    const defaultMapel = SUGGESTED_SUBJECTS[jenjang][5] || SUGGESTED_SUBJECTS[jenjang][0];
    onChange({
      ...inputData,
      jenjang,
      faseKelas: defaultFase,
      mataPelajaran: defaultMapel,
    });
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!inputData.teksCP.trim()) {
      newErrors.teksCP = 'Teks Capaian Pembelajaran (CP) wajib diisi.';
    } else if (inputData.teksCP.trim().length < 15) {
      newErrors.teksCP = 'Teks CP terlalu singkat. Masukkan deskripsi CP yang memadai.';
    }

    if (!inputData.materiPokok.trim()) {
      newErrors.materiPokok = 'Materi pokok / topik pembelajaran wajib diisi.';
    }

    if (!inputData.mataPelajaran.trim()) {
      newErrors.mataPelajaran = 'Mata pelajaran wajib diisi.';
    }

    if (!inputData.alokasiJP || inputData.alokasiJP <= 0) {
      newErrors.alokasiJP = 'Alokasi Jam Pelajaran (JP) harus lebih dari 0.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    }
  };

  const handleMuatContoh = () => {
    onChange({ ...CONTOH_DATA_MTS });
    setErrors({});
  };

  const handleReset = () => {
    onChange({
      namaMadrasah: '',
      jenjang: 'MTs',
      mataPelajaran: 'Matematika',
      faseKelas: 'Fase D (Kelas VII)',
      semester: 'Genap',
      elemenCP: '',
      teksCP: '',
      materiPokok: '',
      alokasiJP: 8,
      alokasiPertemuan: 3,
      catatanGuru: '',
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 p-5 sm:p-7 md:p-8">
      {/* Top Banner and Quick Example Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            Perencanaan Capaian & Tujuan Pembelajaran
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Lengkapi data kurikulum madrasah untuk memulai analisis terukur dan integrasi komprehensif.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMuatContoh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Muat Contoh (MTs Fase D)</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
            title="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={validateAndSubmit} className="space-y-6">
        {/* Row 1: Nama Madrasah & Jenjang */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-7">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Nama Madrasah <span className="text-slate-400 text-xs font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={inputData.namaMadrasah}
              onChange={(e) => onChange({ ...inputData, namaMadrasah: e.target.value })}
              placeholder="Contoh: MTs Negeri 1 Kota Yogyakarta"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm bg-slate-50/50"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Jenjang Madrasah <span className="text-emerald-700">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {JENJANG_OPTIONS.map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => handleJenjangChange(j)}
                  className={`py-2 text-sm font-bold rounded-xl border transition ${
                    inputData.jenjang === j
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Mata Pelajaran, Fase & Kelas, Semester */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-5">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Mata Pelajaran <span className="text-emerald-700">*</span>
            </label>
            <input
              type="text"
              list="list-mapel"
              value={inputData.mataPelajaran}
              onChange={(e) => onChange({ ...inputData, mataPelajaran: e.target.value })}
              placeholder="Pilih atau ketik mata pelajaran..."
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.mataPelajaran ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
              } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm`}
            />
            <datalist id="list-mapel">
              {SUGGESTED_SUBJECTS[inputData.jenjang].map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            {errors.mataPelajaran && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.mataPelajaran}
              </p>
            )}
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Fase & Kelas <span className="text-emerald-700">*</span>
            </label>
            <select
              value={inputData.faseKelas}
              onChange={(e) => onChange({ ...inputData, faseKelas: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm bg-slate-50/50"
            >
              {FASE_PRESETS[inputData.jenjang].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Semester <span className="text-emerald-700">*</span>
            </label>
            <select
              value={inputData.semester}
              onChange={(e) => onChange({ ...inputData, semester: e.target.value as Semester })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm bg-slate-50/50"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>
        </div>

        {/* Row 3: Elemen CP & Materi Pokok */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Elemen CP <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={inputData.elemenCP}
              onChange={(e) => onChange({ ...inputData, elemenCP: e.target.value })}
              placeholder="Misal: Bilangan / Aljabar / Fikih Ibadah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm bg-slate-50/50"
            />
          </div>

          <div className="md:col-span-8">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Materi Pokok / Topik <span className="text-emerald-700">*</span>
            </label>
            <input
              type="text"
              value={inputData.materiPokok}
              onChange={(e) => onChange({ ...inputData, materiPokok: e.target.value })}
              placeholder="Contoh: Perbandingan Senilai dan Berbalik Nilai"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.materiPokok ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
              } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm`}
            />
            {errors.materiPokok && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.materiPokok}
              </p>
            )}
          </div>
        </div>

        {/* Row 4: Teks Capaian Pembelajaran (CP) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Teks Capaian Pembelajaran (CP) <span className="text-emerald-700">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Salin dari Keputusan BSKAP Kemendikbudristek / Kemenag</span>
          </div>
          <textarea
            rows={4}
            value={inputData.teksCP}
            onChange={(e) => onChange({ ...inputData, teksCP: e.target.value })}
            placeholder="Salin atau ketik teks Capaian Pembelajaran yang relevan di sini..."
            className={`w-full px-3.5 py-3 rounded-xl border ${
              errors.teksCP ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
            } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm leading-relaxed`}
          />
          {errors.teksCP && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.teksCP}
            </p>
          )}
        </div>

        {/* Row 5: Alokasi Waktu (JP & Pertemuan) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-5 p-4 rounded-xl bg-emerald-50/50 border border-emerald-900/10">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1.5">
              Alokasi Waktu (Jam Pelajaran) <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={80}
                value={inputData.alokasiJP}
                onChange={(e) => onChange({ ...inputData, alokasiJP: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition text-sm bg-white font-medium"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-emerald-700 font-semibold pointer-events-none">
                JP
              </span>
            </div>
            {errors.alokasiJP && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.alokasiJP}
              </p>
            )}
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1.5">
              Jumlah Pertemuan
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={30}
                value={inputData.alokasiPertemuan}
                onChange={(e) => onChange({ ...inputData, alokasiPertemuan: Number(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition text-sm bg-white font-medium"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-emerald-700 font-semibold pointer-events-none">
                Pertemuan
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1">
              Rata-rata {(inputData.alokasiJP / (inputData.alokasiPertemuan || 1)).toFixed(1)} JP / pertemuan
            </p>
          </div>

          <div className="md:col-span-4 flex items-center">
            <div className="text-xs text-emerald-900 bg-white/80 p-3 rounded-lg border border-emerald-200/80 w-full flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Total alokasi JP akan dicocokkan otomatis dengan estimasi waktu per Tujuan Pembelajaran (TP) untuk mencegah beban belajar berlebihan.
              </span>
            </div>
          </div>
        </div>

        {/* Row 6: Catatan Tambahan Guru (Opsional) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Catatan Tambahan Guru <span className="text-slate-400 font-normal">(Karakteristik peserta didik, konteks lokal madrasah, pesantren, dll)</span>
          </label>
          <textarea
            rows={2}
            value={inputData.catatanGuru}
            onChange={(e) => onChange({ ...inputData, catatanGuru: e.target.value })}
            placeholder="Contoh: Sebagian peserta didik memerlukan penguatan pada perkalian pecahan. Konteks lokal dapat menggunakan perbandingan resep jajanan tradisional..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm bg-slate-50/50"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base text-white shadow-md transition flex items-center justify-center gap-2.5 ${
              isLoading
                ? 'bg-emerald-800/70 cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] hover:shadow-lg'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{isLoading ? 'Sedang Memproses Analisis...' : 'Analisis dan Rumuskan TP'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
