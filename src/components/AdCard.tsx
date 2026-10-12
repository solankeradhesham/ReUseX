import React from 'react';
import { Heart, MapPin, Zap, Sparkles, ImageOff } from 'lucide-react';
import { AdItem } from '../types';
import { formatINR } from '../utils/formatters';

interface AdCardProps {
  ad: AdItem;
  isSaved: boolean;
  onToggleSave: (adId: string, e: React.MouseEvent) => void;
  onClick: (ad: AdItem) => void;
}

export const AdCard: React.FC<AdCardProps> = ({
  ad,
  isSaved,
  onToggleSave,
  onClick
}) => {
  // Extract primary subtitle spec depending on category
  const getSubSpecText = () => {
    if (!ad.specs) return ad.subcategory;
    if (ad.categoryId === 'cars') {
      return `${ad.specs['Year'] || ''} • ${ad.specs['KM Driven'] || ''} • ${ad.specs['Fuel Type'] || ''}`.replace(/^ • | • $/g, '');
    }
    if (ad.categoryId === 'bikes') {
      return `${ad.specs['Model Year'] || ''} • ${ad.specs['KM Run'] || ''}`.replace(/^ • | • $/g, '');
    }
    if (ad.categoryId === 'mobiles') {
      return `${ad.specs['Storage'] || ''} • ${ad.specs['Battery Health'] || ''}`.replace(/^ • | • $/g, '');
    }
    if (ad.categoryId === 'properties') {
      return `${ad.specs['Bedrooms'] || ''} • ${ad.specs['Super Built-up Area'] || ''}`.replace(/^ • | • $/g, '');
    }
    if (ad.categoryId === 'electronics') {
      return `${ad.specs['Processor'] || ad.specs['Screen Size'] || ad.specs['Sensor'] || ad.condition}`;
    }
    return ad.condition;
  };

  const specText = getSubSpecText();

  return (
    <div
      id={`ad-card-${ad.id}`}
      onClick={() => onClick(ad)}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {ad.images[0] ? (
          <img
            src={ad.images[0]}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400" aria-label="No photo provided">
            <ImageOff className="w-8 h-8" />
          </div>
        )}

        {/* Featured / Urgent Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {ad.featured && (
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-sm shadow-xs tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" /> FEATURED
            </span>
          )}
          {ad.urgent && (
            <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] uppercase rounded-sm shadow-xs tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white" /> URGENT
            </span>
          )}
        </div>

        {/* Save/Wishlist Heart */}
        <button
          id={`save-btn-${ad.id}`}
          onClick={(e) => onToggleSave(ad.id, e)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            isSaved 
              ? 'bg-rose-50 text-rose-600 scale-110' 
              : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Photos count pill */}
        {ad.images.length > 1 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold rounded-md">
            📸 {ad.images.length}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {formatINR(ad.price)}
              </span>
              {ad.originalPrice && ad.originalPrice > ad.price && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatINR(ad.originalPrice)}
                </span>
              )}
            </div>
            {ad.isNegotiable && (
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                Negotiable
              </span>
            )}
          </div>

          {/* Quick Specs Subtitle if available */}
          {specText && (
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {specText}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mt-1 leading-snug group-hover:text-teal-700 transition-colors">
            {ad.title}
          </h3>
        </div>

        {/* Footer: Location & Time */}
        <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">
              {ad.location.locality}, {ad.location.city}
            </span>
          </div>
          <span className="shrink-0 font-medium">{ad.postedAt}</span>
        </div>
      </div>
    </div>
  );
};
