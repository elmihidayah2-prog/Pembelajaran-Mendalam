import { AssessmentFormInput, JURUSAN_DETAILS, SOLO_TAXONOMY_INFO } from '../types/assessment';

export function buildAssessmentPrompt(input: AssessmentFormInput): string {
  const jurusanDetail = JURUSAN_DETAILS[input.jurusan];
  const soloInfo = SOLO_TAXONOMY_INFO[input.tingkatKognitif] || SOLO_TAXONOMY_INFO['Relasional'];

  return `Anda adalah seorang Ahli Perancangan Kurikulum dan Asesmen Vokasi SMK Perikanan dan Kelautan dari Sekolah Usaha Perikanan Menengah (SUPM) NEGERI TEGAL.

Tugas Anda adalah menyusun Perangkat Asesmen Lengkap yang komprehensif, valid, dan berbobot akademis tinggi untuk SMK Kejuruan Kelautan & Perikanan dengan rincian berikut:

==================== IDENTITAS ASESMEN ====================
- Satuan Pendidikan: ${input.namaSekolah}
- Guru Mata Pelajaran: ${input.namaGuru || 'Guru Pengampu'}
- Mata Pelajaran: ${input.mataPelajaran}
- Jenjang: SMK
- Tingkat / Kelas: Kelas ${input.kelas}
- Konsentrasi Keahlian / Jurusan: ${input.jurusan} (${jurusanDetail.nama}) - ${jurusanDetail.deskripsi}
- Jenis Asesmen: ${input.jenisAsesmen}
- Materi Pokok / Topik: ${input.materiTopik}
- Tujuan Pembelajaran (TP): ${input.tujuanPembelajaran}
${input.capaianPembelajaran ? `- Capaian Pembelajaran (CP) / Indikator Tambahan: ${input.capaianPembelajaran}` : ''}
- Bentuk Instrumen: ${input.bentukInstrumen}
- Jumlah Butir Soal/Tugas: ${input.jumlahSoal} butir
- Kerangka Kognitif: Taksonomi SOLO - ${input.tingkatKognitif} (${soloInfo.makna})
${input.instruksiTambahan ? `- Instruksi Khusus Tambahan: ${input.instruksiTambahan}` : ''}

==================== ATURAN LOGIKA JENIS ASESMEN ====================
Perhatikan secara ketat jenis asesmen yang dipilih:
${
  input.jenisAsesmen === 'Diagnostik'
    ? `* ASESMEN DIAGNOSTIK:
   - Fokus pada pengidentifikasian kemampuan awal, kesiapan belajar, prasyarat kompetensi, dan miskonsepsi umum yang sering terjadi pada siswa kejuruan kelautan/perikanan.
   - Soal mencakup pemeriksaan konsep dasar, logika operasional kapal/tambak/laboratorium, dan penalaran awal.
   - Rubrik & Pedoman Skor WAJIB menyertakan interpretasi diagnostik dan rekomendasi tindak lanjut diferensiasi (e.g. Siswa Kategori Butuh Matrikulasi Dasar, Kategori Siap Reguler, Kategori Pengayaan/Mahir).`
    : input.jenisAsesmen === 'Formatif'
    ? `* ASESMEN FORMATIF:
   - Fokus pada pemantauan proses belajar yang sedang berlangsung untuk memberikan umpan balik (feedback) deskriptif yang memandu perbaikan belajar siswa secara langsung.
   - Soal menyajikan studi kasus pemecahan masalah operasional nyata di laut, kapal, tambak, atau unit pengolahan ikan.
   - Rubrik menyertakan panduan pemberian umpan balik spesifik guru untuk membetulkan kekeliruan pemahaman siswa.`
    : `* ASESMEN SUMATIF:
   - Mengukur ketercapaian akhir tujuan pembelajaran dengan kisi-kisi ketat dan terstandar untuk penentuan nilai rapor/sertifikasi kompetensi kejuruan.
   - Instrumen memiliki daya beda yang valid dan reliabel.
   - Kunci jawaban dan pedoman penskoran konsisten dengan rumus perhitungan nilai akhir dan kriteria ketuntasan minimal (KKM).`
}

==================== SYARAT WAJIB INSTRUMEN & STRUKTUR ====================
1. KISI-KISI SOAL:
   - Buat tabel kisi-kisi pemetaan butir tepat sejumlah ${input.jumlahSoal} butir soal/tugas.
   - Setiap baris kisi-kisi memuat: no, tujuanPembelajaran, materi, indikatorSoal, levelSolo, bentukInstrumen, nomorButir, bobotSkor.
   
2. NASKAH SOAL PESERTA DIDIK:
   - Format siap cetak untuk siswa, TIDAK BOLEH memuat kunci jawaban atau tanda opsi yang benar sama sekali.
   - Tepat memuat ${input.jumlahSoal} butir pertanyaan bernomor urut 1 sampai ${input.jumlahSoal}.
   ${
     input.bentukInstrumen === 'Pilihan Ganda' || input.bentukInstrumen === 'Campuran'
       ? `- ATURAN MUTLAK PILIHAN GANDA: SETIAP butir pilihan ganda WAJIB memiliki tepat 5 pilihan opsi: A, B, C, D, dan E. Opsi pengecoh (distractor) harus masuk akal, logis, tidak ambigu, dan berbasis terminologi kejuruan maritim/perikanan yang benar.`
       : `- Instruksi soal/tugas harus jelas, memuat stimulus skenario/studi kasus nyata kejuruan ${input.jurusan}, alat & bahan, serta langkah kerja.`
   }

3. KUNCI JAWABAN TERPISAH:
   - Terpisah rapi dari naskah siswa.
   - Memuat nomor butir, bentuk, kunci/pedoman jawaban, pembahasan rasional ilmiah yang mendalam, dan kata kunci kriteria jawaban yang diharapkan.

4. RUBRIK DAN PEDOMAN PENSKORAN:
   - Pilihan Ganda: aturan skor per butir dan total skor.
   - Esai / Praktik: kriteria analitis terperinci dengan gradasi skor (Sangat Baik, Baik, Cukup, Kurang).
   - Rumus konversi nilai akhir skala 0-100.
   - Interpretasi hasil & rencana tindak lanjut pembelajaran konkret.

5. PEMERIKSAAN MUTU (QUALITY ASSURANCE):
   - Verifikasi bahwa jumlah butir tepat ${input.jumlahSoal}, pilihan ganda memiliki 5 opsi A-E, materi dan SOLO taxonomy terpetakan akurat.

Keluarkan hasil HANYA dalam format JSON valid sesuai schema berikut:
{
  "kisiKisi": [
    {
      "no": 1,
      "tujuanPembelajaran": "...",
      "materi": "...",
      "indikatorSoal": "...",
      "levelSolo": "...",
      "bentukInstrumen": "...",
      "nomorButir": "1",
      "bobotSkor": 10
    }
  ],
  "naskahSoal": {
    "petunjukUmum": ["...", "..."],
    "petunjukKhusus": "...",
    "butirSoal": [
      {
        "nomor": 1,
        "bentuk": "Pilihan Ganda",
        "levelSolo": "Relasional",
        "pertanyaan": "...",
        "konteksMaritim": "...",
        "opsi": [
          { "key": "A", "text": "..." },
          { "key": "B", "text": "..." },
          { "key": "C", "text": "..." },
          { "key": "D", "text": "..." },
          { "key": "E", "text": "..." }
        ],
        "petunjukPengerjaan": "..."
      }
    ]
  },
  "kunciJawaban": [
    {
      "nomor": 1,
      "bentuk": "Pilihan Ganda",
      "kunci": "A",
      "pembahasan": "...",
      "kriteriaJawaban": ["..."],
      "skorMaksimal": 10
    }
  ],
  "rubrik": {
    "deskripsiRubrik": "...",
    "kriteria": [
      {
        "komponen": "...",
        "deskripsi": "...",
        "skorMaks": 25,
        "indikatorKinerja": {
          "sangatBaik": "...",
          "baik": "...",
          "cukup": "...",
          "kurang": "..."
        }
      }
    ],
    "skorMaksimalTotal": 100,
    "rumusNilai": "Nilai Akhir = (Total Skor Perolehan / Total Skor Maksimal) x 100",
    "interpretasiDanTindakLanjut": [
      {
        "kategori": "Mahir / Sangat Tuntas",
        "rentangSkor": "85 - 100",
        "tindakLanjut": "Diberikan pengayaan materi..."
      },
      {
        "kategori": "Cakap / Tuntas",
        "rentangSkor": "70 - 84",
        "tindakLanjut": "Mampu melanjutkan ke materi berikutnya..."
      },
      {
        "kategori": "Perlu Bimbingan / Belum Tuntas",
        "rentangSkor": "< 70",
        "tindakLanjut": "Program matrikulasi / remedial kelompok terarah..."
      }
    ]
  },
  "pemeriksaanMutu": {
    "jumlahButirSesuai": true,
    "seluruhPgLimaOpsi": true,
    "kisiKisiLengkap": true,
    "tingkatSoloTerpetakan": true,
    "catatanVerifikasi": "Perangkat asesmen telah diverifikasi memenuhi ${input.jumlahSoal} butir, struktur SOLO taxonomy, dan kekhususan vokasi ${input.jurusan} SUPM Tegal."
  }
}`;
}
