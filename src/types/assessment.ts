export type AssessmentType = 'Diagnostik' | 'Formatif' | 'Sumatif';

export type JurusanType = 'NKPI' | 'TKPI' | 'APPL' | 'APPHP';

export type InstrumentType = 
  | 'Pilihan Ganda' 
  | 'Esai/Uraian' 
  | 'Praktik/Unjuk Kerja' 
  | 'Observasi' 
  | 'Campuran';

export type SoloLevel = 
  | 'Prastruktural' 
  | 'Unistruktural' 
  | 'Multistruktural' 
  | 'Relasional' 
  | 'Abstrak Diperluas'
  | 'Campuran/Proporsional';

export interface AssessmentFormInput {
  namaSekolah: string;
  namaGuru: string;
  mataPelajaran: string;
  jenjang: 'SMK';
  kelas: 'X' | 'XI' | 'XII';
  jurusan: JurusanType;
  jenisAsesmen: AssessmentType;
  materiTopik: string;
  tujuanPembelajaran: string;
  capaianPembelajaran?: string;
  bentukInstrumen: InstrumentType;
  jumlahSoal: number;
  tingkatKognitif: SoloLevel;
  instruksiTambahan?: string;
}

export interface KisiKisiItem {
  no: number;
  tujuanPembelajaran: string;
  materi: string;
  indikatorSoal: string;
  levelSolo: string;
  bentukInstrumen: string;
  nomorButir: string;
  bobotSkor: number;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface QuestionItem {
  nomor: number;
  bentuk: string;
  levelSolo: string;
  pertanyaan: string;
  konteksMaritim?: string;
  opsi?: QuestionOption[]; // Wajib 5 opsi jika PG
  petunjukPengerjaan?: string;
}

export interface AnswerKeyItem {
  nomor: number;
  bentuk: string;
  kunci: string; // "A", "B", ... or answer summary
  pembahasan: string;
  kriteriaJawaban?: string[]; // Expected answer components
  skorMaksimal: number;
}

export interface RubrikKriteria {
  komponen: string;
  deskripsi: string;
  skorMaks: number;
  indikatorKinerja?: {
    sangatBaik: string;
    baik: string;
    cukup: string;
    kurang: string;
  };
}

export interface RubrikData {
  deskripsiRubrik: string;
  kriteria: RubrikKriteria[];
  skorMaksimalTotal: number;
  rumusNilai: string;
  interpretasiDanTindakLanjut: {
    kategori: string;
    rentangSkor: string;
    tindakLanjut: string;
  }[];
}

export interface AssessmentData {
  metadata: {
    id: string;
    namaSekolah: string;
    namaGuru: string;
    mataPelajaran: string;
    jenjang: string;
    kelas: string;
    jurusan: JurusanType;
    jurusanNamaLengkap: string;
    jenisAsesmen: AssessmentType;
    materiTopik: string;
    tujuanPembelajaran: string;
    capaianPembelajaran?: string;
    bentukInstrumen: InstrumentType;
    jumlahSoal: number;
    tingkatKognitif: SoloLevel;
    tanggalDibuat: string;
  };
  kisiKisi: KisiKisiItem[];
  naskahSoal: {
    petunjukUmum: string[];
    petunjukKhusus?: string;
    butirSoal: QuestionItem[];
  };
  kunciJawaban: AnswerKeyItem[];
  rubrik: RubrikData;
  pemeriksaanMutu: {
    jumlahButirSesuai: boolean;
    seluruhPgLimaOpsi: boolean;
    kisiKisiLengkap: boolean;
    tingkatSoloTerpetakan: boolean;
    catatanVerifikasi: string;
  };
}

export const JURUSAN_DETAILS: Record<JurusanType, { nama: string; deskripsi: string; icon: string }> = {
  NKPI: {
    nama: 'Nautika Kapal Penangkap Ikan',
    deskripsi: 'Navigasi pelayaran, olah gerak kapal, penangkapan ikan, keselamatan maritim',
    icon: 'Compass',
  },
  TKPI: {
    nama: 'Teknika Kapal Penangkap Ikan',
    deskripsi: 'Mesin utama kapal penangkap ikan, sistem pendingin reefer, kelistrikan & perpipaan',
    icon: 'Wrench',
  },
  APPL: {
    nama: 'Agribisnis Perikanan Air Payau dan Laut',
    deskripsi: 'Budidaya udang vaname, bandeng, kerapu, manajemen pakan alami & mutu air tambak',
    icon: 'Waves',
  },
  APPHP: {
    nama: 'Agribisnis Pengolahan Hasil Perikanan',
    deskripsi: 'Teknologi pengolahan hasil laut, cold chain, surimi, pengalengan, HACCP & sanitasi',
    icon: 'Fish',
  },
};

export const SOLO_TAXONOMY_INFO: Record<string, { label: string; makna: string; contohKataKerja: string }> = {
  Prastruktural: {
    label: 'Prastruktural (Prestructural)',
    makna: 'Belum memahami informasi inti, miskonsepsi dasar, tidak ada organisasi konsep.',
    contohKataKerja: 'Belum relevan, menebak sembarangan',
  },
  Unistruktural: {
    label: 'Unistruktural (Unistructural)',
    makna: 'Memahami satu fakta/aspek tunggal sederhana yang berdiri sendiri secara konkret.',
    contohKataKerja: 'Menyebutkan, mengingat, mendefinisikan, mengidentifikasi 1 unsur',
  },
  Multistruktural: {
    label: 'Multistruktural (Multistructural)',
    makna: 'Mengetahui beberapa aspek/prosedur independen tanpa memahami hubungan antar aspek.',
    contohKataKerja: 'Mendaftar, mendeskripsikan, mengklasifikasikan, mengurutkan langkah',
  },
  Relasional: {
    label: 'Relasional (Relational)',
    makna: 'Mengintegrasikan berbagai konsep menjadi kesatuan utuh, sebab-akibat, aplikasi di lapangan perikanan.',
    contohKataKerja: 'Menganalisis, membandingkan, mengaitkan, memecahkan masalah praktis maritim',
  },
  'Abstrak Diperluas': {
    label: 'Abstrak Diperluas (Extended Abstract)',
    makna: 'Mengkonseptualisasikan ke situasi baru, memprediksi, merumuskan hipotesis, evaluasi komprehensif.',
    contohKataKerja: 'Merancang, merefleksikan, mengevaluasi sistemik, menciptakan strategi baru',
  },
  'Campuran/Proporsional': {
    label: 'Campuran / Bertingkat (Proporsional SOLO)',
    makna: 'Distribusi bertingkat dari Unistruktural hingga Relasional dan Abstrak Diperluas.',
    contohKataKerja: 'Kombinasi bergradasi sesuai kedalaman materi',
  },
};
