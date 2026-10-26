import React, { useState } from 'react';
import {
  Store,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  ShoppingCart,
  Compass,
  AlertTriangle,
  Flame,
  Wind,
  HeartPulse,
  Sparkles,
  FileText,
  Search,
} from 'lucide-react';
import { Medication, MEDICATION_CATEGORIES } from '../data/medications.ts';
import { soundManager } from '../utils/audio.ts';
import { SafetyAlert } from '../utils/safetyChecker.ts';

interface BottomSpatialDockProps {
  medications: Medication[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  activeView: 'overview' | 'aisle-1' | 'aisle-2' | 'aisle-3' | 'counter';
  onViewChange: (view: 'overview' | 'aisle-1' | 'aisle-2' | 'aisle-3' | 'counter') => void;
  onSelectMedication: (med: Medication) => void;
  cartCount: number;
  onOpenCart: () => void;
  safetyAlerts: SafetyAlert[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const BottomSpatialDock: React.FC<BottomSpatialDockProps> = ({
  medications,
  selectedCategory,
  onSelectCategory,
  activeView,
  onViewChange,
  onSelectMedication,
  cartCount,
  onOpenCart,
  safetyAlerts,
  searchQuery,
  onSearchChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(soundManager.enabled);

  const toggleAudio = () => {
    soundManager.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      soundManager.playClick();
    }
  };

  const handleViewSwitch = (view: 'overview' | 'aisle-1' | 'aisle-2' | 'aisle-3' | 'counter') => {
    soundManager.playWhoosh();
    onViewChange(view);
  };

  // Filter items shown in the quick-jump shelf ribbon
  const visibleMeds = medications.filter((m) => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.indications.some((ind) => ind.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-[940px] px-3 pointer-events-none">
      {/* Collapse / Expand Tab Bar */}
      <div className="flex justify-center mb-1 pointer-events-auto">
        <button
          onClick={() => {
            soundManager.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold shadow-lg hover:bg-slate-800 transition-colors"
          title="Toggle Navigation Dock"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Show Spatial Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      {!isCollapsed && (
        <div className="pointer-events-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-none text-slate-100 flex flex-col gap-2.5 transition-all">
          {/* Top Row: Camera Waypoints & Search */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            {/* Camera Waypoint Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs font-semibold">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mr-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Navigate:
              </span>

              <button
                onClick={() => handleViewSwitch('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'overview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Store View</span>
              </button>

              <button
                onClick={() => handleViewSwitch('aisle-1')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'aisle-1'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Aisle 1 (Pain/Cold)</span>
              </button>

              <button
                onClick={() => handleViewSwitch('aisle-2')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'aisle-2'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-sky-400" />
                <span>Aisle 2 (Digestive)</span>
              </button>

              <button
                onClick={() => handleViewSwitch('aisle-3')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'aisle-3'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Aisle 3 (Rx Care)</span>
              </button>

              <button
                onClick={() => handleViewSwitch('counter')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'counter'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>Rx Counter</span>
              </button>
            </div>

            {/* Actions: Sound & Cart */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Sound Synth Toggle */}
              <button
                onClick={toggleAudio}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title={audioEnabled ? 'Mute 3D Audio' : 'Enable 3D Audio'}
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenCart();
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md relative"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Prescription Cart</span>
                {cartCount > 0 && (
                  <span className="bg-white text-emerald-800 font-bold px-1.5 py-0.2 rounded-full text-[11px] font-mono">
                    {cartCount}
                  </span>
                )}
                {safetyAlerts.length > 0 && (
                  <span
                    className="flex items-center text-amber-300 ml-0.5"
                    title="Safety Alert in Cart!"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Middle Row: Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            <button
              onClick={() => {
                soundManager.playClick();
                onSelectCategory('all');
              }}
              className={`px-3 py-1 rounded-md shrink-0 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All Sections ({medications.length})
            </button>

            {MEDICATION_CATEGORIES.map((cat) => {
              const count = medications.filter((m) => m.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectCategory(cat.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat.id === 'pain-relief' && <Flame className="w-3 h-3 text-orange-400" />}
                  {cat.id === 'cold-respiratory' && <Wind className="w-3 h-3 text-cyan-400" />}
                  {cat.id === 'digestive-wellness' && <HeartPulse className="w-3 h-3 text-rose-400" />}
                  {cat.id === 'vitamins-supplements' && <Sparkles className="w-3 h-3 text-amber-400" />}
                  {cat.id === 'prescription-cardio' && <FileText className="w-3 h-3 text-indigo-400" />}
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Quick Shelf Ribbon (Thumbnail Carousel of Medications) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth">
            {visibleMeds.map((med) => (
              <button
                key={med.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectMedication(med);
                }}
                className="group shrink-0 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/90 border border-slate-700/60 hover:border-emerald-500/50 transition-all text-left"
              >
                <span
                  className="w-2.5 h-7 rounded-sm shrink-0"
                  style={{ backgroundColor: med.packageStyle.primaryColor }}
                />
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-200 group-hover:text-emerald-300 max-w-[125px] truncate">
                    {med.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold">${med.price.toFixed(2)}</span>
                    <span>• {med.dosageForm.split(' ')[0]}</span>
                    {med.requiresPrescription && (
                      <span className="text-rose-400 font-semibold">Rx</span>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {visibleMeds.length === 0 && (
              <div className="text-xs text-slate-400 py-1 px-2 italic">
                No medications found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
