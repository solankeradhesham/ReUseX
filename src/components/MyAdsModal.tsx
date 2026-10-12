import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Eye, 
  Heart, 
  Trash2, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Clock, 
  IndianRupee,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AdItem } from '../types';
import { formatINR } from '../utils/formatters';

interface MyAdsModalProps {
  ads: AdItem[];
  onClose: () => void;
  onOpenSell: () => void;
  onSelectAd: (ad: AdItem) => void;
  onMarkSold: (adId: string) => void;
  onDeleteAd: (adId: string) => void;
  onUpdatePrice: (adId: string, newPrice: number) => void;
}

export const MyAdsModal: React.FC<MyAdsModalProps> = ({
  ads,
  onClose,
  onOpenSell,
  onSelectAd,
  onMarkSold,
  onDeleteAd,
  onUpdatePrice
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold'>('all');
  const [editingPriceAdId, setEditingPriceAdId] = useState<string | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<string>('');

  const filteredAds = ads.filter((ad) => {
    if (activeTab === 'active') return ad.status === 'active';
    if (activeTab === 'sold') return ad.status === 'sold';
    return true;
  });

  const totalViews = ads.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
  const totalLikes = ads.reduce((sum, a) => sum + (a.likesCount || 0), 0);

  const handleStartEditPrice = (ad: AdItem) => {
    setEditingPriceAdId(ad.id);
    setNewPriceInput(String(ad.price));
  };

  const handleSavePrice = (adId: string) => {
    const val = Number(newPriceInput);
    if (!isNaN(val) && val > 0) {
      onUpdatePrice(adId, val);
    }
    setEditingPriceAdId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Store className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold">My Classified Ads Dashboard</h2>
              <p className="text-xs text-slate-400">Manage your active listings, view counts, and sales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Performance Metrics */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Active Ads</span>
            <span className="text-xl font-black text-slate-900">{ads.filter(a => a.status === 'active').length}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Views</span>
            <span className="text-xl font-black text-teal-700">{totalViews}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Favorites</span>
            <span className="text-xl font-black text-rose-600">{totalLikes}</span>
          </div>
        </div>

        {/* Tabs & Post Button */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({ads.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'active' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Active ({ads.filter(a => a.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sold' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sold ({ads.filter(a => a.status === 'sold').length})
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenSell();
            }}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Post New Ad</span>
          </button>
        </div>

        {/* List of Ads */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              <div 
                onClick={() => onSelectAd(ad)} 
                className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer group"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={ad.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {ad.status === 'sold' && (
                    <span className="absolute inset-0 bg-slate-900/70 text-white font-black text-[10px] uppercase flex items-center justify-center">
                      SOLD
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {ad.subcategory}
                    </span>
                    <span className="text-[11px] text-slate-400">{ad.postedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                    {ad.title}
                  </h4>
                  
                  {editingPriceAdId === ad.id ? (
                    <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        value={newPriceInput}
                        onChange={(e) => setNewPriceInput(e.target.value)}
                        className="text-xs font-bold px-2 py-0.5 border border-teal-600 rounded w-24"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePrice(ad.id)}
                        className="text-xs bg-teal-700 text-white px-2 py-0.5 rounded font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-sm font-black text-teal-800">{formatINR(ad.price)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditPrice(ad);
                        }}
                        className="text-[11px] text-slate-400 hover:text-teal-700 underline flex items-center gap-0.5"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Price
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {ad.status !== 'sold' ? (
                  <button
                    onClick={() => onMarkSold(ad.id)}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark Sold</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Sold Out
                  </span>
                )}

                <button
                  onClick={() => onDeleteAd(ad.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Ad"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredAds.length === 0 && (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="text-sm">No ads found in this tab.</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenSell();
                }}
                className="text-xs text-teal-700 font-bold underline"
              >
                Post an Ad now &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
