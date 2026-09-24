import { FormInputData, HasilPerumusanTP, RiwayatDokumen } from '../types';

const STORAGE_KEY = 'pertama_riwayat_dokumen_v1';

export function simpanRiwayat(input: FormInputData, hasil: HasilPerumusanTP, idLama?: string): RiwayatDokumen {
  const list = dapatkanDaftarRiwayat();
  const id = idLama || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const judul = `${input.mataPelajaran || 'Mapel'} - ${input.materiPokok || 'Materi'} (${input.jenjang} ${input.faseKelas})`;
  
  const newItem: RiwayatDokumen = {
    id,
    judul,
    waktuDibuat: new Date().toISOString(),
    input,
    hasil,
  };

  const existingIndex = list.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    list[existingIndex] = newItem;
  } else {
    list.unshift(newItem);
  }

  // Limit up to 50 saved documents
  if (list.length > 50) {
    list.length = 50;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Gagal menyimpan ke localStorage:', e);
  }

  return newItem;
}

export function dapatkanDaftarRiwayat(): RiwayatDokumen[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca localStorage:', e);
    return [];
  }
}

export function hapusRiwayat(id: string): RiwayatDokumen[] {
  try {
    const list = dapatkanDaftarRiwayat().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Gagal menghapus dari localStorage:', e);
    return [];
  }
}

export function hapusSemuaRiwayat(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Gagal membersihkan localStorage:', e);
  }
}
