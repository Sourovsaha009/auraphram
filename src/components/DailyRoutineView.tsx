import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Flame,
  Droplets,
  Calendar,
  AlertCircle,
  Check,
} from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface DailyRoutineViewProps {
  onBack: () => void;
}

export const DailyRoutineView: React.FC<DailyRoutineViewProps> = ({ onBack }) => {
  const [doses, setDoses] = useState([
    {
      id: 'dose-1',
      time: '08:00 AM',
      name: 'Lipitor (Atorvastatin)',
      strength: '20 mg',
      instruction: '1 tablet with morning breakfast',
      taken: true,
      category: 'Heart & Cholesterol',
      badgeColor: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'dose-2',
      time: '01:30 PM',
      name: 'Nature Made Vitamin D3',
      strength: '2000 IU',
      instruction: '1 softgel with lunch meal',
      taken: true,
      category: 'Immunity & Bone Care',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'dose-3',
      time: '08:30 PM',
      name: 'Omeprazole 24HR Acid Reducer',
      strength: '20 mg',
      instruction: '1 capsule 30 mins before dinner',
      taken: false,
      category: 'Digestive Comfort',
      badgeColor: 'bg-purple-50 text-purple-700',
    },
  ]);

  const toggleDose = (id: string) => {
    soundManager.playClick();
    setDoses((prev) =>
      prev.map((d) => (d.id === id ? { ...d, taken: !d.taken } : d))
    );
  };

  const takenCount = doses.filter((d) => d.taken).length;
  const adherencePercent = Math.round((takenCount / doses.length) * 100);

  return (
    <div className="flex flex-col gap-5 text-slate-800 pb-20">
      {/* 1. Top App Bar */}
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
          Daily Routine & Adherence
        </h3>

        <button
          onClick={() => soundManager.playClick()}
          className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Title & Date */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Today's Activity
        </h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">
          25 October, 2026
        </p>
      </div>

      {/* 3. Three Soft Rounded Row Pills (Exact match to reference Screen 2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-[#E8F8EE] text-[#1E7E34] text-xs font-black flex items-center gap-1">
              ☆ 10 th
            </span>
            <span className="text-xs font-bold text-slate-800">Adherence Streak</span>
          </div>
          <span className="text-[11px] text-slate-400">Time in General</span>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-[#E3F2FD] text-[#0D47A1] text-xs font-black flex items-center gap-1">
              🕒 28m 45s
            </span>
            <span className="text-xs font-bold text-slate-800">Next Scheduled Dose</span>
          </div>
          <span className="text-[11px] text-slate-400">Today's routine</span>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-[#FDF0EB] text-[#BF360C] text-xs font-black flex items-center gap-1">
              👤 10 min
            </span>
            <span className="text-xs font-bold text-slate-800">Daily Pharmacist Check</span>
          </div>
          <span className="text-[11px] text-slate-400">Points earned</span>
        </div>
      </div>

      {/* 4. Two Progress Gauge Cards (Level Activity & Success Endurance) */}
      <div className="space-y-3">
        {/* Card 1: Level Activity */}
        <div className="p-4 bg-white rounded-[24px] shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Level Activity</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your general goal achievements
            </p>
            <span className="text-2xl font-black text-slate-900 mt-2 block">
              {adherencePercent}%
            </span>
          </div>

          {/* Semi-circular gauge arc SVG */}
          <div className="relative flex flex-col items-center">
            <svg className="w-20 h-11" viewBox="0 0 100 55">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 * (1 - adherencePercent / 100)}
                className="transition-all duration-500"
              />
            </svg>
            <span className="text-[10px] font-bold text-emerald-600 mt-1">
              ▲ 5%
            </span>
          </div>
        </div>

        {/* Card 2: Success Endurance */}
        <div className="p-4 bg-white rounded-[24px] shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Prescription Longevity</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your monthly medication supply
            </p>
            <span className="text-2xl font-black text-slate-900 mt-2 block">
              82%
            </span>
          </div>

          <div className="relative flex flex-col items-center">
            <svg className="w-20 h-11" viewBox="0 0 100 55">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 * (1 - 0.82)}
              />
            </svg>
            <span className="text-[10px] font-bold text-rose-500 mt-1">
              ▼ 3%
            </span>
          </div>
        </div>
      </div>

      {/* 5. Hydration & Calorie Curve (Matches 10km marathon wave card in reference Screen 3) */}
      <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-900">Hydration & Electrolytes</h4>
            <span className="text-[10px] text-slate-400">Assists optimal drug absorption</span>
          </div>
          <span className="text-xs font-black text-rose-500 font-mono">1,233 ml</span>
        </div>

        {/* Wave curve SVG */}
        <div className="py-2">
          <svg className="w-full h-16" viewBox="0 0 300 60" fill="none">
            <path
              d="M 0 45 Q 75 15 150 35 T 300 20"
              stroke="#F43F5E"
              strokeWidth="2.5"
              fill="none"
            />
            {/* 3 Callout points */}
            <circle cx="50" cy="33" r="3.5" fill="#3B82F6" />
            <text x="35" y="24" fill="#3B82F6" fontSize="9" fontWeight="bold">320ml</text>

            <circle cx="160" cy="33" r="3.5" fill="#3B82F6" />
            <text x="145" y="24" fill="#3B82F6" fontSize="9" fontWeight="bold">654ml</text>

            <circle cx="280" cy="22" r="3.5" fill="#F43F5E" />
          </svg>

          <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100">
            <span>8am</span>
            <span>12pm</span>
            <span>4pm</span>
            <span>8pm</span>
            <span>11pm</span>
          </div>
        </div>
      </div>

      {/* 6. Today's Medication Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-900">Medication Checklist</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {takenCount} of {doses.length} completed
          </span>
        </div>

        {doses.map((dose) => (
          <div
            key={dose.id}
            onClick={() => toggleDose(dose.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              dose.taken
                ? 'bg-slate-50 border-slate-200 opacity-80'
                : 'bg-white border-slate-100 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  dose.taken
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-slate-300 text-transparent hover:border-slate-400'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h5 className={`text-xs font-bold ${dose.taken ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {dose.name}
                  </h5>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    {dose.strength}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {dose.time} • {dose.instruction}
                </p>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${dose.badgeColor}`}>
              {dose.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
