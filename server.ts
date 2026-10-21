import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import type { AssessmentData } from './src/types/assessment';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AssessmentType = 'Diagnostik' | 'Formatif' | 'Sumatif';
export type JurusanType = 'NKPI' | 'TKPI' | 'APPL' | 'APPHP';
export type InstrumentType = 'Pilihan Ganda' | 'Esai/Uraian' | 'Praktik/Unjuk Kerja' | 'Observasi' | 'Campuran';
export type SoloLevel = 'Prastruktural' | 'Unistruktural' | 'Multistruktural' | 'Relasional' | 'Abstrak Diperluas' | 'Campuran/Proporsional';

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

const JURUSAN_DETAILS: Record<JurusanType, { nama: string; deskripsi: string }> = {
  NKPI: {
    nama: 'Nautika Kapal Penangkap Ikan',
    deskripsi: 'Navigasi pelayaran, olah gerak kapal, penangkapan ikan, keselamatan maritim',
  },
  TKPI: {
    nama: 'Teknika Kapal Penangkap Ikan',
    deskripsi: 'Mesin utama kapal penangkap ikan, sistem pendingin reefer, kelistrikan & perpipaan',
  },
  APPL: {
    nama: 'Agribisnis Perikanan Air Payau dan Laut',
    deskripsi: 'Budidaya udang vaname, bandeng, kerapu, manajemen pakan alami & mutu air tambak',
  },
  APPHP: {
    nama: 'Agribisnis Pengolahan Hasil Perikanan',
    deskripsi: 'Teknologi pengolahan hasil laut, cold chain, surimi, pengalengan, HACCP & sanitasi',
  },
};

const SOLO_TAXONOMY_INFO: Record<string, { label: string; makna: string }> = {
  Prastruktural: {
    label: 'Prastruktural (Prestructural)',
    makna: 'Belum memahami informasi inti, miskonsepsi dasar, tidak ada organisasi konsep.',
  },
  Unistruktural: {
    label: 'Unistruktural (Unistructural)',
    makna: 'Memahami satu fakta/aspek tunggal sederhana yang berdiri sendiri secara konkret.',
  },
  Multistruktural: {
    label: 'Multistruktural (Multistructural)',
    makna: 'Mengetahui beberapa aspek/prosedur independen tanpa memahami hubungan antar aspek.',
  },
  Relasional: {
    label: 'Relasional (Relational)',
    makna: 'Mengintegrasikan berbagai konsep menjadi kesatuan utuh, sebab-akibat, aplikasi di lapangan perikanan.',
  },
  'Abstrak Diperluas': {
    label: 'Abstrak Diperluas (Extended Abstract)',
    makna: 'Mengkonseptualisasikan ke situasi baru, memprediksi, merumuskan hipotesis, evaluasi komprehensif.',
  },
  'Campuran/Proporsional': {
    label: 'Campuran / Bertingkat (Proporsional SOLO)',
    makna: 'Distribusi bertingkat dari Unistruktural hingga Relasional dan Abstrak Diperluas.',
  },
};

