export interface Category {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  color: string;
  subcategories: string[];
  popularTags: string[];
}

export type ItemCondition = 'New' | 'Like New' | 'Gently Used' | 'Used - Fair';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  memberSince: string;
  verified: boolean;
  phone: string;
  responseRate: string;
  rating: number;
  totalReviews: number;
  activeAdsCount: number;
  isOnline: boolean;
}

export interface AdItem {
  id: string;
  ownerId?: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  isNegotiable: boolean;
  categoryId: string;
  subcategory: string;
  images: string[];
  location: {
    city: string;
    state: string;
    locality: string;
    pincode?: string;
  };
  condition: ItemCondition;
  postedAt: string; // ISO date string or relative
  featured?: boolean;
  urgent?: boolean;
  verified?: boolean;
  seller: Seller;
  specs?: Record<string, string | number>;
  viewsCount: number;
  likesCount: number;
  status: 'active' | 'sold' | 'under_review';
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedCity: string;
  minPrice: number | null;
  maxPrice: number | null;
  condition: ItemCondition | null;
  sortBy: 'recommended' | 'newest' | 'price_asc' | 'price_desc' | 'popular';
  onlyVerified: boolean;
  onlyUrgent: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  avatar?: string;
  memberSince: string;
  verified: boolean;
  role?: 'buyer' | 'seller';
  address?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  adId: string;
  adTitle: string;
  adPrice: number;
  adImage: string;
  lastMessage: string;
  updatedAt: string;
  otherUser: {
    id: string;
    name: string;
  };
  messages: ChatMessage[];
}

