import React from 'react';
import { Anchor, ShieldCheck, Sparkles, BookOpen, FileCheck2 } from 'lucide-react';

interface HeaderProps {
  onOpenManualBackup: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenManualBackup, hasResult }) => {
  return (
    <header className="bg-gradient-to-r from-[#071c33] via-[#0a2540] to-[#0f345e] text-white shadow-xl border-b border-sky-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & School Identity */}
          <div className="flex items-start space-x-3.5">
            <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-[#0a2540] rounded-[10px] flex items-center justify-center text-sky-300">
                <Anchor className="w-7 h-7 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold tracking-widest uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                  Kementerian Kelautan & Perikanan
                </span>
                <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">
                  • SUPM NEGERI TEGAL
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1 flex items-center gap-2">
                SUPM TEGAL ASSESMEN MENDALAM
                <Sparkles className="w-5 h-5 text-amber-400 hidden sm:inline" />
              </h1>
              <p className="text-xs sm:text-sm text-sky-100/80 mt-0.5">
                Generator Perangkat Asesmen SMK (Diagnostik, Formatif, Sumatif) berbasis Taksonomi SOLO & Standar Kejuruan Maritim
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3 self-end md:self-auto">
            <button
              onClick={onOpenManualBackup}
              type="button"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-sky-950/70 border border-sky-700/60 text-sky-200 hover:bg-sky-900/80 hover:text-white transition shadow-sm"
              title="Salin atau unduh prompt lengkap jika ingin menggunakan AI secara mandiri"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              Mode Manual Cadangan
            </button>

            <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-1.5 rounded-lg text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Standar</span> Vokasi KKP
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
