import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Smartphone, 
  Car, 
  Bike, 
  Home, 
  HelpCircle,
  Heart
} from 'lucide-react';

interface FooterProps {
  onSelectCity: (city: string) => void;
  onSelectCategory: (cat: string) => void;
  onOpenSafetyGuide: () => void;
  onOpenSell: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCity,
  onSelectCategory,
  onOpenSafetyGuide,
  onOpenSell
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12">
      {/* Upper Footer: Categorized Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Popular Locations */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Popular Locations
            </h4>
            <ul className="space-y-2">
              {['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Ahmedabad', 'Kolkata'].map((city) => (
                <li key={city}>
                  <button
                    onClick={() => onSelectCity(city)}
                    className="hover:text-teal-400 transition-colors text-left"
                  >
                    {city} Classifieds
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Trending Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Trending Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('cars')} className="hover:text-teal-400 transition-colors">
                  Used Cars for Sale
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bikes')} className="hover:text-teal-400 transition-colors">
                  Bikes &amp; Scooters
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('mobiles')} className="hover:text-teal-400 transition-colors">
                  Smartphones &amp; Tablets
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('properties')} className="hover:text-teal-400 transition-colors">
                  Houses &amp; Apartments
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('electronics')} className="hover:text-teal-400 transition-colors">
                  Laptops &amp; Appliances
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('furniture')} className="hover:text-teal-400 transition-colors">
                  Home &amp; Office Furniture
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: About ReuseX */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              About ReuseX
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">About ReuseX Group</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Careers at ReuseX</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Contact Support</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">ReuseX for Businesses</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Community Standards</span></li>
            </ul>
          </div>

          {/* Col 4: Safety & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Trust &amp; Safety
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenSafetyGuide} className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Buyer Safety Guide
                </button>
              </li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Legal &amp; Privacy Policy</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Terms of Use</span></li>
              <li><span className="hover:text-teal-400 transition-colors cursor-pointer">Vulnerability Disclosure</span></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 py-4 px-4 border-t border-slate-800 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-white font-black tracking-tight">REUSE<span className="text-teal-500">X</span> INDIA</span>
            <span>&bull;</span>
            <span>Connecting local buyers &amp; sellers nationwide</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} ReuseX India Classifieds Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
