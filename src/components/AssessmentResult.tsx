import React, { useState } from 'react';
import { AssessmentData } from '../types/assessment';
import { ExportPart, generateDocxBlob } from '../utils/docxExport';
import { generatePdfBlob } from '../utils/pdfExport';
import {
  FileText,
  Table as TableIcon,
  KeyRound,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  RefreshCw,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User,
  Calendar,
  School,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface AssessmentResultProps {
  data: AssessmentData;
  onRegenerate: () => void;
  isLoading: boolean;
  onOpenManualBackup: () => void;
}

export const AssessmentResult: React.FC<AssessmentResultProps> = ({
  data,
  onRegenerate,
  isLoading,
  onOpenManualBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'kisi' | 'soal' | 'kunci' | 'rubrik'>('kisi');
  const [copiedPart, setCopiedPart] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDropdown, setDownloadDropdown] = useState(false);

  const meta = data.metadata;

  const handleCopyText = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    setCopiedPart(label);
    setTimeout(() => setCopiedPart(null), 2500);
  };

  const handleDownload = async (format: 'docx' | 'pdf', part: ExportPart) => {
    try {
      setIsDownloading(true);
      setDownloadDropdown(false);

      const partNames: Record<ExportPart, string> = {
        all: 'Lengkap',
        kisi: 'KisiKisi',
        soal: 'NaskahSoal',
        kunci: 'KunciJawaban',
        rubrik: 'Rubrik',
      };

      const sanitizedMapel = meta.mataPelajaran.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
      const filename = `SUPM_TEGAL_${partNames[part]}_${meta.jurusan}_${sanitizedMapel}.${format}`;

      let blob: Blob;
      if (format === 'docx') {
        blob = await generateDocxBlob(data, part);
      } else {
        blob = generatePdfBlob(data, part);
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating document download:', err);
      alert('Terjadi kesalahan saat membuat dokumen unduhan. Silakan coba kembali.');
    } finally {
      setIsDownloading(false);
    }
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden mb-12">
      {/* Top Action & Quality Assurance Banner */}
      <div className="bg-[#0a2540] text-white p-5 border-b border-sky-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold bg-sky-500/25 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {meta.jenisAsesmen} • {meta.jurusan}
              </span>
              <span className="text-xs text-sky-200/80">
                {meta.tanggalDibuat}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              {meta.mataPelajaran} - Kelas {meta.kelas} SMK
            </h2>
            <p className="text-xs text-sky-100/75 mt-0.5">
              Guru Pengampu: <span className="font-semibold text-white">{meta.namaGuru || 'Guru Pengampu'}</span> • Bentuk: {meta.bentukInstrumen} • {meta.jumlahSoal} Butir
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Regenerate Button */}
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              type="button"
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-900/80 hover:bg-sky-800 text-sky-100 border border-sky-700 transition"
              title="Perbaiki atau buat variasi baru dengan kriteria yang sama"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Perbaiki / Generate Ulang
            </button>

            {/* Print Button */}
            <button
              onClick={printDocument}
              type="button"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition hidden sm:inline-flex"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Cetak
            </button>

            {/* Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDownloadDropdown(!downloadDropdown)}
                disabled={isDownloading}
                type="button"
                className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>{isDownloading ? 'Menyiapkan File...' : 'Unduh Dokumen'}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
              </button>

              {downloadDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2 text-slate-800 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Paket Lengkap Asesmen (Semua Bagian)
                  </div>
                  <button
                    onClick={() => handleDownload('docx', 'all')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between font-semibold text-slate-700"
                  >
                    <span>Unduh Paket Lengkap Word (.docx)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">DOCX</span>
                  </button>
                  <button
                    onClick={() => handleDownload('pdf', 'all')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between font-semibold text-slate-700"
                  >
                    <span>Unduh Paket Lengkap PDF (.pdf)</span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono">PDF</span>
                  </button>

                  <div className="px-3 py-1.5 mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-t border-slate-100">
                    File Terpisah (Sesuai Kebutuhan)
                  </div>
                  <button
                    onClick={() => handleDownload('docx', 'kisi')}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>1. Kisi-Kisi Soal Saja</span>
                    <span className="text-[10px] text-slate-400">DOCX</span>
                  </button>
                  <button
                    onClick={() => handleDownload('pdf', 'soal')}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between font-medium"
                  >
                    <span>2. Naskah Soal Siswa (Tanpa Kunci)</span>
                    <span className="text-[10px] text-red-600 font-mono">PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownload('docx', 'soal')}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>2. Naskah Soal Siswa (Tanpa Kunci)</span>
                    <span className="text-[10px] text-blue-600 font-mono">DOCX</span>
                  </button>
                  <button
                    onClick={() => handleDownload('docx', 'kunci')}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>3. Kunci Jawaban & Pembahasan</span>
                    <span className="text-[10px] text-blue-600 font-mono">DOCX</span>
                  </button>
                  <button
                    onClick={() => handleDownload('pdf', 'rubrik')}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>4. Rubrik Penilaian Saja</span>
                    <span className="text-[10px] text-red-600 font-mono">PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quality Assurance Badges */}
        <div className="mt-4 pt-3 border-t border-sky-900/60 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-300 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jumlah Butir Valid: {data.naskahSoal.butirSoal.length} Butir</span>
          </div>

          {meta.bentukInstrumen === 'Pilihan Ganda' && (
            <div className="flex items-center space-x-1.5 text-sky-300 bg-sky-950/50 px-2.5 py-1 rounded-lg border border-sky-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Opsi PG Tepat A-E Terpenuhi</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5 text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Kunci Jawaban Terpisah dari Naskah Siswa</span>
          </div>
        </div>
      </div>

      {/* 4 Tabs Navigation (A, B, C, D) */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6">
        <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('kisi')}
            className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'kisi'
                ? 'border-blue-700 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <TableIcon className="w-4 h-4 text-blue-600" />
            <span>A. Kisi-Kisi Soal</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
              {data.kisiKisi.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('soal')}
            className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'soal'
                ? 'border-blue-700 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>B. Naskah Soal Peserta Didik</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
              Siap Cetak
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kunci')}
            className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'kunci'
                ? 'border-blue-700 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>C. Kunci Jawaban Terpisah</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
              Pedoman Guru
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rubrik')}
            className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'rubrik'
                ? 'border-blue-700 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            <span>D. Rubrik & Penskoran</span>
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="p-5 sm:p-7">
        {/* TAB A: KISI-KISI SOAL */}
        {activeTab === 'kisi' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Tabel Matriks Kisi-Kisi Penulisan Soal
                </h3>
                <p className="text-xs text-slate-500">
                  Pemetaan keselarasan Tujuan Pembelajaran, Indikator Soal, Level Taksonomi SOLO, dan Bobot Skor
                </p>
              </div>
              <button
                onClick={() => handleDownload('docx', 'kisi')}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 self-start sm:self-auto transition"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Unduh Kisi-Kisi (.docx)
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#0a2540] text-white">
                  <tr>
                    <th className="p-3 font-bold text-center w-12 border-r border-sky-900">No</th>
                    <th className="p-3 font-bold w-1/4 border-r border-sky-900">Tujuan Pembelajaran</th>
                    <th className="p-3 font-bold w-1/5 border-r border-sky-900">Materi Pokok</th>
                    <th className="p-3 font-bold w-1/4 border-r border-sky-900">Indikator Soal / Kinerja</th>
                    <th className="p-3 font-bold text-center border-r border-sky-900">Level SOLO</th>
                    <th className="p-3 font-bold text-center w-16 border-r border-sky-900">No. Butir</th>
                    <th className="p-3 font-bold text-center w-14">Bobot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.kisiKisi.map((k, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 hover:bg-slate-100/60'}>
                      <td className="p-3 text-center font-bold text-slate-700 border-r border-slate-200">
                        {k.no}
                      </td>
                      <td className="p-3 text-slate-800 border-r border-slate-200 leading-relaxed">
                        {k.tujuanPembelajaran}
                      </td>
                      <td className="p-3 text-slate-700 border-r border-slate-200 font-medium">
                        {k.materi}
                      </td>
                      <td className="p-3 text-slate-800 border-r border-slate-200 leading-relaxed">
                        {k.indikatorSoal}
                      </td>
                      <td className="p-3 text-center border-r border-slate-200">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">
                          {k.levelSolo}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-blue-900 border-r border-slate-200">
                        {k.nomorButir}
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-700">
                        {k.bobotSkor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB B: NASKAH SOAL (LEMBAR SISWA - TANPA KUNCI) */}
        {activeTab === 'soal' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Naskah Instrumen Asesmen Siswa (Siap Uji & Cetak)
                </h3>
                <p className="text-xs text-slate-500">
                  Format resmi peserta didik. Kunci jawaban dan pedoman penilaian TIDAK ditampilkan di lembar ini.
                </p>
              </div>
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  onClick={() => handleDownload('pdf', 'soal')}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Unduh PDF Soal Siswa
                </button>
                <button
                  onClick={() => handleDownload('docx', 'soal')}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Unduh Word Soal Siswa
                </button>
              </div>
            </div>

            {/* Official Exam Sheet Preview Container */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-inner">
              {/* Kop Surat Resmi */}
              <div className="text-center border-b-2 border-slate-800 pb-3 mb-5">
                <div className="text-xs font-bold text-slate-800 tracking-wider">
                  KEMENTERIAN KELAUTAN DAN PERIKANAN
                </div>
                <div className="text-[11px] font-semibold text-slate-700">
                  BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN
                </div>
                <div className="text-sm sm:text-base font-extrabold text-blue-950 tracking-wide mt-0.5">
                  SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) NEGERI TEGAL
                </div>
                <div className="text-[10px] text-slate-500 italic mt-0.5">
                  Jl. Martoloyo PO BOX 22 Tegal 52121 - Jawa Tengah
                </div>
                <div className="mt-2 text-xs font-extrabold uppercase bg-slate-200/80 inline-block px-3 py-1 rounded">
                  LEMBAR ASESMEN {meta.jenisAsesmen.toUpperCase()} PESERTA DIDIK
                </div>
              </div>

              {/* Student Identity Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-xs mb-5">
                <div>
                  <div className="flex">
                    <span className="w-32 font-semibold text-slate-600">Nama Peserta Didik</span>
                    <span className="text-slate-400">: .................................................</span>
                  </div>
                  <div className="flex mt-1.5">
                    <span className="w-32 font-semibold text-slate-600">Nomor Induk Siswa</span>
                    <span className="text-slate-400">: .................................................</span>
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <span className="w-32 font-semibold text-slate-600">Kelas / Jurusan</span>
                    <span className="font-bold text-slate-800">: Kelas {meta.kelas} / {meta.jurusan}</span>
                  </div>
                  <div className="flex mt-1.5">
                    <span className="w-32 font-semibold text-slate-600">Mata Pelajaran</span>
                    <span className="font-semibold text-slate-800">: {meta.mataPelajaran}</span>
                  </div>
                </div>
              </div>

              {/* Petunjuk Pengerjaan */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs mb-6">
                <h4 className="font-bold text-slate-800 mb-1.5">Petunjuk Pengerjaan Asesmen:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  {data.naskahSoal.petunjukUmum.map((p, idx) => (
                    <li key={idx} className="leading-relaxed">{p}</li>
                  ))}
                </ol>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {data.naskahSoal.butirSoal.map((soal) => (
                  <div key={soal.nomor} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {soal.nomor}
                      </span>
                      <div className="flex-1">
                        {soal.konteksMaritim && (
                          <div className="mb-2 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded border border-sky-100 inline-block">
                            ⚓ Konteks Vokasi: {soal.konteksMaritim}
                          </div>
                        )}
                        <p className="text-sm text-slate-900 font-medium leading-relaxed whitespace-pre-line">
                          {soal.pertanyaan}
                        </p>

                        {/* Options A-E for Multiple Choice */}
                        {soal.opsi && soal.opsi.length > 0 && (
                          <div className="mt-3.5 space-y-2">
                            {soal.opsi.map((opt) => (
                              <div
                                key={opt.key}
                                className="flex items-start space-x-2.5 text-xs text-slate-800 p-2 rounded-lg hover:bg-slate-50 transition"
                              >
                                <span className="w-5 h-5 rounded border border-slate-300 font-bold text-slate-700 flex items-center justify-center flex-shrink-0 bg-slate-50">
                                  {opt.key}
                                </span>
                                <span className="pt-0.5 leading-relaxed">{opt.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Special prompt instructions if Essay / Practical */}
                        {soal.petunjukPengerjaan && (
                          <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900">
                            <span className="font-semibold">Petunjuk Khusus Tugas: </span>
                            {soal.petunjukPengerjaan}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB C: KUNCI JAWABAN TERPISAH (PEDOMAN GURU) */}
        {activeTab === 'kunci' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-800">
                    Kunci Jawaban, Pedoman Penskoran, dan Pembahasan Ilmiah
                  </h3>
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded uppercase">
                    Rahasia Guru
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Dokumen terpisah khusus guru pengampu sebagai acuan koreksi dan pemberian umpan balik
                </p>
              </div>
              <button
                onClick={() => handleDownload('docx', 'kunci')}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Unduh Kunci Jawaban (.docx)
              </button>
            </div>

            <div className="space-y-4">
              {data.kunciJawaban.map((item) => (
                <div
                  key={item.nomor}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      Butir Soal Nomor {item.nomor} ({item.bentuk})
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Skor Maksimal: {item.skorMaksimal}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="md:col-span-1 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                      <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                        Kunci Jawaban Benar
                      </span>
                      <span className="text-base font-extrabold text-emerald-700">
                        {item.kunci}
                      </span>
                    </div>

                    <div className="md:col-span-3 space-y-2.5">
                      <div>
                        <span className="font-bold text-slate-700 block mb-0.5">
                          Pembahasan Rasional & Konsep Kejuruan:
                        </span>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {item.pembahasan}
                        </p>
                      </div>

                      {item.kriteriaJawaban && item.kriteriaJawaban.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-700 block mb-1">
                            Indikator / Kata Kunci Unsur Jawaban yang Diharapkan:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                            {item.kriteriaJawaban.map((k, i) => (
                              <li key={i}>{k}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB D: RUBRIK & PEDOMAN PENSKORAN */}
        {activeTab === 'rubrik' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Rubrik Penilaian, Rumus Nilai, dan Tindak Lanjut
                </h3>
                <p className="text-xs text-slate-500">
                  Pedoman penskoran spesifik sesuai bentuk instrumen dan rekomendasi diferensiasi pembelajaran
                </p>
              </div>
              <button
                onClick={() => handleDownload('pdf', 'rubrik')}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Unduh Rubrik (.pdf)
              </button>
            </div>

            {/* Deskripsi Rubrik & Rumus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Karakteristik Rubrik:</span>
                <p className="text-slate-600 leading-relaxed">{data.rubrik.deskripsiRubrik}</p>
              </div>
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs">
                <span className="font-bold text-blue-900 block mb-1">Rumus Perhitungan Nilai Akhir:</span>
                <p className="text-sm font-bold text-blue-800 mt-0.5">{data.rubrik.rumusNilai}</p>
                <span className="text-[11px] text-blue-600 block mt-1">
                  Skor Maksimal Total: {data.rubrik.skorMaksimalTotal} Poin
                </span>
              </div>
            </div>

            {/* Tabel Kriteria Rubrik */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-[#0a2540] text-white px-4 py-2.5 text-xs font-bold">
                Kriteria Komponen Penilaian & Indikator Kinerja
              </div>
              <div className="divide-y divide-slate-200 text-xs">
                {data.rubrik.kriteria.map((crit, idx) => (
                  <div key={idx} className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 text-sm">{crit.komponen}</span>
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Maks {crit.skorMaks} Poin
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{crit.deskripsi}</p>

                    {crit.indikatorKinerja && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-2">
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5">
                          <span className="text-[10px] font-bold text-emerald-800 block uppercase">
                            Sangat Baik (90-100%)
                          </span>
                          <span className="text-[11px] text-emerald-900 mt-1 block">
                            {crit.indikatorKinerja.sangatBaik}
                          </span>
                        </div>
                        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5">
                          <span className="text-[10px] font-bold text-blue-800 block uppercase">
                            Baik (75-89%)
                          </span>
                          <span className="text-[11px] text-blue-900 mt-1 block">
                            {crit.indikatorKinerja.baik}
                          </span>
                        </div>
                        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5">
                          <span className="text-[10px] font-bold text-amber-800 block uppercase">
                            Cukup (60-74%)
                          </span>
                          <span className="text-[11px] text-amber-900 mt-1 block">
                            {crit.indikatorKinerja.cukup}
                          </span>
                        </div>
                        <div className="bg-red-50/70 border border-red-200 rounded-lg p-2.5">
                          <span className="text-[10px] font-bold text-red-800 block uppercase">
                            Kurang (&lt; 60%)
                          </span>
                          <span className="text-[11px] text-red-900 mt-1 block">
                            {crit.indikatorKinerja.kurang}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tindak Lanjut Pembelajaran Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700">
                Interpretasi Hasil & Tindak Lanjut Pembelajaran ({meta.jenisAsesmen})
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold w-1/4">Kategori Ketercapaian</th>
                    <th className="p-3 font-semibold w-1/6 text-center">Rentang Nilai</th>
                    <th className="p-3 font-semibold">Tindak Lanjut / Intervensi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.rubrik.interpretasiDanTindakLanjut.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{t.kategori}</td>
                      <td className="p-3 text-center font-semibold text-slate-600 bg-slate-50/50">
                        {t.rentangSkor}
                      </td>
                      <td className="p-3 text-slate-700 leading-relaxed">{t.tindakLanjut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lembar Pengesahan Resmi */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs">
              <div className="text-center font-bold text-slate-800 mb-6">
                LEMBAR VERIFIKASI & PENGESAHAN PERANGKAT ASESMEN
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                <div>
                  <p className="text-slate-600">Mengetahui,</p>
                  <p className="font-semibold text-slate-800">Ketua Program Keahlian {meta.jurusan}</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-slate-900">( .................................................... )</p>
                  <p className="text-slate-500">NIP. ................................................</p>
                </div>
                <div>
                  <p className="text-slate-600">Tegal, {meta.tanggalDibuat}</p>
                  <p className="font-semibold text-slate-800">Guru Pengampu Mata Pelajaran,</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-slate-900">( {meta.namaGuru || '....................................................'} )</p>
                  <p className="text-slate-500">NIP. ................................................</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
