import React from 'react';
import {
  Search,
  ShoppingCart,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Pill,
} from 'lucide-react';
import { soundManager } from '../utils/audio.ts';
import { SafetyAlert } from '../utils/safetyChecker.ts';

interface HeaderNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  safetyAlerts: SafetyAlert[];
  onOpenConsultation: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  safetyAlerts,
  onOpenConsultation,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between pointer-events-none">
      {/* Brand & Status Badge */}
      <div className="flex items-center gap-3 pointer-events-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3.5 py-2 shadow-lg backdrop-blur-none text-slate-100">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md">
          <Pill className="w-5 h-5 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-sm tracking-tight text-white">
              AuraPharm
            </h1>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full">
              SPATIAL 3D
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Browse aisle inventory & inspect clinical packaging
          </p>
        </div>
      </div>

      {/* Central Omnibar Search (Symptoms or Drugs) */}
      <div className="pointer-events-auto flex-1 max-w-md mx-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search medications or symptoms (e.g. headache, fever, allergy, heartburn)..."
            className="w-full bg-slate-900/95 border border-slate-700/80 rounded-xl pl-9.5 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 shadow-lg focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Safety Guide & Cart */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Pharmacist Consultation / Interaction Guide Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenConsultation();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white shadow-lg transition-colors"
          title="Pharmacy Consultation & Drug Safety Engine"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Safety Guide</span>
        </button>

        {/* Prescription Cart Pill */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenCart();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 text-white font-bold text-xs shadow-lg transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="font-mono">{cartCount}</span>
          {safetyAlerts.length > 0 && (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          )}
        </button>
      </div>
    </header>
  );
};
