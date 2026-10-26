import React from 'react';
import {
  Home,
  PlusCircle,
  Heart,
  User,
  ShoppingBag,
  Activity,
  Wifi,
  Battery,
  Calendar,
} from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  activeTab: 'home' | 'routine' | 'diagnostics' | 'cart';
  onTabChange: (tab: 'home' | 'routine' | 'diagnostics' | 'cart') => void;
  cartCount: number;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  cartCount,
}) => {
  return (
    <div className="w-full max-w-[400px] h-[840px] bg-[#F7F8FA] rounded-[50px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.15)] border-[10px] border-white relative overflow-hidden flex flex-col shrink-0 select-none">
      {/* 1. iOS Status Bar with Dynamic Island (Matches reference image!) */}
      <div className="pt-3 px-7 pb-2 flex items-center justify-between z-30 shrink-0">
        <span className="text-xs font-black text-slate-900 tracking-tight">12:48</span>

        {/* Dynamic Island pill notch */}
        <div className="w-24 h-6 bg-slate-950 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 mr-auto ml-2.5 opacity-90" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2.5" />
        </div>

        <div className="flex items-center gap-1.5 text-slate-900">
          <span className="text-[10px] font-bold">5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-slate-900" />
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-6 no-scrollbar">
        {children}
      </div>

      {/* 3. Floating Bottom Navigation Bar (Matches the reference image bottom navigation pill dock!) */}
      <div className="absolute bottom-4 left-6 right-6 z-30 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 py-2 px-5 flex items-center justify-between">
          {/* Tab 1: Home Dispensary */}
          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('home');
            }}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'home'
                ? 'text-slate-950'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Dispensary Inventory"
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'home' ? 'bg-slate-900 text-white' : ''}`}>
              <Home className="w-4 h-4" />
            </div>
          </button>

          {/* Tab 2: Daily Routine */}
          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('routine');
            }}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'routine'
                ? 'text-slate-950'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Daily Routine"
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'routine' ? 'bg-slate-900 text-white' : ''}`}>
              <Calendar className="w-4 h-4" />
            </div>
          </button>

          {/* Tab 3: Diagnostics & Vitals */}
          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('diagnostics');
            }}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'diagnostics'
                ? 'text-slate-950'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Heart & Diagnostics"
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'diagnostics' ? 'bg-slate-900 text-white' : ''}`}>
              <Heart className={`w-4 h-4 ${activeTab === 'diagnostics' ? 'fill-rose-400 text-rose-400' : ''}`} />
            </div>
          </button>

          {/* Tab 4: Cart / Bag */}
          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('cart');
            }}
            className={`relative flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'cart'
                ? 'text-slate-950'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Prescription Bag"
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'cart' ? 'bg-slate-900 text-white' : ''}`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white font-mono">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
