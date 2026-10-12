import React from 'react';
import { 
  Car, 
  Bike, 
  Smartphone, 
  Tv, 
  Home, 
  Armchair, 
  Shirt, 
  Dumbbell, 
  Briefcase,
  ChevronRight,
  Layers,
  Sparkles,
  Flame
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { Category } from '../types';

interface CategoryNavProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  selectedSubcategory: string | null;
  onSelectSubcategory: (subcategory: string | null) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
}) => {
  // Helper to render Lucide icon dynamically
  const getCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Car': return <Car className={className} />;
      case 'Bike': return <Bike className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Armchair': return <Armchair className={className} />;
      case 'Shirt': return <Shirt className={className} />;
      case 'Dumbbell': return <Dumbbell className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      default: return <Layers className={className} />;
    }
  };

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Category Horizontal Nav */}
        <div className="flex items-center justify-start gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          <button
            id="cat-all-btn"
            onClick={() => {
              onSelectCategory(null);
              onSelectSubcategory(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                id={`cat-${category.id}-btn`}
                onClick={() => {
                  if (isSelected) {
                    onSelectCategory(null);
                    onSelectSubcategory(null);
                  } else {
                    onSelectCategory(category.id);
                    onSelectSubcategory(null);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-teal-800'
                }`}
              >
                {getCategoryIcon(category.icon, "w-4 h-4")}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Subcategories & Popular Quick Tags (Active when category is chosen) */}
        {activeCategoryObj && (
          <div className="py-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <span>{activeCategoryObj.name} Subcategories:</span>
            </span>

            <button
              onClick={() => onSelectSubcategory(null)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedSubcategory === null
                  ? 'bg-teal-100 text-teal-800 font-bold border border-teal-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All in {activeCategoryObj.name}
            </button>

            {activeCategoryObj.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => onSelectSubcategory(selectedSubcategory === sub ? null : sub)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedSubcategory === sub
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}

            {/* Popular tags */}
            <div className="hidden md:flex items-center gap-1.5 ml-auto text-xs text-slate-500">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-slate-600">Trending:</span>
              {activeCategoryObj.popularTags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-slate-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
