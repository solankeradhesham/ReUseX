/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  CategoryNav 
} from './components/CategoryNav';
import { 
  BannerPromo 
} from './components/BannerPromo';
import { 
  FilterSidebar 
} from './components/FilterSidebar';
import { 
  AdCard 
} from './components/AdCard';
import { 
  AdDetailModal 
} from './components/AdDetailModal';
import { 
  SellModal 
} from './components/SellModal';
import { ChatModal } from './components/ChatModal';
import { 
  MyAdsModal 
} from './components/MyAdsModal';
import { 
  SavedAdsModal 
} from './components/SavedAdsModal';
import { 
  SafetyGuideModal 
} from './components/SafetyGuideModal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  UserProfileModal 
} from './components/UserProfileModal';
import { 
  Footer 
} from './components/Footer';

import { AdItem, Conversation, FilterState, UserProfile } from './types';
import { getCurrentUser, signOut, updateAccountProfile } from './services/auth';
import { createAd, deleteAd, getAds, NewAdInput, updateAd } from './services/ads';
import { getSavedAdIds, saveAdIds } from './services/favorites';
import { getConversations, openConversation, sendChatMessage } from './services/chats';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ArrowUpDown, 
  SearchX, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(true);
  const [adsLoadError, setAdsLoadError] = useState('');

  // Saved Ad IDs
  const [savedAdIds, setSavedAdIds] = useState<string[]>([]);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: null,
    selectedSubcategory: null,
    selectedCity: 'All India',
    minPrice: null,
    maxPrice: null,
    condition: null,
    sortBy: 'recommended',
    onlyVerified: false,
    onlyUrgent: false
  });

  // Modals & Drawers
  const [selectedAdForDetail, setSelectedAdForDetail] = useState<AdItem | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isMyAdsModalOpen, setIsMyAdsModalOpen] = useState(false);
  const [isSavedAdsModalOpen, setIsSavedAdsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isSafetyGuideModalOpen, setIsSafetyGuideModalOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Authentication & Login Gate State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionContext, setAuthActionContext] = useState<{
    type: 'buy' | 'offer' | 'chat' | 'sell' | 'profile';
    itemTitle?: string;
    itemPrice?: number;
  } | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'sell' | 'profile' | 'chat';
    ad?: AdItem;
  } | null>(null);

  // User Profile & Buy Modal States
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    let isActive = true;
    getCurrentUser()
      .then((user) => {
        if (isActive) setCurrentUser(user);
      })
      .catch(() => {
        if (isActive) setCurrentUser(null);
      });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    if (!currentUser) {
      setSavedAdIds([]);
      return () => {
        isActive = false;
      };
    }

    getSavedAdIds()
      .then((ids) => {
        if (isActive) setSavedAdIds(ids);
      })
      .catch(() => {
        if (isActive) showToast('Could not load your saved listings.', 'info');
      });

    return () => {
      isActive = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let isActive = true;
    if (!currentUser) {
      setConversations([]);
      setActiveConversationId(null);
      return () => {
        isActive = false;
      };
    }

    setIsLoadingChats(true);
    getConversations()
      .then((items) => {
        if (isActive) setConversations(items);
      })
      .catch(() => {
        if (isActive) showToast('Could not load messages.', 'info');
      })
      .finally(() => {
        if (isActive) setIsLoadingChats(false);
      });

    return () => {
      isActive = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let isActive = true;
    getAds()
      .then((listings) => {
        if (isActive) {
          setAds(listings);
          setAdsLoadError('');
        }
      })
      .catch(() => {
        if (isActive) setAdsLoadError('Could not load listings from the server.');
      })
      .finally(() => {
        if (isActive) setIsLoadingAds(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  // Filter & Sort ads
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(query);
        const matchesDesc = ad.description.toLowerCase().includes(query);
        const matchesSubcat = ad.subcategory.toLowerCase().includes(query);
        const matchesLocality = ad.location.locality.toLowerCase().includes(query);
        const matchesCity = ad.location.city.toLowerCase().includes(query);
        const matchesSpecs = ad.specs && Object.values(ad.specs).some(v => String(v).toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesSubcat && !matchesLocality && !matchesCity && !matchesSpecs) {
          return false;
        }
      }

      // City filter
      if (filters.selectedCity !== 'All India') {
        if (ad.location.city.toLowerCase() !== filters.selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategory) {
        if (ad.categoryId !== filters.selectedCategory) {
          return false;
        }
      }

      // Subcategory filter
      if (filters.selectedSubcategory) {
        if (ad.subcategory !== filters.selectedSubcategory) {
          return false;
        }
      }

      // Price filter
      if (filters.minPrice !== null && ad.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && ad.price > filters.maxPrice) {
        return false;
      }

      // Condition filter
      if (filters.condition && ad.condition !== filters.condition) {
        return false;
      }

      // Verified filter
      if (filters.onlyVerified && !ad.verified && !ad.seller.verified) {
        return false;
      }

      // Urgent filter
      if (filters.onlyUrgent && !ad.urgent) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'popular') return (b.viewsCount + b.likesCount) - (a.viewsCount + a.likesCount);
      if (filters.sortBy === 'newest') return b.id.localeCompare(a.id);
      
      // Default: Recommended (Featured first, then most likes/views)
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.likesCount - a.likesCount;
    });
  }, [ads, filters]);

  // Saved Ad objects
  const savedAds = useMemo(() => {
    return ads.filter(a => savedAdIds.includes(a.id));
  }, [ads, savedAdIds]);

  // Only show ads created by the authenticated account in its dashboard.
  const userAds = useMemo(() => {
    return currentUser ? ads.filter(ad => ad.ownerId === currentUser.id) : [];
  }, [ads, currentUser]);

  // Handlers
  const handleToggleSave = async (adId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      setAuthActionContext({ type: 'profile' });
      setPendingAction(null);
      setIsAuthModalOpen(true);
      return;
    }

    const previousIds = savedAdIds;
    const nextIds = savedAdIds.includes(adId)
      ? savedAdIds.filter(id => id !== adId)
      : [...savedAdIds, adId];
    setSavedAdIds(nextIds);
    try {
      const persistedIds = await saveAdIds(nextIds);
      setSavedAdIds(persistedIds);
      showToast(nextIds.includes(adId) ? 'Listing saved.' : 'Listing removed from saved.', 'info');
    } catch (error) {
      setSavedAdIds(previousIds);
      showToast(error instanceof Error ? error.message : 'Could not update saved listings.', 'info');
    }
  };

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: null,
      selectedSubcategory: null,
      selectedCity: 'All India',
      minPrice: null,
      maxPrice: null,
      condition: null,
      sortBy: 'recommended',
      onlyVerified: false,
      onlyUrgent: false
    });
    showToast('Filters reset to default', 'info');
  };

  // Login Gate Helper
  const handleRequireLogin = (
    type: 'sell' | 'profile' | 'chat',
    ad?: AdItem
  ): boolean => {
    if (!currentUser) {
      setAuthActionContext({
        type,
      });
      setPendingAction({ type, ad });
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Welcome, ${user.name}! Successfully signed in.`, 'success');

    // Execute pending action if any
    if (pendingAction) {
      if (pendingAction.type === 'sell') {
        setIsSellModalOpen(true);
      } else if (pendingAction.type === 'profile') {
        setIsUserProfileModalOpen(true);
      } else if (pendingAction.type === 'chat') {
        setIsChatModalOpen(true);
        if (pendingAction.ad) void handleCreateConversation(pendingAction.ad);
      }
      setPendingAction(null);
      setAuthActionContext(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      showToast('Signed out of ReuseX', 'info');
    } catch {
      showToast('Unable to sign out. Please try again.', 'info');
    }
  };

  const handleUpdateUserProfile = async (updated: UserProfile) => {
    try {
      const savedProfile = await updateAccountProfile(updated);
      setCurrentUser(savedProfile);
      showToast('Profile updated.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update your profile.', 'info');
      throw error;
    }
  };

  const handleContactSeller = (ad: AdItem) => {
    const phone = ad.seller.phone.replace(/[^+\d]/g, '');
    if (!phone) {
      showToast('This seller has not added a phone number.', 'info');
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const handleBuyNow = (ad: AdItem) => handleContactSeller(ad);

  const handleCreateConversation = async (ad: AdItem) => {
    if (ad.ownerId === currentUser?.id) {
      showToast('You cannot message yourself about your own listing.', 'info');
      return;
    }

    try {
      const conversation = await openConversation(ad.id);
      setConversations((existing) => [conversation, ...existing.filter((item) => item.id !== conversation.id)]);
      setActiveConversationId(conversation.id);
      setSelectedAdForDetail(null);
      setIsChatModalOpen(true);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not start the conversation.', 'info');
    }
  };

  const handleStartConversation = (ad: AdItem) => {
    if (!handleRequireLogin('chat', ad)) return;
    void handleCreateConversation(ad);
  };

  const handleOpenInbox = async () => {
    if (!handleRequireLogin('chat')) return;
    setIsChatModalOpen(true);
    setIsLoadingChats(true);
    try {
      const items = await getConversations();
      setConversations(items);
      if (!activeConversationId && items.length > 0) setActiveConversationId(items[0].id);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load messages.', 'info');
    } finally {
      setIsLoadingChats(false);
    }
  };

  const handleSendMessage = async (conversationId: string, text: string) => {
    const conversation = await sendChatMessage(conversationId, text);
    setConversations((existing) => [conversation, ...existing.filter((item) => item.id !== conversation.id)]);
    setActiveConversationId(conversation.id);
  };

  // Open Sell Modal with Login Gate
  const handleOpenSell = () => {
    if (!handleRequireLogin('sell')) return;
    setIsSellModalOpen(true);
  };

  // Post New Ad
  const handlePostAd = async (newAd: NewAdInput) => {
    if (!currentUser) throw new Error('Sign in before publishing a listing.');
    try {
      const savedAd = await createAd(newAd);
      setAds((currentAds) => [savedAd, ...currentAds]);
      setIsSellModalOpen(false);
      showToast('Your listing has been published.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not publish your listing.', 'info');
      throw error;
    }
  };

  const handleMarkSold = async (adId: string) => {
    if (!currentUser) return;
    try {
      const updatedAd = await updateAd(adId, { status: 'sold' });
      setAds((currentAds) => currentAds.map(ad => ad.id === adId ? updatedAd : ad));
      showToast('Listing marked as sold.', 'info');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update the listing.', 'info');
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!currentUser) return;
    try {
      await deleteAd(adId);
      setAds((currentAds) => currentAds.filter(ad => ad.id !== adId));
      showToast('Listing removed.', 'info');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not remove the listing.', 'info');
    }
  };

  const handleUpdatePrice = async (adId: string, newPrice: number) => {
    if (!currentUser) return;
    try {
      const updatedAd = await updateAd(adId, { price: newPrice });
      setAds((currentAds) => currentAds.map(ad => ad.id === adId ? updatedAd : ad));
      showToast('Listing price updated.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update the listing.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-teal-200 selection:text-teal-900">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        selectedCity={filters.selectedCity}
        onSelectCity={(city) => handleUpdateFilters({ selectedCity: city })}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleUpdateFilters({ searchQuery: q })}
        selectedCategory={filters.selectedCategory}
        onSelectCategory={(cat) => handleUpdateFilters({ selectedCategory: cat, selectedSubcategory: null })}
        savedCount={savedAdIds.length}
        chatCount={conversations.length}
        onOpenSaved={() => setIsSavedAdsModalOpen(true)}
        onOpenChats={() => void handleOpenInbox()}
        onOpenSell={handleOpenSell}
        onOpenMyAds={() => {
          if (!handleRequireLogin('profile')) return;
          setIsMyAdsModalOpen(true);
        }}
        onOpenSafetyGuide={() => setIsSafetyGuideModalOpen(true)}
        userAdsCount={userAds.length}
        currentUser={currentUser}
        onOpenAuth={(ctx) => {
          setAuthActionContext(ctx || null);
          setIsAuthModalOpen(true);
        }}
        onOpenUserProfile={() => {
          if (!handleRequireLogin('profile')) return;
          setIsUserProfileModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Category Horizontal Bar */}
      <CategoryNav
        selectedCategory={filters.selectedCategory}
        onSelectCategory={(cat) => handleUpdateFilters({ selectedCategory: cat, selectedSubcategory: null })}
        selectedSubcategory={filters.selectedSubcategory}
        onSelectSubcategory={(sub) => handleUpdateFilters({ selectedSubcategory: sub })}
      />

      {/* Promotional Banners & Safety notice */}
      <BannerPromo
        onOpenSell={handleOpenSell}
        onOpenSafetyGuide={() => setIsSafetyGuideModalOpen(true)}
        onSelectCategory={(cat) => handleUpdateFilters({ selectedCategory: cat, selectedSubcategory: null })}
      />

      {/* Main App Feed Section */}
      <main className="max-w-7xl mx-auto px-4 py-4 w-full flex-1">
        
        {/* Results Bar & Sort controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
              {filters.selectedCategory 
                ? `Fresh Recommendations in ${filters.selectedCategory.toUpperCase()}`
                : 'Fresh Recommendations in India'}
            </h1>
            <span className="text-xs text-slate-500 font-medium">
              ({filteredAds.length} listings)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold hidden sm:inline">SORT BY:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleUpdateFilters({ sortBy: e.target.value as any })}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
              >
                <option value="recommended">Featured / Recommended</option>
                <option value="newest">Date: Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Inquired / Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Main Feed Layout (Sidebar + Ad Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Desktop Filter Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <FilterSidebar
                filters={filters}
                onUpdateFilters={handleUpdateFilters}
                onResetFilters={handleResetFilters}
                totalResultsCount={filteredAds.length}
              />
            </div>
          </div>

          {/* Mobile Filter Collapse */}
          {showMobileFilters && (
            <div className="lg:hidden col-span-1">
              <FilterSidebar
                filters={filters}
                onUpdateFilters={handleUpdateFilters}
                onResetFilters={handleResetFilters}
                totalResultsCount={filteredAds.length}
              />
            </div>
          )}

          {/* Listings Grid (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Active filter badges */}
            {(filters.selectedCategory || filters.selectedCity !== 'All India' || filters.condition || filters.minPrice !== null || filters.maxPrice !== null || filters.onlyVerified || filters.onlyUrgent || filters.searchQuery) && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold">Active:</span>
                
                {filters.searchQuery && (
                  <span className="bg-teal-50 border border-teal-200 text-teal-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    &quot;{filters.searchQuery}&quot;
                    <button onClick={() => handleUpdateFilters({ searchQuery: '' })} className="hover:text-rose-600">&times;</button>
                  </span>
                )}

                {filters.selectedCity !== 'All India' && (
                  <span className="bg-teal-50 border border-teal-200 text-teal-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    📍 {filters.selectedCity}
                    <button onClick={() => handleUpdateFilters({ selectedCity: 'All India' })} className="hover:text-rose-600">&times;</button>
                  </span>
                )}

                {filters.selectedCategory && (
                  <span className="bg-teal-50 border border-teal-200 text-teal-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    📂 {filters.selectedCategory}
                    <button onClick={() => handleUpdateFilters({ selectedCategory: null, selectedSubcategory: null })} className="hover:text-rose-600">&times;</button>
                  </span>
                )}

                {filters.condition && (
                  <span className="bg-teal-50 border border-teal-200 text-teal-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    Condition: {filters.condition}
                    <button onClick={() => handleUpdateFilters({ condition: null })} className="hover:text-rose-600">&times;</button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-teal-700 hover:text-teal-900 font-bold underline ml-1 text-xs"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {isLoadingAds ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                Loading listings...
              </div>
            ) : filteredAds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAds.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    isSaved={savedAdIds.includes(ad.id)}
                    onToggleSave={handleToggleSave}
                    onClick={(clickedAd) => setSelectedAdForDetail(clickedAd)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <SearchX className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {adsLoadError || (ads.length === 0 ? 'No listings yet' : `No matching classifieds found in ${filters.selectedCity}`)}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {adsLoadError ? 'Check the API and MongoDB connection, then reload the page.' : ads.length === 0 ? 'Listings posted by users will appear here.' : 'Try broadening your search criteria or resetting filters.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                  <button
                    onClick={handleOpenSell}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post First Ad in this Category</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Quick Load / Banner */}
            <div className="p-4 bg-linear-to-r from-teal-900 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Have unused goods lying around at home?</h4>
                  <p className="text-xs text-teal-200">Add your item photos, details, location, and asking price.</p>
                </div>
              </div>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer whitespace-nowrap"
              >
                + Post Free Classified Ad
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer
        onSelectCity={(city) => {
          handleUpdateFilters({ selectedCity: city });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(cat) => {
          handleUpdateFilters({ selectedCategory: cat, selectedSubcategory: null });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSafetyGuide={() => setIsSafetyGuideModalOpen(true)}
        onOpenSell={handleOpenSell}
      />

      {/* MODALS */}
      {/* 1. Ad Details Modal */}
      {selectedAdForDetail && (
        <AdDetailModal
          ad={selectedAdForDetail}
          isSaved={savedAdIds.includes(selectedAdForDetail.id)}
          onToggleSave={(adId) => handleToggleSave(adId)}
          onClose={() => setSelectedAdForDetail(null)}
          onStartChat={(ad) => void handleStartConversation(ad)}
          onBuyNow={(ad) => handleBuyNow(ad)}
          onOpenSafetyGuide={() => setIsSafetyGuideModalOpen(true)}
        />
      )}

      {/* 2. Sell / Post Ad Modal */}
      {isSellModalOpen && (
        <SellModal
          user={currentUser!}
          onClose={() => setIsSellModalOpen(false)}
          onPostAd={handlePostAd}
        />
      )}

      {isChatModalOpen && currentUser && (
        <ChatModal
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUserId={currentUser.id}
          isLoading={isLoadingChats}
          onSelectConversation={setActiveConversationId}
          onSendMessage={handleSendMessage}
          onClose={() => setIsChatModalOpen(false)}
        />
      )}

      {/* 5. My Classifieds Dashboard */}
      {isMyAdsModalOpen && (
        <MyAdsModal
          ads={userAds}
          onClose={() => setIsMyAdsModalOpen(false)}
          onOpenSell={handleOpenSell}
          onSelectAd={(ad) => {
            setIsMyAdsModalOpen(false);
            setSelectedAdForDetail(ad);
          }}
          onMarkSold={handleMarkSold}
          onDeleteAd={handleDeleteAd}
          onUpdatePrice={handleUpdatePrice}
        />
      )}

      {/* 6. Saved / Favorites Wishlist Modal */}
      {isSavedAdsModalOpen && (
        <SavedAdsModal
          savedAds={savedAds}
          onClose={() => setIsSavedAdsModalOpen(false)}
          onSelectAd={(ad) => {
            setIsSavedAdsModalOpen(false);
            setSelectedAdForDetail(ad);
          }}
          onRemoveSaved={(adId) => handleToggleSave(adId)}
        />
      )}

      {/* 7. Buyer & Seller Safety Guide */}
      {isSafetyGuideModalOpen && (
        <SafetyGuideModal
          onClose={() => setIsSafetyGuideModalOpen(false)}
        />
      )}

      {/* 8. Authentication & Login Modal / Page */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
          setAuthActionContext(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        actionContext={authActionContext}
      />

      {/* 9. User Profile & Account Info Modal */}
      {currentUser && (
        <UserProfileModal
          user={currentUser}
          isOpen={isUserProfileModalOpen}
          onClose={() => setIsUserProfileModalOpen(false)}
          onUpdateUser={handleUpdateUserProfile}
          onLogout={handleLogout}
          userAdsCount={userAds.length}
          savedCount={savedAdIds.length}
          onOpenMyAds={() => setIsMyAdsModalOpen(true)}
          onOpenSaved={() => setIsSavedAdsModalOpen(true)}
        />
      )}

    </div>
  );
}