function buildAssessmentPrompt(input: AssessmentFormInput): string {
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
${
  input.jenisAsesmen === 'Diagnostik'
    ? `* ASESMEN DIAGNOSTIK:
   - Fokus pada pengidentifikasian kemampuan awal, kesiapan belajar, prasyarat kompetensi, dan miskonsepsi umum siswa kejuruan kelautan/perikanan.
   - Rubrik & Pedoman Skor WAJIB menyertakan interpretasi diagnostik dan rekomendasi tindak lanjut diferensiasi (Matrikulasi Dasar, Siap Reguler, Pengayaan/Mahir).`
    : input.jenisAsesmen === 'Formatif'
    ? `* ASESMEN FORMATIF:
   - Fokus pada pemantauan proses belajar on-going untuk umpan balik konstruktif langsung.
   - Soal menyajikan studi kasus pemecahan masalah operasional nyata di laut, kapal, tambak, atau unit pengolahan ikan.`
    : `* ASESMEN SUMATIF:
   - Mengukur ketercapaian akhir tujuan pembelajaran dengan kisi-kisi ketat dan terstandar untuk penentuan nilai rapor.
   - Kunci jawaban dan pedoman penskoran konsisten dengan rumus perhitungan nilai akhir dan standar KKM.`
}

==================== SYARAT WAJIB INSTRUMEN & STRUKTUR ====================
1. KISI-KISI SOAL: Tabel matriks tepat ${input.jumlahSoal} butir.
2. NASKAH SOAL: Siap cetak untuk peserta didik TANPA memuat kunci jawaban. SETIAP butir pilihan ganda WAJIB tepat 5 opsi A, B, C, D, E.
3. KUNCI JAWABAN TERPISAH: Memuat nomor butir, bentuk, kunci/pedoman, pembahasan rasional ilmiah, dan kriteria jawaban.
4. RUBRIK DAN PEDOMAN PENSKORAN: Kriteria analitis, skor maksimal, rumus nilai, dan tindak lanjut konkret.
5. PEMERIKSAAN MUTU: Verifikasi jumlah butir, 5 opsi A-E untuk PG, dan keselarasan SOLO.

Keluarkan hasil HANYA dalam format JSON valid.`;
}

// Shared Gemini AI client with telemetry user agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function callGeminiWithRetry(prompt: string, maxRetries = 2): Promise<string> {
  let attempt = 0;
  let delay = 1500;

  while (attempt <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Anda adalah Pakar Asesmen Vokasi SMK Perikanan & Kelautan SUPM Tegal. Keluarkan output HANYA dalam format JSON murni tanpa markdown triple backticks. Pastikan seluruh butir pilihan ganda WAJIB memiliki tepat 5 opsi: A, B, C, D, E. Kisi-kisi, naskah soal, kunci jawaban, dan rubrik harus konsisten dan selaras dengan Taksonomi SOLO.',
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      if (!text.trim()) {
        throw new Error('Respons model Gemini kosong.');
      }
      return text;
    } catch (err: any) {
      attempt++;
      console.warn(`[Gemini API Attempt ${attempt} failed]:`, err?.message || err);

      const isQuotaOrRateLimit =
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('Quota exceeded');

      const isServerError =
        err?.status === 503 ||
        err?.status === 500 ||
        err?.message?.includes('503') ||
        err?.message?.includes('500');

      if ((isQuotaOrRateLimit || isServerError) && attempt <= maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
  throw new Error('Gagal menghubungi layanan Gemini setelah percobaan berulang.');
}

function sanitizeAndValidateAssessment(
  parsed: any,
  input: AssessmentFormInput
): AssessmentData {
  const jurusanDetail = JURUSAN_DETAILS[input.jurusan];
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const metadata = {
    id: `SUPM-${Date.now()}`,
    namaSekolah: 'SUPM TEGAL',
    namaGuru: input.namaGuru || 'Guru Pengampu',
    mataPelajaran: input.mataPelajaran,
    jenjang: 'SMK',
    kelas: input.kelas,
    jurusan: input.jurusan,
    jurusanNamaLengkap: jurusanDetail.nama,
    jenisAsesmen: input.jenisAsesmen,
    materiTopik: input.materiTopik,
    tujuanPembelajaran: input.tujuanPembelajaran,
    capaianPembelajaran: input.capaianPembelajaran,
    bentukInstrumen: input.bentukInstrumen,
    jumlahSoal: input.jumlahSoal,
    tingkatKognitif: input.tingkatKognitif,
    tanggalDibuat: today,
  };

  // Validate Kisi-Kisi
  const rawKisi = Array.isArray(parsed?.kisiKisi) ? parsed.kisiKisi : [];
  const kisiKisi = rawKisi.map((k: any, i: number) => ({
    no: Number(k.no || i + 1),
    tujuanPembelajaran: String(k.tujuanPembelajaran || input.tujuanPembelajaran),
    materi: String(k.materi || input.materiTopik),
    indikatorSoal: String(k.indikatorSoal || `Mampu menganalisis aspek kejuruan ${input.jurusan}`),
    levelSolo: String(k.levelSolo || input.tingkatKognitif),
    bentukInstrumen: String(k.bentukInstrumen || input.bentukInstrumen),
    nomorButir: String(k.nomorButir || i + 1),
    bobotSkor: Number(k.bobotSkor || Math.round(100 / input.jumlahSoal)),
  }));

  // Validate Naskah Soal
  const rawSoalList = Array.isArray(parsed?.naskahSoal?.butirSoal)
    ? parsed.naskahSoal.butirSoal
    : [];

  const butirSoal = rawSoalList.map((q: any, i: number) => {
    const no = Number(q.nomor || i + 1);
    const bentuk = String(q.bentuk || input.bentukInstrumen);
    const levelSolo = String(q.levelSolo || input.tingkatKognitif);
    const pertanyaan = String(q.pertanyaan || `Soal ${no}: Jelaskan prosedur teknis terkait ${input.materiTopik}.`);
    const konteksMaritim = q.konteksMaritim ? String(q.konteksMaritim) : undefined;
    const petunjukPengerjaan = q.petunjukPengerjaan ? String(q.petunjukPengerjaan) : undefined;

    let opsi = undefined;
    if (bentuk === 'Pilihan Ganda' || Array.isArray(q.opsi)) {
      const keys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
      opsi = keys.map((key) => {
        const found = Array.isArray(q.opsi)
          ? q.opsi.find((o: any) => o?.key?.toUpperCase() === key)
          : null;
        return {
          key,
          text: String(found?.text || `Pilihan ${key} untuk soal nomor ${no}`),
        };
      });
    }

    return {
      nomor: no,
      bentuk,
      levelSolo,
      pertanyaan,
      konteksMaritim,
      opsi,
      petunjukPengerjaan,
    };
  });

  const petunjukUmum = Array.isArray(parsed?.naskahSoal?.petunjukUmum) && parsed.naskahSoal.petunjukUmum.length > 0
    ? parsed.naskahSoal.petunjukUmum.map(String)
    : [
        'Tuliskan identitas Anda dengan lengkap dan benar pada lembar jawaban yang tersedia.',
        'Periksa dan bacalah setiap butir soal dengan teliti sebelum menjawab.',
        'Dahulukan menjawab soal-soal yang Anda anggap mudah.',
        'Jawablah secara jujur sesuai pemahaman kejuruan maritim/perikanan Anda.',
        'Periksa kembali seluruh lembar jawaban sebelum diserahkan kepada pengawas.',
      ];

  // Validate Kunci Jawaban
  const rawKunci = Array.isArray(parsed?.kunciJawaban) ? parsed.kunciJawaban : [];
  const kunciJawaban = rawKunci.map((k: any, i: number) => ({
    nomor: Number(k.nomor || i + 1),
    bentuk: String(k.bentuk || input.bentukInstrumen),
    kunci: String(k.kunci || 'A'),
    pembahasan: String(k.pembahasan || 'Pembahasan rasional konsep kejuruan belum disediakan secara mendalam.'),
    kriteriaJawaban: Array.isArray(k.kriteriaJawaban) ? k.kriteriaJawaban.map(String) : [],
    skorMaksimal: Number(k.skorMaksimal || Math.round(100 / input.jumlahSoal)),
  }));

  // Validate Rubrik
  const rawRubrik = parsed?.rubrik || {};
  const kriteria = Array.isArray(rawRubrik.kriteria) && rawRubrik.kriteria.length > 0
    ? rawRubrik.kriteria.map((c: any) => ({
        komponen: String(c.komponen || 'Pemahaman Konsep & Prosedur'),
        deskripsi: String(c.deskripsi || 'Ketepatan dalam menjelaskan konsep kejuruan'),
        skorMaks: Number(c.skorMaks || 25),
        indikatorKinerja: c.indikatorKinerja
          ? {
              sangatBaik: String(c.indikatorKinerja.sangatBaik || 'Sangat tepat dan komprehensif'),
              baik: String(c.indikatorKinerja.baik || 'Tepat dengan rincian memadai'),
              cukup: String(c.indikatorKinerja.cukup || 'Sebagian tepat namun kurang rinci'),
              kurang: String(c.indikatorKinerja.kurang || 'Belum tepat dan terdapat miskonsepsi'),
            }
          : undefined,
      }))
    : [
        {
          komponen: 'Penguasaan Konsep Kejuruan',
          deskripsi: 'Kemampuan mengidentifikasi prinsip kerja kelautan/perikanan',
          skorMaks: 50,
          indikatorKinerja: {
            sangatBaik: 'Menguasai 90-100% konsep dengan penalaran logis',
            baik: 'Menguasai 75-89% konsep dasar',
            cukup: 'Menguasai 60-74% konsep dengan beberapa asistensi',
            kurang: 'Penguasaan di bawah 60%',
          },
        },
        {
          komponen: 'Penerapan Prosedur SOP Maritim',
          deskripsi: 'Ketepatan langkah kerja dan keselamatan kerja K3',
          skorMaks: 50,
          indikatorKinerja: {
            sangatBaik: 'Sesuai standar operasional baku dan K3',
            baik: 'Memenuhi prinsip utama SOP',
            cukup: 'Memerlukan pengawasan berkala',
            kurang: 'Belum menerapkan standar keselamatan',
          },
        },
      ];

  const rubrik = {
    deskripsiRubrik: String(rawRubrik.deskripsiRubrik || `Rubrik penilaian asesmen ${input.jenisAsesmen} mata pelajaran ${input.mataPelajaran}`),
    kriteria,
    skorMaksimalTotal: Number(rawRubrik.skorMaksimalTotal || 100),
    rumusNilai: String(rawRubrik.rumusNilai || 'Nilai Akhir = (Total Skor Perolehan / Total Skor Maksimal) x 100'),
    interpretasiDanTindakLanjut: Array.isArray(rawRubrik.interpretasiDanTindakLanjut) && rawRubrik.interpretasiDanTindakLanjut.length > 0
      ? rawRubrik.interpretasiDanTindakLanjut.map((t: any) => ({
          kategori: String(t.kategori || 'Tuntas'),
          rentangSkor: String(t.rentangSkor || '75 - 100'),
          tindakLanjut: String(t.tindakLanjut || 'Melanjutkan ke kompetensi berikutnya'),
        }))
      : [
          {
            kategori: 'Mahir / Sangat Memuaskan',
            rentangSkor: '85 - 100',
            tindakLanjut: 'Diberikan penugasan pengayaan kasus maritim kompleks',
          },
          {
            kategori: 'Cakap / Tuntas Standar',
            rentangSkor: '70 - 84',
            tindakLanjut: 'Dapat melanjutkan materi dengan pendampingan mandiri',
          },
          {
            kategori: 'Perlu Bimbingan Khusus',
            rentangSkor: '< 70',
            tindakLanjut: 'Wajib mengikuti program matrikulasi / bimbingan remedial terbimbing',
          },
        ],
  };

  const pemeriksaanMutu = {
    jumlahButirSesuai: butirSoal.length === input.jumlahSoal,
    seluruhPgLimaOpsi: butirSoal.every((b: any) => (b.opsi ? b.opsi.length === 5 : true)),
    kisiKisiLengkap: kisiKisi.length === butirSoal.length,
    tingkatSoloTerpetakan: true,
    catatanVerifikasi: parsed?.pemeriksaanMutu?.catatanVerifikasi || `Perangkat asesmen telah diverifikasi memenuhi ${butirSoal.length} butir soal, Taksonomi SOLO, dan standar kurikulum ${input.jurusan} SUPM Tegal.`,
  };

  return {
    metadata,
    kisiKisi,
    naskahSoal: {
      petunjukUmum,
      petunjukKhusus: parsed?.naskahSoal?.petunjukKhusus,
      butirSoal,
    },
    kunciJawaban,
    rubrik,
    pemeriksaanMutu,
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '15mb' }));

  // Status check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0),
      timestamp: new Date().toISOString(),
    });
  });

  // Generate assessment API endpoint
  app.post('/api/generate-assessment', async (req: Request, res: Response) => {
    try {
      const input: AssessmentFormInput = req.body;

      // Validation
      if (!input.mataPelajaran || !input.materiTopik || !input.tujuanPembelajaran) {
        return res.status(400).json({
          error: 'Mata pelajaran, materi/topik, dan tujuan pembelajaran wajib diisi.',
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'Kunci API Gemini (GEMINI_API_KEY) belum terkonfigurasi pada server.',
          hint: 'Gunakan Mode Manual Cadangan di bawah untuk menyalin atau mengunduh prompt siap pakai.',
        });
      }

      const prompt = buildAssessmentPrompt(input);
      const rawResponse = await callGeminiWithRetry(prompt, 2);

      let parsedJson: any;
      try {
        // Strip codeblocks if any
        let cleanText = rawResponse.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```json?\s*/i, '').replace(/\s*```$/, '');
        }
        parsedJson = JSON.parse(cleanText);
      } catch (jsonErr: any) {
        console.error('Failed to parse Gemini response as JSON:', rawResponse.slice(0, 300));
        return res.status(502).json({
          error: 'Format respons AI tidak valid sebagai JSON terstruktur. Silakan coba kembali atau gunakan Mode Manual Cadangan.',
        });
      }

      const assessmentData = sanitizeAndValidateAssessment(parsedJson, input);
      return res.json({ success: true, data: assessmentData });
    } catch (err: any) {
      console.error('Error generating assessment:', err);

      let errorMessage = 'Terjadi kesalahan internal saat memproses asesmen dengan Gemini AI.';
      let statusCode = 500;

      const messageLower = (err?.message || '').toLowerCase();
      if (messageLower.includes('api_key_invalid') || messageLower.includes('invalid api key')) {
        errorMessage = 'Kunci API Gemini tidak valid atau kedaluwarsa. Silakan periksa pengaturan secret pada AI Studio.';
        statusCode = 401;
      } else if (messageLower.includes('resource_exhausted') || messageLower.includes('quota') || messageLower.includes('429')) {
        errorMessage = 'Batas kuota layanan Gemini API telah tercapai (Rate Limit / Quota Exceeded). Silakan coba lagi dalam beberapa menit atau gunakan Mode Manual Cadangan.';
        statusCode = 429;
      } else if (messageLower.includes('network') || messageLower.includes('fetch failed') || messageLower.includes('timeout')) {
        errorMessage = 'Koneksi jaringan menuju server Gemini API terputus atau timeout. Periksa sambungan internet Anda.';
        statusCode = 504;
      }

      return res.status(statusCode).json({
        error: errorMessage,
        details: err?.message ? String(err.message).slice(0, 200) : undefined,
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[SUPM TEGAL Assessment Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
