import React, { useState } from 'react';
import {
  Bell,
  Play,
  Flame,
  Wind,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Plus,
  MessageCircle,
  Phone,
  Search,
  CheckCircle,
  ShieldCheck,
  Star,
  Clock,
  User,
} from 'lucide-react';
import { MEDICATIONS, Medication, MEDICATION_CATEGORIES } from '../data/medications.ts';
import { soundManager } from '../utils/audio.ts';

interface DispensaryHomeViewProps {
  onSelectMedication: (med: Medication) => void;
  onAddToCart: (med: Medication, qty: number) => void;
  onOpenConsultation: () => void;
  onNavigateToRoutine: () => void;
  onNavigateToDiagnostics: () => void;
}

export const DispensaryHomeView: React.FC<DispensaryHomeViewProps> = ({
  onSelectMedication,
  onAddToCart,
  onOpenConsultation,
  onNavigateToRoutine,
  onNavigateToDiagnostics,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [callingDoctor, setCallingDoctor] = useState(false);

  const categories = [
    { id: 'all', label: 'All Meds', bg: 'bg-slate-100', text: 'text-slate-800', icon: Star },
    { id: 'pain-relief', label: 'Pain & Fever', bg: 'bg-[#FDF0EB]', text: 'text-[#E05A32]', icon: Flame },
    { id: 'cold-respiratory', label: 'Cold & Allergy', bg: 'bg-[#E3F2FD]', text: 'text-[#1E88E5]', icon: Wind },
    { id: 'digestive-wellness', label: 'Digestive', bg: 'bg-[#E8F8EE]', text: 'text-[#2E7D32]', icon: HeartPulse },
    { id: 'vitamins-supplements', label: 'Vitamins', bg: 'bg-[#FFF8DE]', text: 'text-[#F57F17]', icon: Sparkles },
    { id: 'prescription-cardio', label: 'Heart & Rx', bg: 'bg-[#F0EBFF]', text: 'text-[#6A1B9A]', icon: Stethoscope },
  ];

  const filteredMeds = MEDICATIONS.filter((m) => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQ = !q || m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.indications.some(i => i.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  const handleCallDoctor = () => {
    soundManager.playClick();
    setCallingDoctor(true);
    setTimeout(() => {
      setCallingDoctor(false);
      onOpenConsultation();
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-800 pb-20">
      {/* 1. Header with Avatar & Notification */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
            <img
              src="/src/assets/images/pharmacist_robert_fox_1792991349967.jpg"
              alt="Sophia User Avatar"
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Good morning</span>
            <h2 className="text-base font-extrabold text-slate-900 leading-none">
              Hello, Jacob!
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenConsultation();
          }}
          className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          title="Notifications & Consultation"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Tracking your care
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Order prescribed medications and monitor daily intake
        </p>
      </div>

      {/* 3. Featured Hero Sky-Blue Banner (Exact match to reference top hero card) */}
      <div className="relative overflow-hidden bg-[#D8EDF8] rounded-[28px] p-5 shadow-xs flex items-center justify-between min-h-[160px]">
        {/* Left copy */}
        <div className="z-10 max-w-[58%] flex flex-col justify-between h-full space-y-3">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#4A90E2]/20 text-[#1A5FB4] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
              Prescription Care
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#0B3A60] leading-snug">
              Refill With Pro Pharmacist
            </h3>
            <p className="text-[11px] text-[#2C628D] mt-1 font-medium leading-tight">
              Verified contactless dispensing in 15 mins
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenConsultation();
            }}
            className="inline-flex items-center gap-2 bg-white text-[#0B3A60] hover:bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all w-fit"
          >
            <span>Order Refill</span>
            <div className="w-4 h-4 rounded-full bg-[#0B3A60] text-white flex items-center justify-center text-[8px]">
              ▶
            </div>
          </button>
        </div>

        {/* Right illustration photo */}
        <div className="absolute right-0 bottom-0 top-0 w-[42%] flex items-end justify-end pointer-events-none">
          <img
            src="/src/assets/images/hero_pharmacy_care_1792991349079.jpg"
            alt="Clinical Pharmacist"
            className="h-full w-full object-cover object-left-top rounded-r-[28px]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 4. Category Selector (Horizontal pastel circular buttons) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-800">
            Select medication type
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[11px] text-blue-600 font-semibold hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`flex flex-col items-center gap-1.5 shrink-0 transition-transform active:scale-95 ${
                  isSelected ? 'scale-105' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${
                    isSelected
                      ? 'border-slate-900 bg-white shadow-md'
                      : 'border-transparent ' + cat.bg
                  }`}
                >
                  <Icon className={`w-5 h-5 ${cat.text}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-700 max-w-[62px] text-center truncate">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Routine & Vitals Stat Cards (3 rounded cards like in the reference) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800">Daily routine stats</span>
          <button
            onClick={onNavigateToRoutine}
            className="text-[11px] text-blue-600 font-semibold hover:underline"
          >
            View schedule →
          </button>
        </div>

        <div className="space-y-2">
          <div
            onClick={onNavigateToRoutine}
            className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-xs border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-xl bg-[#E8F8EE] text-[#1E7E34] text-xs font-extrabold flex items-center gap-1">
                ⭐ 100%
              </span>
              <span className="text-xs font-bold text-slate-800">Monthly Adherence Goal</span>
            </div>
            <span className="text-[11px] text-slate-400">Time in General</span>
          </div>

          <div
            onClick={onNavigateToRoutine}
            className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-xs border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-xl bg-[#E3F2FD] text-[#0D47A1] text-xs font-extrabold flex items-center gap-1">
                🕒 28m 45s
              </span>
              <span className="text-xs font-bold text-slate-800">Next Dose: Lipitor 20mg</span>
            </div>
            <span className="text-[11px] text-slate-400">Today's routine</span>
          </div>

          <div
            onClick={onNavigateToDiagnostics}
            className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-xs border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-xl bg-[#FDF0EB] text-[#BF360C] text-xs font-extrabold flex items-center gap-1">
                🩺 123 / 80
              </span>
              <span className="text-xs font-bold text-slate-800">Blood Pressure Stable</span>
            </div>
            <span className="text-[11px] text-slate-400">Heart Health</span>
          </div>
        </div>
      </div>

      {/* 6. Medication Inventory Grid (Clean rounded cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800">
            Available Inventory ({filteredMeds.length})
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Tap card for drug facts
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredMeds.map((med) => (
            <div
              key={med.id}
              onClick={() => {
                soundManager.playClick();
                onSelectMedication(med);
              }}
              className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: med.packageStyle.accentGlow || '#10b981' }}
                  />
                  {med.requiresPrescription ? (
                    <span className="text-[9px] font-black uppercase text-rose-500 bg-rose-50 px-1.5 py-0.2 rounded-md">
                      Rx
                    </span>
                  ) : (
                    <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                      OTC
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 leading-snug line-clamp-2">
                  {med.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {med.genericName}
                </p>

                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  {med.strength} • {med.dosageForm.split(' ')[0]}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                <span className="text-sm font-black text-slate-900 font-mono">
                  ${med.price.toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playCartAdd();
                    onAddToCart(med, 1);
                  }}
                  className="w-7 h-7 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                  title="Quick add to bag"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Doctor / Pharmacist Consultation Card (Matches the bottom row doctor card in reference) */}
      <div className="bg-[#FFF9E6] border border-[#FFE7A3] rounded-[24px] p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-amber-200 shrink-0">
            <img
              src="/src/assets/images/pharmacist_robert_fox_1792991349967.jpg"
              alt="Dr. Robert Fox"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">Robert Fox</h4>
            <span className="text-[11px] text-amber-800 font-medium block">
              Lead Clinical Pharmacist
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              Available for quick chat
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenConsultation();
            }}
            className="w-9 h-9 rounded-xl bg-white text-slate-700 hover:text-slate-900 shadow-xs border border-amber-200 flex items-center justify-center transition-transform active:scale-95"
            title="Chat with pharmacist"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={handleCallDoctor}
            className={`w-9 h-9 rounded-xl shadow-xs flex items-center justify-center transition-all active:scale-95 ${
              callingDoctor
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-amber-200'
            }`}
            title="Call pharmacist"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
