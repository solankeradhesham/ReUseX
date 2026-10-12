import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Edit2, 
  CheckCircle2, 
  LogOut, 
  Store, 
  Heart,
  ExternalLink,
  Save,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => Promise<void>;
  onLogout: () => void;
  userAdsCount: number;
  savedCount: number;
  onOpenMyAds: () => void;
  onOpenSaved: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  onLogout,
  userAdsCount,
  savedCount,
  onOpenMyAds,
  onOpenSaved
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [city, setCity] = useState(user.city);
  const [address, setAddress] = useState(user.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    try {
      await onUpdateUser({
        ...user,
        name,
        email,
        phone,
        city,
        address
      });
      setIsEditing(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not update your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-linear-to-r from-teal-900 via-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white/20 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-black ring-4 ring-white/20">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 ${user.verified ? 'bg-emerald-500' : 'bg-slate-500'} text-white p-1 rounded-full ring-2 ring-slate-900`} title={user.verified ? 'Verified Member' : 'Identity not verified'}>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white truncate">{user.name}</h3>
                <span className={`px-2 py-0.5 ${user.verified ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'} text-[10px] font-bold rounded-md border`}>
                  {user.verified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
              <p className="text-xs text-teal-200 truncate mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {user.city}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Member since {user.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats bar */}
        <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 text-center divide-x divide-slate-200">
          <button 
            onClick={() => { onClose(); onOpenMyAds(); }}
            className="p-3 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] font-bold uppercase">
              <Store className="w-3 h-3 text-teal-600" />
              <span>My Ads</span>
            </div>
            <p className="text-lg font-black text-slate-900 mt-0.5">{userAdsCount}</p>
          </button>

          <button 
            onClick={() => { onClose(); onOpenSaved(); }}
            className="p-3 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] font-bold uppercase">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>Wishlist</span>
            </div>
            <p className="text-lg font-black text-slate-900 mt-0.5">{savedCount}</p>
          </button>
        </div>

        {/* Profile Info Details / Edit Form */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Personal Information &amp; Contact
            </h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Info'}</span>
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery / Meetup Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white"
                />
              </div>

              {saveError && (
                <div role="alert" className="flex items-center gap-2 text-xs font-semibold text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-bold uppercase block">Registered Phone</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  {user.phone}
                </span>
                <span className={`text-[10px] ${user.verified ? 'text-emerald-600' : 'text-slate-500'} font-semibold flex items-center gap-0.5`}>
                  {user.verified ? <><CheckCircle2 className="w-3 h-3" /> Verified</> : 'Not verified'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-bold uppercase block">Email Address</span>
                <span className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  {user.email}
                </span>
                <span className={`text-[10px] ${user.verified ? 'text-emerald-600' : 'text-slate-500'} font-semibold flex items-center gap-0.5`}>
                  {user.verified ? <><CheckCircle2 className="w-3 h-3" /> Confirmed</> : 'Not verified'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5 sm:col-span-2">
                <span className="text-[11px] text-slate-400 font-bold uppercase block">Default Delivery / Pickup Address</span>
                <span className="text-xs font-semibold text-slate-800 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </span>
              </div>
            </div>
          )}

          {/* Trust & Badges */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-emerald-950">Account security</h5>
                <p className="text-[11px] text-emerald-800">
                  Your account uses a secure server session. Contact details are not verified yet.
                </p>
              </div>
            </div>
          </div>

          {/* Action Row: Logout */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Session active &bull; India
            </span>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
