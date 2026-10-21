import React, { useState } from 'react';
import {
  AssessmentFormInput,
  AssessmentType,
  InstrumentType,
  JurusanType,
  SoloLevel,
  JURUSAN_DETAILS,
  SOLO_TAXONOMY_INFO,
} from '../types/assessment';
import {
  Sparkles,
  School,
  UserCheck,
  Compass,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

interface AssessmentFormProps {
  input: AssessmentFormInput;
  onChange: (input: AssessmentFormInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTextChange = (
    field: keyof AssessmentFormInput,
    value: string | number
  ) => {
    onChange({
      ...input,
      [field]: value,
    });
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!input.mataPelajaran.trim()) {
      newErrors.mataPelajaran = 'Mata pelajaran wajib diisi.';
    }
    if (!input.materiTopik.trim()) {
      newErrors.materiTopik = 'Materi pokok / topik pembelajaran wajib diisi.';
    }
    if (!input.tujuanPembelajaran.trim()) {
      newErrors.tujuanPembelajaran = 'Tujuan pembelajaran (TP) wajib diisi.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    onSubmit();
  };

  // Quick curriculum presets for SUPM teachers to test or inspire
  const quickPresets = [
    {
      label: 'Navigasi Radar (NKPI)',
      jurusan: 'NKPI' as JurusanType,
      kelas: 'XI' as const,
      mataPelajaran: 'Navigasi Radar dan Alat Navigasi Elektronik',
      jenis: 'Sumatif' as AssessmentType,
      materi: 'Prinsip kerja Radar Kapal, interpretasi tampilan PPI, dan penentuan posisi kapal di perairan sempit',
      tp: 'Peserta didik mampu mengoperasikan radar navigasi kapal penangkap ikan, mengidentifikasi target objek di laut, dan menghitung CPA/TCPA untuk pencegahan tubrukan di laut (COLREG 1972).',
      bentuk: 'Pilihan Ganda' as InstrumentType,
      solo: 'Relasional' as SoloLevel,
      jumlah: 10,
    },
    {
      label: 'Diesel Kapal (TKPI)',
      jurusan: 'TKPI' as JurusanType,
      kelas: 'XII' as const,
      mataPelajaran: 'Permesinan Kapal Penangkap Ikan (Motor Diesel)',
      jenis: 'Formatif' as AssessmentType,
      materi: 'Sistem bahan bakar mesin diesel kapal, pemeliharaan injector, dan troubleshooting gangguan pembakaran',
      tp: 'Peserta didik mampu menganalisis siklus kerja sistem bahan bakar mesin induk diesel, mendiagnosis penyebab hilangnya tenaga mesin, serta melakukan prosedur perawatan injektor bahan bakar sesuai manual pabrikan.',
      bentuk: 'Campuran' as InstrumentType,
      solo: 'Relasional' as SoloLevel,
      jumlah: 10,
    },
    {
      label: 'Kualitas Air Tambak (APPL)',
      jurusan: 'APPL' as JurusanType,
      kelas: 'X' as const,
      mataPelajaran: 'Dasar-Dasar Budidaya Perikanan Air Payau & Laut',
      jenis: 'Diagnostik' as AssessmentType,
      materi: 'Parameter kualitas air fisika-kimia tambak udang vaname (DO, pH, Salinitas, Suhu, dan Amonia)',
      tp: 'Peserta didik mampu mengidentifikasi parameter kualitas air penentu kelangsungan hidup udang vaname serta memahami prasyarat lingkungan sebelum proses tebar benur.',
      bentuk: 'Pilihan Ganda' as InstrumentType,
      solo: 'Multistruktural' as SoloLevel,
      jumlah: 10,
    },
    {
      label: 'HACCP Ikan Segar (APHP)',
      jurusan: 'APHP' as JurusanType,
      kelas: 'XI' as const,
      mataPelajaran: 'Pengendalian Mutu & Keamanan Pangan Perikanan',
      jenis: 'Sumatif' as AssessmentType,
      materi: 'Penerapan 7 Prinsip HACCP dan GMP pada rantai dingin (cold chain) penanganan ikan tongkol segar',
      tp: 'Peserta didik mampu merumuskan titik kendali kritis (CCP) pada proses penerimaan hingga pembekuan ikan, menetapkan batas kritis suhu, dan menyusun tindakan koreksi untuk mempertahankan kesegaran ikan mutu ekspor.',
      bentuk: 'Esai/Uraian' as InstrumentType,
      solo: 'Abstrak Diperluas' as SoloLevel,
      jumlah: 5,
    },
  ];

  const applyPreset = (preset: typeof quickPresets[0]) => {
    onChange({
      ...input,
      jurusan: preset.jurusan,
      kelas: preset.kelas,
      mataPelajaran: preset.mataPelajaran,
      jenisAsesmen: preset.jenis,
      materiTopik: preset.materi,
      tujuanPembelajaran: preset.tp,
      bentukInstrumen: preset.bentuk,
      tingkatKognitif: preset.solo,
      jumlahSoal: preset.jumlah,
    });
    setErrors({});
  };

  return (
    <form onSubmit={validateAndSubmit} className="space-y-6">
      {/* Quick Template Presets Bar */}
      <div className="bg-sky-50/80 border border-sky-200/90 rounded-xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-900">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Contoh Preset Cepat Kejuruan SUPM Tegal:</span>
          </div>
          <span className="text-[11px] text-sky-700 hidden sm:inline">
            Klik untuk mengisi formulir otomatis sebagai referensi
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs bg-white hover:bg-sky-100/90 text-sky-900 font-medium px-2.5 py-1.5 rounded-lg border border-sky-300 transition shadow-2xs flex items-center space-x-1"
            >
              <span>{p.label}</span>
              <span className="text-[10px] text-sky-600 bg-sky-100 px-1 py-0.2 rounded font-mono">
                {p.jenis}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bagian 1: Identitas Satuan Pendidikan & Guru */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 transition hover:shadow-md">
        <div className="flex items-center space-x-2.5 pb-3 mb-5 border-b border-slate-100">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              1. Identitas Satuan Pendidikan & Guru
            </h2>
            <p className="text-xs text-slate-500">
              Data resmi SUPM Tegal dan pengampu mata pelajaran kejuruan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Nama Sekolah (Fixed) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Satuan Pendidikan
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={input.namaSekolah}
                className="w-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl px-3.5 py-2.5 cursor-not-allowed select-none"
              />
              <span className="absolute right-3 top-2.5 text-[10px] uppercase font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                Tetap
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Sekolah Usaha Perikanan Menengah Negeri Tegal
            </span>
          </div>

          {/* Jenjang (Fixed) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenjang Pendidikan
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={input.jenjang}
                className="w-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl px-3.5 py-2.5 cursor-not-allowed select-none"
              />
              <span className="absolute right-3 top-2.5 text-[10px] uppercase font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                SMK Vokasi
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Pendidikan Menengah Kejuruan Kelautan & Perikanan
            </span>
          </div>

          {/* Nama Guru */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Guru Pengampu
            </label>
            <div className="relative">
              <input
                type="text"
                value={input.namaGuru}
                onChange={(e) => handleTextChange('namaGuru', e.target.value)}
                placeholder="Contoh: Budi Santoso, S.St.Pi., M.Si."
                className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Akan dicantumkan pada naskah lembar pengesahan & kop asesmen
            </span>
          </div>

          {/* Mata Pelajaran */}
          <div id="field-mataPelajaran">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Mata Pelajaran Kejuruan *</span>
              {errors.mataPelajaran && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.mataPelajaran}
                </span>
              )}
            </label>
            <input
              type="text"
              value={input.mataPelajaran}
              onChange={(e) => handleTextChange('mataPelajaran', e.target.value)}
              placeholder="Contoh: Olah Gerak & Pengendalian Kapal Penangkap Ikan"
              className={`w-full bg-white border text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 transition ${
                errors.mataPelajaran
                  ? 'border-red-500 bg-red-50/30'
                  : 'border-slate-300 focus:border-blue-600'
              }`}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Sesuai kurikulum operasional satuan pendidikan SUPM Tegal
            </span>
          </div>

          {/* Tingkat / Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tingkat / Kelas *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['X', 'XI', 'XII'] as const).map((kelasOpt) => (
                <button
                  key={kelasOpt}
                  type="button"
                  onClick={() => handleTextChange('kelas', kelasOpt)}
                  className={`py-2 px-3 rounded-xl font-bold text-sm border transition text-center ${
                    input.kelas === kelasOpt
                      ? 'bg-blue-900 border-blue-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Kelas {kelasOpt}
                </button>
              ))}
            </div>
          </div>

          {/* Jurusan / Konsentrasi Keahlian */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Konsentrasi Keahlian / Jurusan *
            </label>
            <select
              value={input.jurusan}
              onChange={(e) => handleTextChange('jurusan', e.target.value as JurusanType)}
              className="w-full bg-white border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            >
              <option value="NKPI">NKPI - Nautika Kapal Penangkap Ikan</option>
              <option value="TKPI">TKPI - Teknika Kapal Penangkap Ikan</option>
              <option value="APPL">APPL - Agribisnis Perikanan Air Payau & Laut</option>
              <option value="APPHP">APPHP - Agribisnis Pengolahan Hasil Perikanan</option>
            </select>
            <div className="mt-1.5 text-[11px] text-sky-800 bg-sky-50/80 px-2.5 py-1 rounded-lg border border-sky-100 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span>{JURUSAN_DETAILS[input.jurusan].deskripsi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Logika Jenis Asesmen & Rancangan Materi */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 transition hover:shadow-md">
        <div className="flex items-center space-x-2.5 pb-3 mb-5 border-b border-slate-100">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              2. Rancangan Asesmen & Materi Pokok
            </h2>
            <p className="text-xs text-slate-500">
              Pilih tujuan asesmen dan rumuskan capaian pembelajaran kejuruan
            </p>
          </div>
        </div>

        {/* Jenis Asesmen Selector with Distinct Cards */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Jenis Asesmen Pembelajaran *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Diagnostik */}
            <div
              onClick={() => handleTextChange('jenisAsesmen', 'Diagnostik')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                input.jenisAsesmen === 'Diagnostik'
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Diagnostik
                </span>
                {input.jenisAsesmen === 'Diagnostik' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Mengidentifikasi pengetahuan awal, kesiapan belajar, prasyarat kompetensi, dan miskonsepsi untuk tindak lanjut pembelajaran (matrikulasi/diferensiasi).
              </p>
            </div>

            {/* Formatif */}
            <div
              onClick={() => handleTextChange('jenisAsesmen', 'Formatif')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                input.jenisAsesmen === 'Formatif'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Formatif
                </span>
                {input.jenisAsesmen === 'Formatif' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Memantau kemajuan proses belajar secara langsung, memberikan umpan balik korektif spesifik, dan memandu perbaikan teknik belajar siswa.
              </p>
            </div>

            {/* Sumatif */}
            <div
              onClick={() => handleTextChange('jenisAsesmen', 'Sumatif')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                input.jenisAsesmen === 'Sumatif'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Sumatif
                </span>
                {input.jenisAsesmen === 'Sumatif' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Mengukur ketercapaian akhir tujuan pembelajaran dengan kisi-kisi ketat, pedoman kunci baku, rumus konversi nilai rapor, dan standar KKM.
              </p>
            </div>
          </div>
        </div>

        {/* Materi / Topik */}
        <div className="mb-4" id="field-materiTopik">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Materi Pokok / Topik Pembelajaran *</span>
            {errors.materiTopik && (
              <span className="text-[11px] text-red-500 font-medium">
                {errors.materiTopik}
              </span>
            )}
          </label>
          <textarea
            rows={2}
            value={input.materiTopik}
            onChange={(e) => handleTextChange('materiTopik', e.target.value)}
            placeholder="Tuliskan materi inti, sub-materi teknis, atau ruang lingkup kompetensi maritim/perikanan..."
            className={`w-full bg-white border text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 transition ${
              errors.materiTopik
                ? 'border-red-500 bg-red-50/30'
                : 'border-slate-300 focus:border-blue-600'
            }`}
          />
        </div>

        {/* Tujuan Pembelajaran */}
        <div className="mb-4" id="field-tujuanPembelajaran">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Tujuan Pembelajaran (TP) *</span>
            {errors.tujuanPembelajaran && (
              <span className="text-[11px] text-red-500 font-medium">
                {errors.tujuanPembelajaran}
              </span>
            )}
          </label>
          <textarea
            rows={3}
            value={input.tujuanPembelajaran}
            onChange={(e) => handleTextChange('tujuanPembelajaran', e.target.value)}
            placeholder="Rumuskan tujuan pembelajaran yang jelas, terukur, dan memuat kata kerja operasional (KKO) kompetensi vokasi..."
            className={`w-full bg-white border text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 transition ${
              errors.tujuanPembelajaran
                ? 'border-red-500 bg-red-50/30'
                : 'border-slate-300 focus:border-blue-600'
            }`}
          />
        </div>

        {/* Capaian Pembelajaran atau Indikator Tambahan (Opsional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Capaian Pembelajaran (CP) / Indikator Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            value={input.capaianPembelajaran || ''}
            onChange={(e) => handleTextChange('capaianPembelajaran', e.target.value)}
            placeholder="Kutipan elemen capaian kurikulum merdeka SMK atau indikator spesifik yang ingin ditekankan..."
            className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* Bagian 3: Pengaturan Instrumen & Taksonomi SOLO */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 transition hover:shadow-md">
        <div className="flex items-center space-x-2.5 pb-3 mb-5 border-b border-slate-100">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              3. Pengaturan Instrumen & Taksonomi SOLO
            </h2>
            <p className="text-xs text-slate-500">
              Format instrumen, jumlah butir, dan kedalaman berpikir kognitif SOLO
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Bentuk Instrumen */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bentuk Instrumen Asesmen *
            </label>
            <select
              value={input.bentukInstrumen}
              onChange={(e) => handleTextChange('bentukInstrumen', e.target.value as InstrumentType)}
              className="w-full bg-white border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            >
              <option value="Pilihan Ganda">Pilihan Ganda (Wajib 5 Opsi A-E)</option>
              <option value="Esai/Uraian">Esai / Uraian Studi Kasus</option>
              <option value="Praktik/Unjuk Kerja">Praktik / Unjuk Kerja Bengkel / Lapangan</option>
              <option value="Observasi">Observasi / Lembar Pengamatan Sikap Kerja</option>
              <option value="Campuran">Campuran (Pilihan Ganda & Esai/Praktik)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              {input.bentukInstrumen === 'Pilihan Ganda' || input.bentukInstrumen === 'Campuran'
                ? 'Setiap butir pilihan ganda dijamin memiliki tepat 5 opsi: A, B, C, D, E.'
                : 'Dilengkapi skenario kerja kontekstual dan rubrik indikator unjuk kerja teramati.'}
            </span>
          </div>

          {/* Jumlah Soal / Tugas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Butir Soal / Tugas *
            </label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 20, 25, 30, 40].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleTextChange('jumlahSoal', num)}
                  className={`px-3 py-2 rounded-xl text-sm font-bold border transition ${
                    input.jumlahSoal === num
                      ? 'bg-blue-900 border-blue-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num} Butir
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              Jumlah kisi-kisi, naskah soal, dan kunci jawaban akan konsisten tepat {input.jumlahSoal} butir.
            </span>
          </div>
        </div>

        {/* Tingkat Kognitif Taksonomi SOLO */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Tingkat Kognitif (Taksonomi SOLO) *
            </label>
            <span className="text-[11px] text-blue-700 font-medium">
              Structure of Observed Learning Outcomes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {(
              [
                'Prastruktural',
                'Unistruktural',
                'Multistruktural',
                'Relasional',
                'Abstrak Diperluas',
                'Campuran/Proporsional',
              ] as SoloLevel[]
            ).map((level) => {
              const info = SOLO_TAXONOMY_INFO[level];
              const isSelected = input.tingkatKognitif === level;
              return (
                <div
                  key={level}
                  onClick={() => handleTextChange('tingkatKognitif', level)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                    isSelected
                      ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/30 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {info.label.split('(')[0].trim()}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {info.makna}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instruksi Tambahan (Opsional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Instruksi Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            value={input.instruksiTambahan || ''}
            onChange={(e) => handleTextChange('instruksiTambahan', e.target.value)}
            placeholder="Contoh: Tekankan studi kasus perairan Laut Jawa, sertakan standar keselamatan STCW-F, atau batasi waktu pengerjaan 90 menit..."
            className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* Notice & Submit Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0a2540] rounded-2xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300 flex items-start space-x-2">
          <Cpu className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
          <span>
            Data rancangan dikirim ke server backend dan diproses oleh Gemini API secara langsung untuk menghasilkan perangkat asesmen lengkap (kisi-kisi, naskah soal, kunci jawaban, dan rubrik).
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-md flex-shrink-0 ${
            isLoading
              ? 'bg-slate-700 text-slate-300 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              <span>Memproses Asesmen...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
              <span>Generate Asesmen</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
