import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cars',
    name: 'Cars & Vehicles',
    hindiName: 'कारें एवं गाड़ियाँ',
    icon: 'Car',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    subcategories: ['Cars', 'Commercial & Other Vehicles', 'Spare Parts & Accessories', 'Trailers & Caravans'],
    popularTags: ['Thar 4x4', 'Creta 2022', 'Swift Dzire', 'Honda City', 'Automatic Cars', 'Under 5 Lakhs']
  },
  {
    id: 'bikes',
    name: 'Bikes & Scooters',
    hindiName: 'मोटरसाइकिल और स्कूटर',
    icon: 'Bike',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    subcategories: ['Motorcycles', 'Scooters', 'Bicycles & Electric Cycles', 'Spare Parts & Helmets'],
    popularTags: ['Royal Enfield Classic 350', 'Activa 6G', 'KTM Duke 390', 'Yamaha R15 V4', 'Jupiter 125', 'EV Scooters']
  },
  {
    id: 'mobiles',
    name: 'Mobiles & Tablets',
    hindiName: 'मोबाइल और टैबलेट',
    icon: 'Smartphone',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    subcategories: ['Mobile Phones', 'Tablets & iPads', 'Smart Watches', 'Mobile Accessories'],
    popularTags: ['iPhone 15 Pro', 'Samsung S24 Ultra', 'OnePlus 12', 'iPad Pro 11"', 'Apple Watch Ultra', 'Pixel 8']
  },
  {
    id: 'electronics',
    name: 'Electronics & Appliances',
    hindiName: 'इलेक्ट्रॉनिक्स और उपकरण',
    icon: 'Tv',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    subcategories: ['Computers & Laptops', 'TVs, Video - Audio', 'Kitchen Appliances', 'Cameras & Lenses', 'ACs & Refrigerators', 'Washing Machines'],
    popularTags: ['MacBook Pro M2', 'Sony 55" 4K TV', 'Sony A7 IV DSLR', 'PlayStation 5', 'Gaming PC', 'Double Door Fridge']
  },
  {
    id: 'properties',
    name: 'Real Estate & Properties',
    hindiName: 'मकान और प्रॉपर्टी',
    icon: 'Home',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    subcategories: ['For Sale: Houses & Apartments', 'For Rent: Houses & Apartments', 'Lands & Plots', 'PG & Guest Houses', 'Commercial Properties'],
    popularTags: ['2 BHK Flat Mumbai', '3 BHK Indiranagar', 'Furnished Studio Flat', 'Independent Villa', 'Commercial Shop']
  },
  {
    id: 'furniture',
    name: 'Furniture & Home Decor',
    hindiName: 'फर्नीचर और घर की सजावट',
    icon: 'Armchair',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    subcategories: ['Sofa & Dining Sets', 'Beds & Wardrobes', 'Home Decor & Lighting', 'Kids & Study Furniture', 'Office Chairs & Desks'],
    popularTags: ['L-Shape Leather Sofa', 'King Size Teak Bed', 'Ergonomic Mesh Chair', 'Solid Wood Dining Table', 'Recliner']
  },
  {
    id: 'fashion',
    name: 'Fashion & Lifestyle',
    hindiName: 'फैशन और लाइफस्टाइल',
    icon: 'Shirt',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    subcategories: ['Men Fashion', 'Women Ethnic & Western', 'Watches & Jewellery', 'Footwear', 'Luggage & Bags'],
    popularTags: ['Designer Sherwani', 'Rolex / Tissot Watches', 'Sneakers Air Jordan', 'Bridal Lehenga', 'Leather Jackets']
  },
  {
    id: 'hobbies',
    name: 'Sports, Books & Hobbies',
    hindiName: 'खेल, किताबें और शौक',
    icon: 'Dumbbell',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    subcategories: ['Gym & Fitness Equipment', 'Musical Instruments', 'Books & Magazines', 'Sports Equipment', 'Gaming Consoles'],
    popularTags: ['Acoustic Guitar Yamaha', 'Adjustable Dumbbells Set', 'Electric Treadmill', 'Rare Comic Books', 'Badminton Racket']
  },
  {
    id: 'services',
    name: 'Commercial & Services',
    hindiName: 'सेवाएं और नौकरियाँ',
    icon: 'Briefcase',
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    subcategories: ['Home Services & Repair', 'Packers & Movers', 'Tuition & Classes', 'Driver & Domestic Help', 'Freelance & Tech'],
    popularTags: ['Home Deep Cleaning', 'Packers & Movers Pune', 'AC Repair & Gas Refill', 'Maths Tutor', 'Wedding Photographer']
  }
];
