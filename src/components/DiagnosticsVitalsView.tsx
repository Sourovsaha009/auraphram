import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  MoreHorizontal,
  Activity,
  Heart,
  Info,
  Stethoscope,
  Waves,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface DiagnosticsVitalsViewProps {
  onBack: () => void;
  onOpenConsultation: () => void;
}

export const DiagnosticsVitalsView: React.FC<DiagnosticsVitalsViewProps> = ({
  onBack,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'vitals'>('diagnostics');
  const [bpm, setBpm] = useState(82);

  return (
    <div className="flex flex-col gap-4 text-slate-800 pb-20">
      {/* 1. Top App Bar with back, bookmark and share icons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
          Clinical Diagnostics
        </h3>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => soundManager.playClick()}
            className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => soundManager.playClick()}
            className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Heart & Vitals
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Continuous biometric telemetry synced with medication logs
        </p>
      </div>

      {/* 3. Hero Anatomical Heart Diagnostic Card (Exact match to reference bottom-middle card!) */}
      <div className="bg-[#EAF6EE] rounded-[28px] p-4 border border-[#DCF1E2] shadow-xs flex items-center justify-between min-h-[160px] relative overflow-hidden">
        <div className="z-10 max-w-[55%] space-y-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-xs">
            <Heart className="w-4 h-4 fill-rose-500" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#144726]">Health State</h3>
            <p className="text-[11px] text-[#2D6B42] mt-0.5">
              Last diagnosis of heart 3 days ago
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setBpm(Math.floor(78 + Math.random() * 8));
            }}
            className="px-3.5 py-1.5 bg-white text-[#144726] hover:bg-slate-50 text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            Diagnostic Scan
          </button>
        </div>

        {/* Right side anatomical white ceramic heart image */}
        <div className="w-[45%] h-full flex items-center justify-center pointer-events-none">
          <img
            src="/src/assets/images/anatomical_clean_heart_1792991349083.jpg"
            alt="Anatomical Heart Diagnostic"
            className="w-28 h-28 object-cover rounded-2xl drop-shadow-sm"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 4. Two Biometric Metric Cards (Blood pressure & Heart rhythm) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Heart Pressure</span>
            <span className="text-lg font-black text-slate-900 font-mono">
              123 <span className="text-xs font-normal text-slate-400">/ 80</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Heart Rhythm</span>
            <span className="text-lg font-black text-slate-900 font-mono">
              67 <span className="text-xs font-normal text-slate-400">/ min</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Sky-Blue "Hearbeat" Live ECG Card (Exact match to reference bottom-right Screen 3) */}
      <div className="bg-[#DDF0FA] rounded-[28px] p-4 border border-[#CCE6F5] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white text-[#1976D2] flex items-center justify-center shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-[#0D47A1]">Hearbeat Rhythm</h4>
          </div>
          <button className="text-slate-500 hover:text-slate-800">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#0D47A1] font-mono tracking-tight">
            {bpm}
          </span>
          <span className="text-xs font-bold text-[#1976D2]">bpm</span>
        </div>

        {/* Live ECG waveform SVG with 80 bpm guideline */}
        <div className="relative pt-1 pb-1">
          {/* Target guideline badge */}
          <div className="absolute right-12 top-0 bg-white/90 text-[#0D47A1] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            80 bpm target
          </div>

          <svg className="w-full h-14" viewBox="0 0 320 60" fill="none">
            {/* Horizontal baseline */}
            <line x1="0" y1="35" x2="320" y2="35" stroke="#B8DFF5" strokeWidth="1.5" />
            {/* Target 80 bpm vertical guide */}
            <line x1="240" y1="5" x2="240" y2="55" stroke="#90CAF9" strokeWidth="1" strokeDasharray="3 3" />

            {/* ECG Pulse path */}
            <path
              d="M 0 35 L 50 35 L 60 30 L 70 35 L 80 35 L 85 10 L 92 50 L 98 35 L 120 35 L 130 35 L 140 32 L 150 35 L 180 35 L 185 12 L 192 48 L 198 35 L 230 35 L 240 35 L 245 10 L 252 50 L 258 35 L 320 35"
              stroke="#0D47A1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 6. Pale Mint "851 ms R-R interval" Card (Exact match to reference bottom-right Screen 3) */}
      <div className="bg-[#E4F6EB] rounded-[24px] p-3.5 border border-[#CEEFDA] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white text-[#2E7D32] flex items-center justify-center shadow-xs">
              <Waves className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-sm font-black text-[#1B5E20] font-mono">851 ms</span>
              <span className="text-[10px] text-[#2E7D32] block font-medium">R-R interval</span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-800">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline ticks */}
        <div className="flex justify-between items-center text-[10px] font-mono text-[#2E7D32] pt-1 border-t border-[#CEEFDA]">
          <span className="bg-white/80 px-2 py-0.5 rounded-md font-bold">851 ms</span>
          <span>841 ms</span>
          <span>871 ms</span>
          <span>881 ms</span>
        </div>
      </div>

      {/* 7. Stress & Recovery Results Card (Exact match to circular chart in reference bottom Screen 3) */}
      <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900">Physiological Results</h4>
          <Info className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-4">
          {/* Concentric rings SVG */}
          <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
              {/* Outer yellow ring: Stress */}
              <circle cx="30" cy="30" r="24" fill="none" stroke="#FEF3C7" strokeWidth="5" />
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="5"
                strokeDasharray="150"
                strokeDashoffset="105"
                strokeLinecap="round"
              />

              {/* Inner blue ring: Recovery */}
              <circle cx="30" cy="30" r="16" fill="none" stroke="#DBEAFE" strokeWidth="5" />
              <circle
                cx="30"
                cy="30"
                r="16"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="5"
                strokeDasharray="100"
                strokeDashoffset="30"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-900 leading-snug">
              You are calm and ready!
            </h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Blood pressure and HRV within optimal therapeutic ranges.
            </p>

            <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Stress 28%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Recovery 74%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Pharmacist Consult button */}
      <button
        onClick={() => {
          soundManager.playClick();
          onOpenConsultation();
        }}
        className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Share Vitals Log With Pharmacist</span>
      </button>
    </div>
  );
};
