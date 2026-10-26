/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MEDICATIONS, Medication } from './data/medications.ts';
import { DispensaryHomeView } from './components/DispensaryHomeView.tsx';
import { DailyRoutineView } from './components/DailyRoutineView.tsx';
import { DiagnosticsVitalsView } from './components/DiagnosticsVitalsView.tsx';
import { MobileDeviceFrame } from './components/MobileDeviceFrame.tsx';
import { ClinicalInspectorModal } from './components/ClinicalInspectorModal.tsx';
import { CartSheet } from './components/CartSheet.tsx';
import { PharmacistGuideModal } from './components/PharmacistGuideModal.tsx';
import { evaluateCartSafety } from './utils/safetyChecker.ts';
import { soundManager } from './utils/audio.ts';
import {
  Smartphone,
  LayoutGrid,
  Maximize2,
  ShieldCheck,
  ShoppingBag,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function App() {
  // View mode switcher: 'showcase' (3 mobile screens side-by-side like the user's reference) vs 'single-device' vs 'responsive'
  const [viewMode, setViewMode] = useState<'showcase' | 'single-device' | 'responsive'>('showcase');
  const [activeTab, setActiveTab] = useState<'home' | 'routine' | 'diagnostics' | 'cart'>('home');

  // Modals & Inspection
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundManager.enabled);

  // Cart state
  const [cartItems, setCartItems] = useState<{ med: Medication; quantity: number }[]>([
    { med: MEDICATIONS[0], quantity: 1 }, // Advil Ultra
    { med: MEDICATIONS[11], quantity: 1 }, // Lipitor 20mg
  ]);

  const safetyAlerts = useMemo(() => evaluateCartSafety(cartItems), [cartItems]);
  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);

  const handleAddToCart = (med: Medication, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.med.id === med.id);
      if (existing) {
        return prev.map((i) =>
          i.med.id === med.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { med, quantity }];
    });
  };

  const handleUpdateQuantity = (medId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.med.id === medId) {
            const next = i.quantity + delta;
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter(Boolean) as { med: Medication; quantity: number }[]
    );
  };

  const handleRemoveItem = (medId: string) => {
    soundManager.playClick();
    setCartItems((prev) => prev.filter((i) => i.med.id !== medId));
  };

  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-slate-800 flex flex-col font-sans select-none">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
            A
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
              AuraPharm
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Mobile Pharmacy & Diagnostics
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Showcase 3 Screens vs Single Phone vs Responsive) */}
        <div className="flex items-center bg-[#F1F3F6] p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode('showcase');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === 'showcase'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Showcase 3 Mobile Screens side-by-side (like reference)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3-Screen Showcase</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode('single-device');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === 'single-device'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Single Interactive Phone View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Phone</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode('responsive');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === 'responsive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Full-Width Responsive Desktop Layout"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expanded</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Safety Guide Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsConsultationOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safety Guide</span>
          </button>

          {/* Cart Pill */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsCartOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{totalCartCount}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-x-auto">
        {/* MODE A: 3-Screen Showcase (Matches the user's reference image!) */}
        {viewMode === 'showcase' && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="text-center mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                AuraPharm Mobile Healthcare Suite
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Clean iOS Health Design System
              </h2>
            </div>

            {/* 3 Mobile Devices side-by-side */}
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-8 w-full max-w-7xl overflow-x-auto py-2">
              {/* Screen 1: Dispensary & Medications */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-extrabold text-slate-500">
                  Screen 1: Dispensary & Care
                </span>
                <MobileDeviceFrame
                  activeTab="home"
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setViewMode('single-device');
                  }}
                  cartCount={totalCartCount}
                >
                  <DispensaryHomeView
                    onSelectMedication={setSelectedMedication}
                    onAddToCart={handleAddToCart}
                    onOpenConsultation={() => setIsConsultationOpen(true)}
                    onNavigateToRoutine={() => {
                      setActiveTab('routine');
                      setViewMode('single-device');
                    }}
                    onNavigateToDiagnostics={() => {
                      setActiveTab('diagnostics');
                      setViewMode('single-device');
                    }}
                  />
                </MobileDeviceFrame>
              </div>

              {/* Screen 2: Routine & Adherence Activity */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-extrabold text-slate-500">
                  Screen 2: Daily Routine & Doses
                </span>
                <MobileDeviceFrame
                  activeTab="routine"
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setViewMode('single-device');
                  }}
                  cartCount={totalCartCount}
                >
                  <DailyRoutineView
                    onBack={() => {
                      setActiveTab('home');
                      setViewMode('single-device');
                    }}
                  />
                </MobileDeviceFrame>
              </div>

              {/* Screen 3: Diagnostics & Vitals */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-extrabold text-slate-500">
                  Screen 3: Diagnostics & Heart Health
                </span>
                <MobileDeviceFrame
                  activeTab="diagnostics"
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setViewMode('single-device');
                  }}
                  cartCount={totalCartCount}
                >
                  <DiagnosticsVitalsView
                    onBack={() => {
                      setActiveTab('home');
                      setViewMode('single-device');
                    }}
                    onOpenConsultation={() => setIsConsultationOpen(true)}
                  />
                </MobileDeviceFrame>
              </div>
            </div>
          </div>
        )}

        {/* MODE B: Single Interactive Phone */}
        {viewMode === 'single-device' && (
          <div className="py-4">
            <MobileDeviceFrame
              activeTab={activeTab}
              onTabChange={(tab) => {
                if (tab === 'cart') {
                  setIsCartOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              cartCount={totalCartCount}
            >
              {activeTab === 'home' && (
                <DispensaryHomeView
                  onSelectMedication={setSelectedMedication}
                  onAddToCart={handleAddToCart}
                  onOpenConsultation={() => setIsConsultationOpen(true)}
                  onNavigateToRoutine={() => setActiveTab('routine')}
                  onNavigateToDiagnostics={() => setActiveTab('diagnostics')}
                />
              )}
              {activeTab === 'routine' && (
                <DailyRoutineView onBack={() => setActiveTab('home')} />
              )}
              {activeTab === 'diagnostics' && (
                <DiagnosticsVitalsView
                  onBack={() => setActiveTab('home')}
                  onOpenConsultation={() => setIsConsultationOpen(true)}
                />
              )}
            </MobileDeviceFrame>
          </div>
        )}

        {/* MODE C: Responsive Expanded Desktop Layout */}
        {viewMode === 'responsive' && (
          <div className="w-full max-w-5xl bg-white rounded-[36px] shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Dispensary & Medications */}
              <div className="lg:col-span-7">
                <DispensaryHomeView
                  onSelectMedication={setSelectedMedication}
                  onAddToCart={handleAddToCart}
                  onOpenConsultation={() => setIsConsultationOpen(true)}
                  onNavigateToRoutine={() => setActiveTab('routine')}
                  onNavigateToDiagnostics={() => setActiveTab('diagnostics')}
                />
              </div>

              {/* Right Column: Routine & Diagnostics */}
              <div className="lg:col-span-5 space-y-8 lg:border-l lg:border-slate-100 lg:pl-8">
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                    Today's Routine & Schedule
                  </h3>
                  <DailyRoutineView onBack={() => {}} />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                    Clinical Diagnostics & Vitals
                  </h3>
                  <DiagnosticsVitalsView
                    onBack={() => {}}
                    onOpenConsultation={() => setIsConsultationOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Clinical Medication Inspector Modal */}
      <ClinicalInspectorModal
        medication={selectedMedication}
        onClose={() => setSelectedMedication(null)}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
      />

      {/* 4. Cart Sheet */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        safetyAlerts={safetyAlerts}
      />

      {/* 5. Pharmacist Clinical Guide Modal */}
      <PharmacistGuideModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
}
