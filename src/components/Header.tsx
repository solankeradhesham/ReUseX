import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Heart, 
  MessageSquare,
  Plus, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  X,
  Store,
  HelpCircle,
  LogOut,
  LogIn
} from 'lucide-react';
import { INDIAN_LOCATIONS } from '../data/locations';
import { CATEGORIES } from '../data/categories';
import { UserProfile } from '../types';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  savedCount: number;
  chatCount: number;
  onOpenSaved: () => void;
  onOpenChats: () => void;
  onOpenSell: () => void;
  onOpenMyAds: () => void;
  onOpenSafetyGuide: () => void;
  userAdsCount: number;
  currentUser: UserProfile | null;
  onOpenAuth: (context?: any) => void;
  onOpenUserProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  savedCount,
  chatCount,
  onOpenSaved,
  onOpenChats,
  onOpenSell,
  onOpenMyAds,
  onOpenSafetyGuide,
  userAdsCount,
  currentUser,
  onOpenAuth,
  onOpenUserProfile,
  onLogout
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = INDIAN_LOCATIONS.filter(loc => 
    loc.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
    loc.state.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Buy &amp; Sell Directly in India
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              Buy & Sell used Cars, Mobiles, Bikes, Flats & Furniture without middlemen
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              id="safety-guide-header-btn"
              onClick={onOpenSafetyGuide} 
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span>Safety & Fraud Guide</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">🇮🇳 India</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 md:gap-5">
          {/* Logo */}
          <div 
            onClick={() => {
              onSelectCategory(null);
              onSearchChange('');
              onSelectCity('All India');
            }}
            className="flex items-center gap-2 cursor-pointer shrink-0 select-none group"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
              R<span className="text-amber-300">X</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                  REUSE<span className="text-teal-600">X</span>
                </span>
                <span className="ml-1 text-[10px] uppercase font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-sm">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] tracking-wider text-slate-500 font-medium -mt-1">
                BECH DE &bull; BUY &bull; SELL
              </span>
            </div>
          </div>

          {/* Location Selector */}
          <div className="relative shrink-0 hidden sm:block" ref={locationRef}>
            <button
              id="location-picker-btn"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center justify-between gap-2 h-11 px-3.5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-800 rounded-lg text-sm font-semibold text-slate-800 transition-all min-w-[150px] max-w-[200px]"
            >
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">{selectedCity}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform shrink-0 ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLocationOpen && (
              <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 pb-2 border-b border-slate-100">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search city or state..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-md border border-slate-200 focus:outline-none focus:border-teal-600"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Popular Locations
                  </div>
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc.city}
                      onClick={() => {
                        onSelectCity(loc.city);
                        setIsLocationOpen(false);
                        setLocationSearch('');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-teal-50 transition-colors ${
                        selectedCity === loc.city ? 'bg-teal-50/80 font-bold text-teal-800' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${selectedCity === loc.city ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span>{loc.city}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-normal">{loc.state}</span>
                    </button>
                  ))}
                  {filteredLocations.length === 0 && (
                    <div className="p-4 text-xs text-center text-slate-500">
                      No matching cities found in India
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative flex items-center">
            <div className="relative w-full flex items-center">
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Find Cars, Mobile Phones, Bikes, Electronics, 2BHK Flats and more..."
                className="w-full h-11 pl-4 pr-24 bg-white border-2 border-slate-800 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-14 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                id="main-search-btn"
                className="absolute right-1 top-1 bottom-1 px-4 bg-slate-900 hover:bg-teal-700 text-white rounded-md flex items-center justify-center transition-colors font-medium text-sm gap-1 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Right Action Icons & Sell CTA */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              id="header-chat-btn"
              onClick={onOpenChats}
              className="relative p-2.5 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Messages"
              aria-label="Open messages"
            >
              <MessageSquare className="w-5 h-5" />
              {chatCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-teal-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {chatCount}
                </span>
              )}
            </button>

            {/* Saved Items */}
            <button
              id="header-saved-btn"
              onClick={onOpenSaved}
              className="relative p-2.5 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Saved Ads"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-teal-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="header-user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="" 
                      className="w-7 h-7 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline text-xs font-semibold text-slate-800">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full mt-1">
                        Account
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        id="menu-user-profile-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenUserProfile();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-teal-600" />
                        <span>My Profile &amp; User Info</span>
                      </button>

                      <button
                        id="menu-my-ads-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenMyAds();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Store className="w-4 h-4 text-teal-600" />
                          <span>My Classified Ads</span>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                          {userAdsCount}
                        </span>
                      </button>

                      <button
                        id="menu-saved-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSaved();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Favorites &amp; Wishlist ({savedCount})</span>
                      </button>

                      <button
                        id="menu-chats-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenChats();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-teal-700" />
                        <span>Messages</span>
                      </button>

                      <button
                        id="menu-safety-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSafetyGuide();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Buyer &amp; Seller Safety</span>
                      </button>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          id="menu-logout-btn"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => onOpenAuth({ type: 'profile' })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer border border-slate-700"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-400" />
                <span>Login</span>
              </button>
            )}

            {/* OLX-Style Iconic SELL Button */}
            <button
              id="header-sell-btn"
              onClick={onOpenSell}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-full font-bold text-slate-900 group shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span className="w-full h-full bg-gradient-to-br from-amber-400 via-amber-300 to-teal-400 absolute"></span>
              <span className="relative px-4 sm:px-6 py-2 transition-all ease-out duration-100 bg-white rounded-full group-hover:bg-opacity-0 flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wider text-slate-900">
                <Plus className="w-5 h-5 text-teal-600 stroke-[3] group-hover:text-slate-900" />
                <span>Sell</span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Location bar if screen is small */}
        <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-1 text-slate-700 font-semibold"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Location: <strong>{selectedCity}</strong></span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <span className="text-[11px] text-teal-700 font-medium">India</span>
        </div>
      </div>
    </header>
  );
};
