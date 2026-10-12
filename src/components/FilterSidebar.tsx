import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  SlidersHorizontal,
  IndianRupee
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { INDIAN_LOCATIONS } from '../data/locations';
import { FilterState, ItemCondition } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

const CONDITIONS: ItemCondition[] = ['New', 'Like New', 'Gently Used', 'Used - Fair'];

const PRICE_PRESETS = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹50,000', min: 10000, max: 50000 },
  { label: '₹50,000 - ₹2 Lakh', min: 50000, max: 200000 },
  { label: '₹2 Lakh - ₹10 Lakh', min: 200000, max: 1000000 },
  { label: 'Above ₹10 Lakh', min: 1000000, max: null }
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalResultsCount
}) => {
  return (
    <aside className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <span>Filters</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            {totalResultsCount} ads
          </span>
        </div>
        <button
          id="reset-filters-btn"
          onClick={onResetFilters}
          className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="py-3 border-b border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Categories
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onUpdateFilters({ selectedCategory: null, selectedSubcategory: null })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
              filters.selectedCategory === null ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {filters.selectedCategory === null && <Check className="w-3.5 h-3.5 text-teal-600" />}
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onUpdateFilters({ 
                  selectedCategory: isSelected ? null : cat.id, 
                  selectedSubcategory: null 
                })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div className="py-3 border-b border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Location (City)
        </label>
        <select
          value={filters.selectedCity}
          onChange={(e) => onUpdateFilters({ selectedCity: e.target.value })}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-teal-600"
        >
          {INDIAN_LOCATIONS.map((loc) => (
            <option key={loc.city} value={loc.city}>
              {loc.city} ({loc.state})
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="py-3 border-b border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Budget / Price Range (₹)
        </label>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice ?? ''}
              onChange={(e) => onUpdateFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
              className="w-full text-xs pl-2.5 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-teal-600"
            />
          </div>
          <span className="text-slate-400 text-xs">to</span>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice ?? ''}
              onChange={(e) => onUpdateFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
              className="w-full text-xs pl-2.5 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        {/* Quick price chips */}
        <div className="flex flex-wrap gap-1">
          {PRICE_PRESETS.map((preset, idx) => {
            const isActive = filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={idx}
                onClick={() => onUpdateFilters({ minPrice: preset.min, maxPrice: preset.max })}
                className={`text-[11px] px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-teal-700 text-white font-semibold' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Condition */}
      <div className="py-3 border-b border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Item Condition
        </label>
        <div className="space-y-1.5">
          {CONDITIONS.map((cond) => {
            const isChecked = filters.condition === cond;
            return (
              <label 
                key={cond}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onUpdateFilters({ condition: isChecked ? null : cond })}
                  className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                />
                <span>{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="pt-3 space-y-2">
        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Sellers Only</span>
          </span>
          <input
            type="checkbox"
            checked={filters.onlyVerified}
            onChange={(e) => onUpdateFilters({ onlyVerified: e.target.checked })}
            className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none">
          <span className="flex items-center gap-1.5 font-medium">
            <Zap className="w-4 h-4 text-rose-500" />
            <span>Urgent / Fast Deals</span>
          </span>
          <input
            type="checkbox"
            checked={filters.onlyUrgent}
            onChange={(e) => onUpdateFilters({ onlyUrgent: e.target.checked })}
            className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
};
