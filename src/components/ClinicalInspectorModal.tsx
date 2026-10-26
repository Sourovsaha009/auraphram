import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Pill,
  Clock,
  Thermometer,
} from 'lucide-react';
import { Medication } from '../data/medications.ts';
import { soundManager } from '../utils/audio.ts';

interface ClinicalInspectorModalProps {
  medication: Medication | null;
  onClose: () => void;
  onAddToCart: (med: Medication, qty: number) => void;
  cartItems: { med: Medication; quantity: number }[];
}

export const ClinicalInspectorModal: React.FC<ClinicalInspectorModalProps> = ({
  medication,
  onClose,
  onAddToCart,
  cartItems,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!medication) return null;

  // Check potential conflict with cart items
  const conflicts: string[] = [];
  cartItems.forEach((c) => {
    const isConflict = medication.drugInteractions.some(
      (di) => c.med.genericName.toLowerCase().includes(di.toLowerCase()) ||
              c.med.name.toLowerCase().includes(di.toLowerCase())
    );
    if (isConflict) conflicts.push(c.med.name);

    // Duplicate acetaminophen check
    const thisHasAPAP = medication.genericName.toLowerCase().includes('acetaminophen') ||
      medication.activeIngredients.some(ai => ai.name.toLowerCase().includes('acetaminophen'));
    const cartHasAPAP = c.med.genericName.toLowerCase().includes('acetaminophen') ||
      c.med.activeIngredients.some(ai => ai.name.toLowerCase().includes('acetaminophen'));
    if (thisHasAPAP && cartHasAPAP && c.med.id !== medication.id) {
      if (!conflicts.includes(c.med.name)) {
        conflicts.push(`${c.med.name} (Duplicate Acetaminophen)`);
      }
    }
  });

  const handleAdd = () => {
    soundManager.playCartAdd();
    onAddToCart(medication, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-hidden text-slate-800 animate-in slide-in-from-bottom duration-250">
        {/* Grab bar affordance for mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* Header bar */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {medication.categoryLabel}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 leading-snug">
              {medication.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Generic: {medication.genericName}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Clinical Details */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Key Specs Bento */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#F8F9FB] p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Price</span>
              <span className="text-lg font-black text-slate-900">
                ${medication.price.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#EBF7FF] p-3 rounded-2xl border border-blue-50">
              <span className="text-[10px] text-blue-500 font-semibold uppercase block">Strength</span>
              <span className="text-xs font-bold text-blue-900 truncate block mt-1">
                {medication.strength}
              </span>
            </div>
            <div className="bg-[#EEF9F1] p-3 rounded-2xl border border-emerald-50">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase block">Quantity</span>
              <span className="text-xs font-bold text-emerald-950 truncate block mt-1">
                {medication.dosageForm}
              </span>
            </div>
          </div>

          {/* Safety alert if conflicts with cart */}
          {conflicts.length > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Drug Interaction Precaution</strong>
                <span>May interact with {conflicts.join(', ')} already in your bag. Review with your pharmacist.</span>
              </div>
            </div>
          )}

          {/* Indications */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Symptoms & Relief
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {medication.indications.map((ind, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-medium"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Directions */}
          <div className="bg-[#F7F9FB] p-3.5 rounded-2xl border border-slate-100 text-xs">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Dosage & Directions
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {medication.directions}
            </p>
          </div>

          {/* Active Ingredients */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-purple-500" />
              Active Ingredients
            </h4>
            <div className="space-y-1.5">
              {medication.activeIngredients.map((ai, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{ai.name}</span>
                    <span className="text-[11px] text-slate-400 block">{ai.purpose}</span>
                  </div>
                  <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {ai.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Storage & NDC */}
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>NDC: {medication.ndcCode}</span>
            <span>Room Temp 20-25°C</span>
          </div>
        </div>

        {/* Footer with quantity and Add button */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`flex-1 h-12 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Add ${(medication.price * quantity).toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
