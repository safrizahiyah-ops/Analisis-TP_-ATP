import { FormInputData } from '../types';

export const CONTOH_DATA_MTS: FormInputData = {
  namaMadrasah: 'MTs Negeri 1 Kota Yogyakarta',
  jenjang: 'MTs',
  mataPelajaran: 'Matematika',
  faseKelas: 'Fase D (Kelas VII)',
  semester: 'Genap',
  elemenCP: 'Bilangan',
  teksCP: 'Peserta didik dapat menggunakan pengertian rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah sehari-hari termasuk perbandingan senilai dan berbalik nilai, serta menggunakannya untuk membuat estimasi dan keputusan yang logis.',
  materiPokok: 'Perbandingan Senilai dan Berbalik Nilai',
  alokasiJP: 10,
  alokasiPertemuan: 4,
  catatanGuru: 'Peserta didik menyukai pembelajaran berbasis kontekstual dan diskusi kelompok. Terdapat beberapa santri yang perlu penguatan perkalian silang dan representasi tabel/grafik perbandingan.',
};

export const BLOOM_INFO: Record<string, { label: string; desc: string; color: string; badgeBg: string; badgeBorder: string; badgeText: string }> = {
  C1: {
    label: 'C1 - Mengingat',
    desc: 'Menyebutkan, mengidentifikasi, mendata, memilih, mengenali, mengingat kembali.',
    color: 'emerald',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
  },
  C2: {
    label: 'C2 - Memahami',
    desc: 'Menjelaskan, menguraikan, menginterpretasikan, mengklasifikasikan, memberikan contoh, membandingkan, menyimpulkan.',
    color: 'teal',
    badgeBg: 'bg-teal-50',
    badgeBorder: 'border-teal-200',
    badgeText: 'text-teal-700',
  },
  C3: {
    label: 'C3 - Menerapkan',
    desc: 'Menghitung, menentukan, menggunakan, menerapkan, menyelesaikan, menunjukkan, mendemonstrasikan.',
    color: 'cyan',
    badgeBg: 'bg-cyan-50',
    badgeBorder: 'border-cyan-200',
    badgeText: 'text-cyan-700',
  },
  C4: {
    label: 'C4 - Menganalisis',
    desc: 'Menganalisis, membedakan, menghubungkan, mengorganisasikan, menemukan pola, menguraikan hubungan, memeriksa.',
    color: 'amber',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
  },
  C5: {
    label: 'C5 - Mengevaluasi',
    desc: 'Menilai, mengevaluasi, memeriksa, mengkritisi, membuktikan, memberikan alasan, mempertimbangkan.',
    color: 'orange',
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-800',
  },
  C6: {
    label: 'C6 - Mencipta',
    desc: 'Merancang, membuat, menyusun, mengembangkan, menghasilkan, memodelkan, menciptakan strategi/solusi.',
    color: 'purple',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-800',
  },
};

export const SOLO_INFO: Record<string, { label: string; desc: string; badgeBg: string; badgeBorder: string; badgeText: string; isPrestructural?: boolean }> = {
  Prestructural: {
    label: 'Prestructural',
    desc: 'Informasi diagnostik awal, belum memahami tugas (JANGAN dijadikan TP).',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
    isPrestructural: true,
  },
  Unistructural: {
    label: 'Unistructural',
    desc: 'Satu aspek pemahaman sederhana (mengidentifikasi, menentukan satu prosedur, menunjukkan).',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
  },
  Multistructural: {
    label: 'Multistructural',
    desc: 'Beberapa aspek terpisah belum terhubung (menjelaskan beberapa prosedur, mengklasifikasi, langkah terpisah).',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-700',
  },
  Relational: {
    label: 'Relational',
    desc: 'Menghubungkan konsep secara terpadu (menganalisis struktur, memecahkan masalah kontekstual, menarik simpulan keterkaitan).',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
  },
  'Extended Abstract': {
    label: 'Extended Abstract',
    desc: 'Generalisasi dan transfer pemahaman ke situasi baru (merancang, memodelkan, membuat strategi baru).',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
  },
};

export const PANCA_CINTA_META: Record<string, { ringkas: string; icon: string; border: string; bg: string; text: string }> = {
  'Cinta Allah dan Rasul-Nya': {
    ringkas: 'Cinta Allah & Rasul',
    icon: 'HeartHandshake',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-800',
  },
  'Cinta Ilmu': {
    ringkas: 'Cinta Ilmu',
    icon: 'BookOpen',
    border: 'border-sky-300',
    bg: 'bg-sky-50/70',
    text: 'text-sky-800',
  },
  'Cinta Diri dan Sesama': {
    ringkas: 'Cinta Diri & Sesama',
    icon: 'Users',
    border: 'border-rose-300',
    bg: 'bg-rose-50/70',
    text: 'text-rose-800',
  },
  'Cinta Lingkungan': {
    ringkas: 'Cinta Lingkungan',
    icon: 'Sprout',
    border: 'border-teal-300',
    bg: 'bg-teal-50/70',
    text: 'text-teal-800',
  },
  'Cinta Tanah Air': {
    ringkas: 'Cinta Tanah Air',
    icon: 'Flag',
    border: 'border-amber-300',
    bg: 'bg-amber-50/70',
    text: 'text-amber-800',
  },
};

export const DAFTAR_KKO_DIKETAHUI = [
  'menyebutkan', 'mengidentifikasi', 'mendata', 'memilih', 'mengenali', 'mengingat',
  'menjelaskan', 'menguraikan', 'menginterpretasikan', 'mengklasifikasikan', 'memberikan contoh', 'membandingkan', 'menyimpulkan',
  'menghitung', 'menentukan', 'menggunakan', 'menerapkan', 'menyelesaikan', 'menunjukkan', 'mendemonstrasikan',
  'menganalisis', 'membedakan', 'menghubungkan', 'mengorganisasikan', 'menemukan pola', 'memeriksa',
  'menilai', 'mengevaluasi', 'mengkritisi', 'membuktikan', 'memberikan alasan', 'mempertimbangkan',
  'merancang', 'membuat', 'menyusun', 'mengembangkan', 'menghasilkan', 'memodelkan', 'menciptakan'
];
