import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  ShieldCheck,
  Package,
  Building,
  Truck,
  ArrowRight,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Medication } from '../data/medications.ts';
import { SafetyAlert } from '../utils/safetyChecker.ts';
import { soundManager } from '../utils/audio.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: { med: Medication; quantity: number }[];
  onUpdateQuantity: (medId: string, delta: number) => void;
  onRemoveItem: (medId: string) => void;
  onClearCart: () => void;
  safetyAlerts: SafetyAlert[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  safetyAlerts,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'locker' | 'delivery'>('locker');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [rxNotes, setRxNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.med.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.06;
  const fulfillmentFee = fulfillmentType === 'delivery' ? 4.99 : 0.0;
  const total = subtotal + estimatedTax + fulfillmentFee;
  const hasRxItem = items.some((item) => item.med.requiresPrescription);

  const handleCheckout = () => {
    soundManager.playCartAdd();
    const randomCode = `AP-RX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(randomCode);
    setOrderComplete(true);
  };

  const handleReset = () => {
    onClearCart();
    setOrderComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col h-full text-slate-100 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base text-white">Prescription & OTC Cart</h2>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {items.reduce((acc, curr) => acc + curr.quantity, 0)} items
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

        {orderComplete ? (
          /* Order Confirmation View */
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-white">Dispensary Order Confirmed!</h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Your pharmaceutical package has been routed to our licensed pharmacist dispensing queue.
            </p>

            {/* Smart Pickup Code Card */}
            <div className="w-full bg-slate-950 border border-emerald-500/50 rounded-2xl p-5 text-center shadow-xl">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                {fulfillmentType === 'locker' ? '24/7 Smart Locker Access Key' : 'Rx Delivery Tracking'}
              </span>
              <p className="text-2xl font-mono font-extrabold text-white tracking-wider my-1">
                {orderCode}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                {fulfillmentType === 'locker'
                  ? 'Ready in 15 mins at AuraPharm Automated Locker Bay #4'
                  : 'Out for cold-chain courier delivery by 3:30 PM'}
              </p>

              {/* Barcode representation */}
              <div className="flex justify-center items-end gap-1 mt-4 h-10 opacity-70">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className="bg-slate-200"
                    style={{
                      width: i % 3 === 0 ? '4px' : '2px',
                      height: i % 2 === 0 ? '100%' : '75%',
                    }}
                  />
                ))}
              </div>
            </div>

            {hasRxItem && (
              <div className="text-left bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-400" />
                  Prescription Note on Record
                </span>
                <p className="text-slate-400 text-[11px]">
                  Doctor approval on file will be reviewed prior to dispensing. Have your ID ready at pickup.
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md mt-4"
            >
              Continue Browsing 3D Store
            </button>
          </div>
        ) : (
          /* Normal Cart Items & Checkout Workflow */
          <>
            {/* Safety Alerts Banner */}
            {safetyAlerts.length > 0 && (
              <div className="bg-amber-500/10 border-b border-amber-500/40 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Clinical Pharmacist Safety Warnings ({safetyAlerts.length})</span>
                </div>
                {safetyAlerts.map((alert) => (
                  <div key={alert.id} className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-amber-500/30">
                    <span className="font-semibold text-amber-200 block">{alert.title}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alert.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <Package className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold">Your prescription cart is empty</p>
                  <p className="text-xs text-slate-500">
                    Browse the 3D aisles and click any medication to inspect and add.
                  </p>
                </div>
              ) : (
                items.map(({ med, quantity }) => (
                  <div
                    key={med.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <span
                      className="w-2.5 h-12 rounded-sm shrink-0"
                      style={{ backgroundColor: med.packageStyle.primaryColor }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate block">
                          {med.name}
                        </span>
                        {med.requiresPrescription && (
                          <span className="bg-rose-500/20 text-rose-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-rose-500/30 shrink-0">
                            Rx
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        ${med.price.toFixed(2)} • {med.strength}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(med.id, -1)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(med.id, 1)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-bold text-emerald-400 w-14 text-right">
                      ${(med.price * quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => onRemoveItem(med.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}

              {/* Rx Note if cart contains prescription medications */}
              {hasRxItem && (
                <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-800/40 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Prescription Verification Note</span>
                  </div>
                  <input
                    type="text"
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                    placeholder="Doctor name or Rx number (e.g. Dr. Miller / Rx #99482)"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              )}
            </div>

            {/* Fulfillment Selector */}
            {items.length > 0 && (
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Fulfillment Method:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setFulfillmentType('locker')}
                    className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                      fulfillmentType === 'locker'
                        ? 'border-emerald-500 bg-emerald-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs">
                      <Building className="w-3.5 h-3.5 text-emerald-400" />
                      <span>24/7 Smart Locker</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Ready in 15m • Free</span>
                  </button>

                  <button
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                      fulfillmentType === 'delivery'
                        ? 'border-emerald-500 bg-emerald-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs">
                      <Truck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Express Delivery</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Cold-chain • $4.99</span>
                  </button>
                </div>

                {/* Calculation Summary */}
                <div className="space-y-1 pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-slate-200">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (6%):</span>
                    <span className="text-slate-200">${estimatedTax.toFixed(2)}</span>
                  </div>
                  {fulfillmentType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="text-slate-200">$4.99</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span>Total Amount:</span>
                    <span className="text-emerald-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <span>Confirm Dispensary Order</span>
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
