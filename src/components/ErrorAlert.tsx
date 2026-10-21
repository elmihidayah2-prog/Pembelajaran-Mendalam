import React from 'react';
import { AlertTriangle, BookOpen, RefreshCw, XCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onOpenManualBackup: () => void;
  isLoading: boolean;
  onDismiss: () => void;
  hasPreviousData: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onOpenManualBackup,
  isLoading,
  onDismiss,
  hasPreviousData,
}) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 sm:p-5 shadow-xs mb-6 text-red-900 transition animate-in fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-red-800">
              Pemberitahuan Sistem Asesmen
            </h4>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              {message}
            </p>

            {hasPreviousData && (
              <p className="text-[11px] text-slate-500 mt-2 italic">
                * Hasil asesmen yang telah dihasilkan sebelumnya tetap aman dan tersimpan di layar.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
              <button
                type="button"
                onClick={onRetry}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                Coba Lagi (Retry)
              </button>

              <button
                type="button"
                onClick={onOpenManualBackup}
                className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-red-300 hover:bg-red-100/60 text-red-800 transition shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-red-600" />
                Gunakan Mode Manual Cadangan
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 p-1 rounded-lg transition"
          title="Tutup"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
