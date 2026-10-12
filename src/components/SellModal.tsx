import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  IndianRupee, 
  Check, 
  Image as ImageIcon, 
  Trash2, 
  Car, 
  Smartphone, 
  Bike, 
  Tv, 
  Home, 
  Armchair, 
  Shirt, 
  Dumbbell, 
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { INDIAN_LOCATIONS } from '../data/locations';
import { ItemCondition, UserProfile } from '../types';
import { NewAdInput } from '../services/ads';

interface SellModalProps {
  user: UserProfile;
  onClose: () => void;
  onPostAd: (newAd: NewAdInput) => Promise<void>;
}

export const SellModal: React.FC<SellModalProps> = ({ user, onClose, onPostAd }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('mobiles');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Mobile Phones');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [selectedCity, setSelectedCity] = useState('');
  const [locality, setLocality] = useState('');
  const [pincode, setPincode] = useState('');
  
  // Custom Specs
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [fuelOrStorage, setFuelOrStorage] = useState('');
  const [kmDriven, setKmDriven] = useState('');

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Seller info
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubcategory(cat.subcategories[0]);
    }
  };

  const handleAddCustomPhoto = () => {
    if (photos.length >= 5) {
      setErrorMessage('A listing can include up to 5 photos.');
      return;
    }
    try {
      const photoUrl = new URL(customPhotoInput);
      if (photoUrl.protocol !== 'https:') throw new Error('HTTPS required');
      setPhotos([...photos, photoUrl.toString()]);
      setCustomPhotoInput('');
      setErrorMessage('');
    } catch {
      setErrorMessage('Enter a valid HTTPS photo URL.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (photos.length === 0) {
      setErrorMessage('Add at least one real product photo URL before publishing.');
      return;
    }
    if (!selectedCity || !locality.trim() || price === '') {
      setErrorMessage('Enter a price, city, and locality before publishing.');
      return;
    }

    const newAd: NewAdInput = {
      title,
      description,
      price: Number(price),
      isNegotiable,
      categoryId: selectedCategory,
      subcategory: selectedSubcategory,
      images: photos,
      location: {
        city: selectedCity,
        state: INDIAN_LOCATIONS.find(l => l.city === selectedCity)?.state || '',
        locality: locality.trim(),
        pincode
      },
      condition,
      urgent: false,
      specs: {
        ...(brand.trim() ? { 'Brand': brand.trim() } : {}),
        ...(selectedCategory === 'cars' || selectedCategory === 'bikes'
          ? { ...(year.trim() ? { 'Year': year.trim() } : {}), ...(kmDriven.trim() ? { 'KM Driven': kmDriven.trim() } : {}) }
          : {}),
        ...(selectedCategory === 'mobiles' || selectedCategory === 'electronics'
          ? (fuelOrStorage.trim() ? { 'Variant/Storage': fuelOrStorage.trim() } : {})
          : {})
      },
    };

    setIsSubmitting(true);
    try {
      await onPostAd(newAd);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not publish the listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-black text-slate-950">
              RX
            </div>
            <div>
              <h2 className="text-base font-bold">Post Your Free Ad on ReuseX</h2>
              <p className="text-xs text-teal-300">Reach millions of buyers across India in minutes</p>
            </div>
          </div>
          <button
            id="close-sell-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Step Progress */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-bold text-slate-500">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-700 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}>1</span>
              <span>Category</span>
            </div>
            <span className="text-slate-300">&bull;</span>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-700 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}>2</span>
              <span>Details &amp; Photos</span>
            </div>
            <span className="text-slate-300">&bull;</span>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-700 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}>3</span>
              <span>Price &amp; Location</span>
            </div>
          </div>

          {/* STEP 1: Choose Category */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Main Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-100 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="text-xs font-bold">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{cat.hindiName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {activeCategory.subcategories.length > 0 && (
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Subcategory *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.subcategories.map((sub) => (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedSubcategory === sub
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Next: Item Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Item Details & Photos */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Ad Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Ad Title * (Include brand, model, key feature)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple iPhone 15 Pro Max 256GB Natural Titanium (Indian Bill)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apple / Mahindra / Sony"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  >
                    <option value="New">Brand New (Sealed)</option>
                    <option value="Like New">Like New (Spotless)</option>
                    <option value="Gently Used">Gently Used (Minor signs)</option>
                    <option value="Used - Fair">Used - Fair (Working)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Year / Variant (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 / 256GB"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your item, accessories included, reason for selling, warranty status, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white leading-relaxed"
                ></textarea>
              </div>

              {/* Photos Showcase & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Upload Photos (Add up to 5 clear images) *
                </label>
                
                {/* Photo Previews */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {photos.map((photoUrl, idx) => (
                    <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add real photo URL */}
                  <div className="flex flex-col gap-1 aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 p-2 items-center justify-center text-center bg-slate-50">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] text-slate-500 font-semibold">Image URL</span>
                  </div>
                </div>

                {/* Direct image url add */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste an HTTPS URL for your product photo"
                    value={customPhotoInput}
                    onChange={(e) => setCustomPhotoInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPhoto}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {errorMessage && <p role="alert" className="text-xs font-semibold text-rose-700">{errorMessage}</p>}
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Next: Price &amp; Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Price, Location & Contact */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Set Price */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1.5">
                  Set Your Asking Price (₹ INR) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-extrabold text-slate-800 text-lg">₹</span>
                  <input
                    type="number"
                    required
                    min={100}
                    placeholder="Enter amount (e.g. 45000)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full text-lg font-black pl-8 pr-4 py-2.5 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-teal-600 text-slate-950"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-amber-950 mt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>Allow buyers to make counter offers (Negotiable Price)</span>
                </label>
              </div>

              {/* Location selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    City *
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-medium"
                    required
                  >
                    <option value="" disabled>Select a city</option>
                    {INDIAN_LOCATIONS.filter(l => l.city !== 'All India').map((loc) => (
                      <option key={loc.city} value={loc.city}>
                        {loc.city} ({loc.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Locality / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indiranagar / Bandra"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 560038"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Seller Contact Info */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Account Contact Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={user.name}
                      readOnly
                      className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Phone Number (Shown to interested buyers)
                    </label>
                    <input
                      type="text"
                      required
                      value={user.phone}
                      readOnly
                      className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Safety acknowledgement */}
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  By posting, you agree to ReuseX Terms &amp; Safety Guidelines. Your ad will be visible immediately to buyers.
                </span>
              </div>

              {/* Post Ad CTA */}
              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
                >
                  &larr; Back
                </button>
                <button
                  id="submit-post-ad-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
                </button>
              </div>
              {errorMessage && <p role="alert" className="text-right text-xs font-semibold text-rose-700">{errorMessage}</p>}
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
