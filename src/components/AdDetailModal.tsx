import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Eye, 
  Phone, 
  MessageSquare,
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { AdItem } from '../types';
import { formatINR } from '../utils/formatters';

interface AdDetailModalProps {
  ad: AdItem;
  isSaved: boolean;
  onToggleSave: (adId: string) => void;
  onClose: () => void;
  onStartChat: (ad: AdItem) => void;
  onBuyNow: (ad: AdItem) => void;
  onOpenSafetyGuide: () => void;
}

export const AdDetailModal: React.FC<AdDetailModalProps> = ({
  ad,
  isSaved,
  onToggleSave,
  onClose,
  onStartChat,
  onBuyNow,
  onOpenSafetyGuide
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText?.(ad.seller.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
              {ad.subcategory}
            </span>
            <span className="text-xs text-slate-500 truncate hidden sm:inline">
              ID: {ad.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="detail-share-btn"
              onClick={handleShare}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              id="detail-save-btn"
              onClick={() => onToggleSave(ad.id)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer ${
                isSaved ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-600 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              id="detail-close-btn"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Photos Gallery & Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Photo Showcase */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center group">
                <img
                  src={ad.images[activeImageIndex] || ad.images[0]}
                  alt={ad.title}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? ad.images.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === ad.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-xs text-white text-xs font-medium rounded">
                  {activeImageIndex + 1} / {ad.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {ad.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {ad.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-teal-600 ring-2 ring-teal-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Specifications / Highlights Table */}
              {ad.specs && Object.keys(ad.specs).length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Item Specifications &amp; Overview
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(ad.specs).map(([key, val]) => (
                      <div key={key} className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[11px] text-slate-400 font-medium block uppercase">{key}</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block mt-0.5">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-base font-bold text-slate-900">Description</h4>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {ad.description}
                </div>
              </div>
            </div>

            {/* Right Column: Price, Seller Profile, Actions (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Price & Title Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-950 tracking-tight">
                      {formatINR(ad.price)}
                    </span>
                    {ad.originalPrice && ad.originalPrice > ad.price && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatINR(ad.originalPrice)}
                      </span>
                    )}
                  </div>
                  {ad.isNegotiable && (
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      Price Negotiable
                    </span>
                  )}
                </div>

                <h1 className="text-lg font-bold text-slate-900 leading-snug">
                  {ad.title}
                </h1>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{ad.location.locality}, {ad.location.city}, {ad.location.state}</span>
                  </div>
                  <span className="shrink-0">{ad.postedAt}</span>
                </div>
              </div>

              {/* Contact actions */}
              <div className="space-y-2.5">
                <button
                  id="detail-chat-btn"
                  onClick={() => onStartChat(ad)}
                  className="w-full py-3.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Seller</span>
                </button>

                <button
                  id="detail-call-seller-btn"
                  onClick={() => onBuyNow(ad)}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <span>Call Seller</span>
                </button>

                {/* Call Seller Phone Reveal */}
                <div className="pt-1">
                  {!showPhone ? (
                    <button
                      id="detail-show-phone-btn"
                      onClick={() => setShowPhone(true)}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Show Seller Phone Number</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-teal-700" />
                        <span className="font-bold text-sm text-teal-950 tracking-wide">{ad.seller.phone}</span>
                      </div>
                      <button
                        onClick={handleCopyPhone}
                        className="text-xs bg-white text-teal-800 font-semibold px-2.5 py-1 rounded border border-teal-200 flex items-center gap-1 hover:bg-teal-100 cursor-pointer"
                      >
                        {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Profile Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Seller Information
                  </span>
                  {ad.seller.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Phone Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={ad.seller.avatar}
                    alt={ad.seller.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{ad.seller.name}</h3>
                    <p className="text-xs text-slate-500">Member since {ad.seller.memberSince}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mt-0.5">
                      <span className="text-amber-500">★ {ad.seller.rating.toFixed(1)}</span>
                      <span>&bull;</span>
                      <span>{ad.seller.totalReviews} ratings</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span>Response Rate: <strong>{ad.seller.responseRate}</strong></span>
                  <span>Active Ads: <strong>{ad.seller.activeAdsCount}</strong></span>
                </div>
              </div>

              {/* Safety Alert in detail view */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Buyer Safety Advisory</span>
                </div>
                <p className="text-amber-900/90 leading-snug">
                  Never pay in advance. Verify item &amp; document ownership in daylight before transferring funds.
                </p>
                <button
                  onClick={onOpenSafetyGuide}
                  className="text-[11px] text-amber-900 font-bold underline hover:text-amber-700 inline-block cursor-pointer pt-0.5"
                >
                  Read 5 Essential Safety Rules &rarr;
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
