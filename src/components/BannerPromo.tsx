import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Car, 
  Smartphone, 
  ArrowRight, 
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';

interface BannerPromoProps {
  onOpenSell: () => void;
  onOpenSafetyGuide: () => void;
  onSelectCategory: (cat: string) => void;
}

export const BannerPromo: React.FC<BannerPromoProps> = ({
  onOpenSell,
  onOpenSafetyGuide,
  onSelectCategory
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Main Hero Card */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col justify-between">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Instant Sell on ReuseX India</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white max-w-lg leading-tight">
              Create a Listing and Reach <span className="text-amber-400">Interested Buyers</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-md">
              Add your item details and contact information so interested buyers can reach you.
            </p>
          </div>

          <div className="relative z-10 mt-4 sm:mt-6 flex flex-wrap items-center gap-3">
            <button
              id="hero-sell-now-btn"
              onClick={onOpenSell}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Post a Free Ad</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Account-based listings
              </span>
              <span>&bull;</span>
              <span>Seller Contact</span>
            </div>
          </div>
        </div>

        {/* Side Mini Promo & Safety Alert */}
        <div className="flex flex-col gap-3">
          {/* Quick Category Jump */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-slate-950 shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-950">Browse categories</span>
              <h3 className="text-base font-black">Cars &amp; Mobiles</h3>
              <p className="text-xs text-amber-950 font-medium">See listings posted by users</p>
            </div>
            <div className="flex gap-1.5">
              <button 
                onClick={() => onSelectCategory('cars')}
                className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105"
                title="Browse Cars"
              >
                <Car className="w-5 h-5 text-teal-800" />
              </button>
              <button 
                onClick={() => onSelectCategory('mobiles')}
                className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105"
                title="Browse Mobiles"
              >
                <Smartphone className="w-5 h-5 text-teal-800" />
              </button>
            </div>
          </div>

          {/* Safety Awareness Tip */}
          <div 
            onClick={onOpenSafetyGuide}
            className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-emerald-950">ReuseX Safety Shield</h4>
                <span className="text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">TIPS</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Never scan QR codes to receive money. Inspect items in person before paying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
