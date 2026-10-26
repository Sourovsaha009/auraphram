import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Medication } from '../data/medications.ts';
import { soundManager } from '../utils/audio.ts';
import { SafetyAlert } from '../utils/safetyChecker.ts';

interface MedicationInspectorModalProps {
  medication: Medication;
  onClose: () => void;
  onAddToCart: (med: Medication, quantity: number) => void;
  cartItems: { med: Medication; quantity: number }[];
  isPillExploded: boolean;
  onTogglePillExplode: () => void;
}

export const MedicationInspectorModal: React.FC<MedicationInspectorModalProps> = ({
  medication,
  onClose,
  onAddToCart,
  cartItems,
  isPillExploded,
  onTogglePillExplode,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'warnings'>('overview');

  // Check if adding this medicine causes a conflict with items already in the cart
  const potentialConflicts: string[] = [];
  cartItems.forEach((item) => {
    // Check if generic names conflict
    const conflicts = medication.drugInteractions.some(
      (di) => item.med.genericName.toLowerCase().includes(di.toLowerCase()) ||
              item.med.name.toLowerCase().includes(di.toLowerCase())
    );
    if (conflicts) {
      potentialConflicts.push(item.med.name);
    }

    // Check duplicate acetaminophen
    const isThisAcetaminophen = medication.genericName.toLowerCase().includes('acetaminophen') ||
      medication.activeIngredients.some(ai => ai.name.toLowerCase().includes('acetaminophen'));
    const isCartAcetaminophen = item.med.genericName.toLowerCase().includes('acetaminophen') ||
      item.med.activeIngredients.some(ai => ai.name.toLowerCase().includes('acetaminophen'));

    if (isThisAcetaminophen && isCartAcetaminophen && item.med.id !== medication.id) {
      if (!potentialConflicts.includes(item.med.name)) {
        potentialConflicts.push(`${item.med.name} (Duplicate Acetaminophen)`);
      }
    }
  });

  const handleAdd = () => {
    soundManager.playCartAdd();
    onAddToCart(medication, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-slate-900/95 border-l border-slate-700/80 shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: medication.packageStyle.accentGlow || '#10b981' }}
          />
          <span className="text-xs font-mono uppercase text-slate-400">
            {medication.categoryLabel}
          </span>
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

      {/* 3D Inspection Mode Ribbon & Pill Pop-out Toggle */}
      <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Spatial Inspection Active</span>
        </span>

        <button
          onClick={() => {
            soundManager.playClick();
            onTogglePillExplode();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            isPillExploded
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle 3D internal capsule/pill view in the 3D viewport"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isPillExploded ? 'Hide 3D Capsule' : 'Reveal 3D Capsule'}</span>
        </button>
      </div>

      {/* Main Body Details */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Title, Brand & Badges */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
              {medication.brand}
            </span>
            {medication.requiresPrescription ? (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Rx Prescription Required
              </span>
            ) : (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                OTC Authorized
              </span>
            )}
            {medication.badge && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {medication.badge}
              </span>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-white leading-snug">
            {medication.name}
          </h2>
          <p className="text-sm text-slate-400 italic">
            Active: {medication.genericName}
          </p>
        </div>

        {/* Price & Strength Matrix */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Price</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ${medication.price.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Strength</span>
            <span className="text-sm font-bold text-slate-200 block truncate">
              {medication.strength}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Quantity</span>
            <span className="text-xs font-semibold text-slate-300 block truncate">
              {medication.dosageForm}
            </span>
          </div>
        </div>

        {/* Safety Alert Warning if conflicts with cart */}
        {potentialConflicts.length > 0 && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex gap-2.5 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">Potential Drug Interaction Alert</p>
              <p className="text-slate-300 mt-0.5">
                May interact with {potentialConflicts.join(', ')} already in your dispensary cart. Please review warnings or ask your pharmacist.
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Directions
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              activeTab === 'ingredients'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Ingredients
          </button>
          <button
            onClick={() => setActiveTab('warnings')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              activeTab === 'warnings'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Clinical Warnings
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Symptoms & Indications Relieved:
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {medication.indications.map((ind, i) => (
                  <span
                    key={i}
                    className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                Directions & Clinical Dosage:
              </h4>
              <p className="text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                {medication.directions}
              </p>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/30 p-2 rounded-lg">
              <p>
                <strong className="text-slate-300 font-mono">NDC:</strong> {medication.ndcCode}
              </p>
              <p>
                <strong className="text-slate-300">Storage:</strong> {medication.storage}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Active Ingredients */}
        {activeTab === 'ingredients' && (
          <div className="space-y-2 text-xs">
            {medication.activeIngredients.map((ing, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-start"
              >
                <div>
                  <span className="font-bold text-emerald-400 block">{ing.name}</span>
                  <span className="text-[11px] text-slate-400">{ing.purpose}</span>
                </div>
                <span className="font-mono font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  {ing.amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Warnings */}
        {activeTab === 'warnings' && (
          <div className="space-y-2 text-xs">
            {medication.warnings.map((warn, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-slate-200 flex gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}

            {medication.drugInteractions.length > 0 && (
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <span className="font-bold text-slate-200 block mb-1">
                  Known Drug-Drug Interactions:
                </span>
                <p className="text-[11px] text-slate-400">
                  Avoid or monitor closely with:{' '}
                  <span className="text-amber-300 font-semibold">
                    {medication.drugInteractions.join(', ')}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Quantity & Add to Cart */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Quantity:</span>
            <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Subtotal</span>
            <span className="text-lg font-bold text-emerald-400">
              ${(medication.price * quantity).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
            addedSuccess
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {addedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Added to Prescription Cart!</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>
                {medication.requiresPrescription
                  ? 'Request Prescription Dispense'
                  : 'Add to Cart'}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
