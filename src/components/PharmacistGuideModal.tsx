import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Thermometer,
  Clock,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface PharmacistGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PharmacistGuideModal: React.FC<PharmacistGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Pharmacist Clinical Safety Guide</h3>
              <p className="text-[11px] text-slate-400">Essential rules for medication safety</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Rule 1: Duplicate Acetaminophen */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Watch for Acetaminophen in Multiple Products</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Acetaminophen (Tylenol) is often also present in cold/flu combination remedies (like DayQuil and NyQuil). Taking both at once can accidentally surpass the 4,000 mg safe daily maximum, leading to serious liver damage. AuraPharm automatically alerts you in your cart!
            </p>
          </div>

          {/* Rule 2: NSAID Bleeding Caution */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <HeartPulse className="w-4 h-4 shrink-0" />
              <span>Do Not Stack NSAIDs Together</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Ibuprofen (Advil), Naproxen (Aleve), and topical Diclofenac (Voltaren) are all NSAIDs. Combining them multiplies the risk of gastric bleeding and kidney strain rather than giving better pain relief.
            </p>
          </div>

          {/* Rule 3: Storage */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Thermometer className="w-4 h-4 shrink-0" />
              <span>Storage Temperature & Moisture</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Contrary to common habit, bathroom cabinets are typically too humid for pills. Keep medications sealed in their original tamper-evident containers between 20° to 25°C (68° to 77°F).
            </p>
          </div>

          {/* Rule 4: Rx Prescriptions */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Prescription (Rx) Dispensing Protocol</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Prescription items in Aisle 3 require a registered prescription or doctor refill confirmation before contactless smart locker pickup is released.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            Got it, Return to Store
          </button>
        </div>
      </div>
    </div>
  );
};
