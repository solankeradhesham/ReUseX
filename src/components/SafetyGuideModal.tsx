import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  QrCode, 
  MapPin, 
  CreditCard, 
  FileCheck, 
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

interface SafetyGuideModalProps {
  onClose: () => void;
}

export const SafetyGuideModal: React.FC<SafetyGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">ReuseX Safety Shield &amp; Fraud Prevention</h3>
              <p className="text-xs text-emerald-300">Protecting Indian buyers &amp; sellers from online scams</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-slate-800 text-sm leading-relaxed">
          
          {/* Critical Warning Box */}
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>BEWARE OF UPI QR CODE SCAMS!</span>
            </div>
            <p className="text-xs text-rose-950 leading-normal">
              <strong>Golden Rule:</strong> You <strong>NEVER</strong> need to scan a QR code or enter your UPI PIN to <em>receive</em> money. If a buyer sends you a QR code or link claiming to transfer funds, it is a scam to withdraw money from your bank account.
            </p>
          </div>

          {/* Safety Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>1. Meet in Public Spaces</span>
              </div>
              <p className="text-xs text-slate-600">
                Always arrange inspections in busy daylight spots (e.g. metro stations, malls, coffee shops). Never meet in deserted locations.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <CreditCard className="w-4 h-4 text-teal-700" />
                <span>2. No Advance Tokens</span>
              </div>
              <p className="text-xs text-slate-600">
                Never pay booking advance or shipping charges before physically checking the condition of the vehicle or gadget.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <FileCheck className="w-4 h-4 text-teal-700" />
                <span>3. Vehicle RC &amp; Challan Check</span>
              </div>
              <p className="text-xs text-slate-600">
                For cars &amp; bikes, always check RC authenticity on the official government <strong>mParivahan / VAHAN</strong> portal for hypothecation or pending challans.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <PhoneCall className="w-4 h-4 text-teal-700" />
                <span>4. Verify Original Bill &amp; IMEI</span>
              </div>
              <p className="text-xs text-slate-600">
                For electronics and iPhones, check IMEI status (*#06#) and ensure the Apple ID / Google Account is completely signed out in front of you.
              </p>
            </div>

          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Use these precautions when meeting a seller or inspecting an item. ReuseX has not independently verified this listing.</span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              I Understand &amp; Agree
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
