import React from 'react';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { AdItem } from '../types';
import { formatINR } from '../utils/formatters';

interface SavedAdsModalProps {
  savedAds: AdItem[];
  onClose: () => void;
  onSelectAd: (ad: AdItem) => void;
  onRemoveSaved: (adId: string) => void;
}

export const SavedAdsModal: React.FC<SavedAdsModalProps> = ({
  savedAds,
  onClose,
  onSelectAd,
  onRemoveSaved
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-base font-bold">Saved Ads &amp; Wishlist ({savedAds.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-xs"
            >
              <div 
                onClick={() => {
                  onClose();
                  onSelectAd(ad);
                }}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
              >
                <img
                  src={ad.images[0]}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-teal-700">{ad.subcategory}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-teal-700">
                    {ad.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-black text-slate-950">{formatINR(ad.price)}</p>
                  <p className="text-[11px] text-slate-400 truncate">{ad.location.locality}, {ad.location.city}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onClose();
                    onSelectAd(ad);
                  }}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemoveSaved(ad.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove from Saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {savedAds.length === 0 && (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Heart className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium">You haven&apos;t saved any ads yet.</p>
              <p className="text-xs text-slate-400">Click the heart icon on any ad to bookmark it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
