export interface CityLocation {
  city: string;
  state: string;
  isTopCity: boolean;
  localities: string[];
}

export const INDIAN_LOCATIONS: CityLocation[] = [
  {
    city: 'All India',
    state: 'National',
    isTopCity: true,
    localities: ['All Localities']
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    isTopCity: true,
    localities: ['Bandra West', 'Andheri East', 'Powai', 'Juhu', 'Worli', 'Thane West', 'Borivali West', 'Navi Mumbai (Vashi)']
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    isTopCity: true,
    localities: ['South Extension', 'Connaught Place', 'Dwarka Sector 12', 'Gurugram Sector 54', 'Noida Sector 62', 'Rohini', 'Hauz Khas']
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    isTopCity: true,
    localities: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City', 'Bellandur', 'Hebbal']
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    isTopCity: true,
    localities: ['Gachibowli', 'Hitec City', 'Jubilee Hills', 'Banjara Hills', 'Madhapur', 'Kukatpally', 'Secunderabad']
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    isTopCity: true,
    localities: ['Koregaon Park', 'Kothrud', 'Baner', 'Viman Nagar', 'Hinjawadi', 'Wakad', 'Aundh', 'Hadapsar']
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    isTopCity: true,
    localities: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Besant Nagar', 'OMR Road', 'Nungambakkam']
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    isTopCity: true,
    localities: ['Satellite', 'SG Highway', 'Bodakdev', 'Vastrapur', 'Maninagar', 'Prahlad Nagar', 'Navrangpura']
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    isTopCity: true,
    localities: ['Salt Lake Sector V', 'Park Street', 'New Town', 'Ballygunge', 'Alipore', 'Dum Dum', 'Gariahat']
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    isTopCity: false,
    localities: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C Scheme', 'Raja Park', 'Tonk Road']
  },
  {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    isTopCity: false,
    localities: ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Vikas Nagar']
  },
  {
    city: 'Chandigarh',
    state: 'Punjab / Haryana',
    isTopCity: false,
    localities: ['Sector 17', 'Sector 35', 'Sector 8', 'Mohali Phase 7', 'Panchkula Sector 20']
  },
  {
    city: 'Kochi',
    state: 'Kerala',
    isTopCity: false,
    localities: ['Kakkanad (Infopark)', 'Marine Drive', 'Panampilly Nagar', 'Edappally', 'Fort Kochi']
  },
  {
    city: 'Indore',
    state: 'Madhya Pradesh',
    isTopCity: false,
    localities: ['Vijay Nagar', 'Palasia', 'AB Road', 'Rau', 'Bhawarkua']
  }
];
