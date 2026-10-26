import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  Building,
  Truck,
  ArrowRight,
  CheckCircle,
  Package,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Medication } from '../data/medications.ts';
import { SafetyAlert } from '../utils/safetyChecker.ts';
import { soundManager } from '../utils/audio.ts';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: { med: Medication; quantity: number }[];
  onUpdateQuantity: (medId: string, delta: number) => void;
  onRemoveItem: (medId: string) => void;
  onClearCart: () => void;
  safetyAlerts: SafetyAlert[];
}

export const CartSheet: React.FC<CartSheetProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  safetyAlerts,
}) => {
  const [fulfillment, setFulfillment] = useState<'locker' | 'delivery'>('locker');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [rxNumber, setRxNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.med.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const fee = fulfillment === 'delivery' ? 4.99 : 0.0;
  const total = subtotal + tax + fee;
  const hasRx = items.some((i) => i.med.requiresPrescription);

  const handleCheckout = () => {
    soundManager.playCartAdd();
    const code = `AP-RX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(code);
    setOrderPlaced(true);
  };

  const handleDone = () => {
    onClearCart();
    setOrderPlaced(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-hidden text-slate-800 animate-in slide-in-from-bottom duration-250">
        {/* Grab bar affordance */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              Prescription Bag
            </h3>
            <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {items.reduce((acc, c) => acc + c.quantity, 0)} items
            </span>
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

        {orderPlaced ? (
          /* Confirmation Screen */
          <div className="flex-1 overflow-y-auto py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h4 className="text-xl font-black text-slate-900">
              Order Dispatched to Dispensary!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Your pharmaceutical package has been submitted to Dr. Robert Fox for verification.
            </p>

            {/* Smart Locker Code Card */}
            <div className="w-full bg-[#F8FAFC] border border-emerald-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                {fulfillment === 'locker' ? 'Smart Locker Passcode' : 'Rx Delivery Tracking'}
              </span>
              <p className="text-2xl font-mono font-black text-slate-900 tracking-wider">
                {orderId}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {fulfillment === 'locker'
                  ? 'Ready in 15 mins at Contactless Locker Bay #4'
                  : 'Out for cold-chain courier delivery by 3:30 PM'}
              </p>

              {/* Barcode line */}
              <div className="flex justify-center items-end gap-1 mt-3 h-8 opacity-60">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span
                    key={i}
                    className="bg-slate-800"
                    style={{
                      width: i % 3 === 0 ? '3px' : '1.5px',
                      height: i % 2 === 0 ? '100%' : '70%',
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full h-12 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-md mt-2"
            >
              Back to Dispensary
            </button>
          </div>
        ) : (
          /* Cart List & Checkout */
          <>
            {/* Safety warnings banner */}
            {safetyAlerts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 my-2 space-y-1.5 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Clinical Pharmacist Safety Warnings ({safetyAlerts.length})</span>
                </div>
                {safetyAlerts.map((a) => (
                  <p key={a.id} className="text-[11px] text-amber-800 leading-tight">
                    • <strong>{a.title}:</strong> {a.description}
                  </p>
                ))}
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
              {items.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">Your bag is empty</p>
                  <p className="text-[11px] text-slate-400">
                    Add OTC or prescribed medications from the inventory.
                  </p>
                </div>
              ) : (
                items.map(({ med, quantity }) => (
                  <div
                    key={med.id}
                    className="p-3 bg-[#F8F9FA] rounded-2xl border border-slate-100 flex items-center justify-between gap-2.5"
                  >
                    <span
                      className="w-2.5 h-10 rounded-sm shrink-0"
                      style={{ backgroundColor: med.packageStyle.primaryColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {med.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ${med.price.toFixed(2)} • {med.strength}
                      </span>
                    </div>

                    <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(med.id, -1)}
                        className="w-6 h-6 rounded-lg text-slate-500 hover:text-slate-800 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(med.id, 1)}
                        className="w-6 h-6 rounded-lg text-slate-500 hover:text-slate-800 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-bold text-slate-900 w-12 text-right">
                      ${(med.price * quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => onRemoveItem(med.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}

              {/* Rx Note if cart has Rx items */}
              {hasRx && (
                <div className="p-3 bg-[#EEF2FF] border border-indigo-100 rounded-2xl space-y-1.5 text-xs text-indigo-950">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-800">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Doctor Prescription Verification
                  </span>
                  <input
                    type="text"
                    value={rxNumber}
                    onChange={(e) => setRxNumber(e.target.value)}
                    placeholder="Doctor Name or Rx # (e.g. Dr. Miller / Rx #8849)"
                    className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              )}
            </div>

            {/* Fulfillment & Totals */}
            {items.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setFulfillment('locker')}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col gap-0.5 transition-all ${
                      fulfillment === 'locker'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      Smart Locker
                    </span>
                    <span className={`text-[10px] ${fulfillment === 'locker' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Ready in 15m • Free
                    </span>
                  </button>

                  <button
                    onClick={() => setFulfillment('delivery')}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col gap-0.5 transition-all ${
                      fulfillment === 'delivery'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" />
                      Express Courier
                    </span>
                    <span className={`text-[10px] ${fulfillment === 'delivery' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Cold-chain • $4.99
                    </span>
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-500 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {fulfillment === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>$4.99</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                    <span>Total:</span>
                    <span className="text-emerald-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Confirm & Order (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
