import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { registerAccount, signIn } from '../services/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  actionContext?: {
    type: 'buy' | 'offer' | 'chat' | 'sell' | 'profile';
    itemTitle?: string;
    itemPrice?: number;
  } | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  actionContext
}) => {
  const [tab, setTab] = useState<'email' | 'signup'>('email');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);
    try {
      onLoginSuccess(await signIn(emailInput, passwordInput));
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);
    try {
      onLoginSuccess(await registerAccount({
        name: fullName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
        city: signupCity
      }));
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Branding */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-teal-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
              RX
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-none text-white">
                REUSE<span className="text-teal-400">X</span> INDIA
              </h3>
              <p className="text-[10px] text-teal-300 font-semibold uppercase tracking-wider mt-0.5">
                Marketplace Account
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {tab === 'signup' 
              ? 'Create your free account to buy, sell, and chat directly with verified users across India.' 
              : 'Sign in to save listings, manage your ads, and contact sellers.'}
          </p>
        </div>

        {/* Dynamic Context Banner when triggered by Gated Actions */}
        {actionContext && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {actionContext.type === 'buy' && 'Login Required to Buy this Product'}
                {actionContext.type === 'offer' && 'Login Required to Make an Offer'}
                {actionContext.type === 'chat' && 'Login Required to Message the Seller'}
                {actionContext.type === 'sell' && 'Login Required to Post an Ad'}
                {actionContext.type === 'profile' && 'Login to View User Profile'}
              </p>
              {actionContext.itemTitle && (
                <p className="text-amber-800 line-clamp-1 mt-0.5 font-medium">
                  &ldquo;{actionContext.itemTitle}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab Selectors */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => { setTab('email'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'email' 
                ? 'border-teal-600 text-teal-800 bg-white' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-teal-600" />
            <span>Email</span>
          </button>
          <button
            onClick={() => { setTab('signup'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'signup' 
                ? 'border-teal-600 text-teal-800 bg-white' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span>Register</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email sign-in */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isVerifying ? 'Signing in...' : 'Sign In with Email'}
              </button>
            </form>
          )}

          {/* Account registration */}
          {tab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="e.g. solankeradhesham522@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 12 characters"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={72}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                {isVerifying ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}

          <div className="flex items-center gap-1.5 justify-center text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted &amp; Protected by ReuseX Trust &amp; Safety</span>
          </div>

        </div>
      </div>
    </div>
  );
};
