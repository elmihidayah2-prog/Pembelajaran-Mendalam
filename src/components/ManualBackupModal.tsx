import React, { useState } from 'react';
import { AssessmentFormInput } from '../types/assessment';
import { buildAssessmentPrompt } from '../utils/promptBuilder';
import {
  X,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCode2,
  ExternalLink,
  Info,
} from 'lucide-react';

interface ManualBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: AssessmentFormInput;
}

export const ManualBackupModal: React.FC<ManualBackupModalProps> = ({
  isOpen,
  onClose,
  input,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedPrompt = buildAssessmentPrompt(input);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SUPM_TEGAL_Prompt_Cadangan_${input.jurusan}_${input.kelas}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0a2540] text-white p-5 flex items-center justify-between border-b border-sky-900">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-500/20 rounded-lg text-sky-300">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Mode Manual Cadangan (Prompt Generator)
              </h3>
              <p className="text-xs text-sky-200/80">
                Gunakan saat kuota API habis, offline, atau untuk digunakan pada Gemini / ChatGPT web secara manual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Info */}
        <div className="p-5 bg-amber-50/70 border-b border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="leading-relaxed">
            <strong className="font-bold">Perhatian Guru: </strong>
            Mode manual ini menghasilkan teks instruksi (prompt kurikulum vokasi) lengkap berdasarkan formulir yang telah Anda isi. Salin atau unduh teks ini, lalu tempelkan (paste) ke Gemini atau ChatGPT secara mandiri untuk mendapatkan hasil asesmen. Mode ini tidak membuat soal secara otomatis di dalam aplikasi.
          </div>
        </div>

        {/* Prompt Preview */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Isi Prompt Instruksi Kurikulum:
            </span>
            <span className="text-[11px] text-slate-400">
              Format UTF-8 Text ({generatedPrompt.length} karakter)
            </span>
          </div>

          <div className="relative">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
              {generatedPrompt}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Dapat ditempel langsung di{' '}
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-semibold underline inline-flex items-center"
            >
              gemini.google.com <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadTxt}
              type="button"
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Unduh Prompt (.txt)
            </button>

            <button
              onClick={handleCopy}
              type="button"
              className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl transition shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Berhasil Disalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Salin Prompt Cadangan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
