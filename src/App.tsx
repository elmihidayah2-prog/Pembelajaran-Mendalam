import React, { useState, useEffect } from 'react';
import { AssessmentData, AssessmentFormInput } from './types/assessment';
import { Header } from './components/Header';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentResult } from './components/AssessmentResult';
import { ManualBackupModal } from './components/ManualBackupModal';
import { ErrorAlert } from './components/ErrorAlert';
import {
  Anchor,
  Compass,
  FileCheck2,
  Sparkles,
  Info,
  CheckCircle2,
  GraduationCap,
  Waves,
} from 'lucide-react';

export default function App() {
  const [input, setInput] = useState<AssessmentFormInput>({
    namaSekolah: 'SUPM TEGAL',
    namaGuru: '',
    mataPelajaran: 'Navigasi Radar dan Alat Elektronik Kapal',
    jenjang: 'SMK',
    kelas: 'XI',
    jurusan: 'NKPI',
    jenisAsesmen: 'Sumatif',
    materiTopik: 'Prinsip kerja Radar Kapal, interpretasi tampilan PPI, dan perhitungan CPA/TCPA untuk pencegahan bahaya tubrukan di laut',
    tujuanPembelajaran: 'Peserta didik mampu mengoperasikan radar navigasi kapal penangkap ikan, mengidentifikasi target objek di laut, dan menghitung CPA/TCPA untuk pencegahan bahaya tubrukan di laut sesuai aturan COLREG 1972.',
    capaianPembelajaran: 'Elemen: Sistem Navigasi Kapal Penangkap Ikan - Mampu mengidentifikasi bahaya navigasi dan mengaplikasikan peralatan elektronika pelayaran secara akurat.',
    bentukInstrumen: 'Pilihan Ganda',
    jumlahSoal: 10,
    tingkatKognitif: 'Relasional',
    instruksiTambahan: 'Kaitkan dengan situasi pelayaran di perairan Laut Jawa dan Selat Sunda.',
  });

  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isManualBackupOpen, setIsManualBackupOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<{ checked: boolean; hasApiKey: boolean }>({
    checked: false,
    hasApiKey: true,
  });

  // Check server health on load
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus({
          checked: true,
          hasApiKey: data.hasApiKey ?? true,
        });
      })
      .catch((err) => {
        console.warn('Server status check error:', err);
        setServerStatus({ checked: true, hasApiKey: true });
      });
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menghasilkan perangkat asesmen.');
      }

      setAssessmentData(result.data);

      // Smooth scroll to results
      setTimeout(() => {
        const resultSection = document.getElementById('assessment-result-section');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error generating assessment:', err);
      setErrorMessage(
        err.message || 'Terjadi gangguan komunikasi dengan server Gemini AI. Silakan coba kembali atau gunakan Mode Manual Cadangan.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        onOpenManualBackup={() => setIsManualBackupOpen(true)}
        hasResult={Boolean(assessmentData)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Banner Informational Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-sky-100 text-sky-800 rounded-xl flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Perancangan Asesmen Vokasi Kemaritiman
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                  SOLO Taxonomy
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Menyusun kisi-kisi matrikulatif, naskah butir soal (PG 5 opsi A-E / Esai / Praktik), kunci jawaban terpisah, serta rubrik deskriptor berstandar SMK SUPM Tegal.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 self-end md:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Waves className="w-4 h-4 text-sky-600" />
            <span>Jurusan: <strong>NKPI • TKPI • APPL • APHP</strong></span>
          </div>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <ErrorAlert
            message={errorMessage}
            onRetry={handleGenerate}
            onOpenManualBackup={() => setIsManualBackupOpen(true)}
            isLoading={isLoading}
            onDismiss={() => setErrorMessage(null)}
            hasPreviousData={Boolean(assessmentData)}
          />
        )}

        {/* Assessment Form */}
        <div className="mb-8">
          <AssessmentForm
            input={input}
            onChange={setInput}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Assessment Result (if available) */}
        {assessmentData && (
          <div id="assessment-result-section" className="pt-2">
            <AssessmentResult
              data={assessmentData}
              onRegenerate={handleGenerate}
              isLoading={isLoading}
              onOpenManualBackup={() => setIsManualBackupOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Manual Backup Modal */}
      <ManualBackupModal
        isOpen={isManualBackupOpen}
        onClose={() => setIsManualBackupOpen(false)}
        input={input}
      />

      {/* Footer */}
      <footer className="bg-[#071c33] text-slate-400 text-xs py-7 border-t border-sky-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <Anchor className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">
              SUPM NEGERI TEGAL • KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Sistem Generator Perangkat Asesmen Vokasi • Taksonomi SOLO
          </div>
        </div>
      </footer>
    </div>
  );
}
