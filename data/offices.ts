export interface Office {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  state: string;
  district: string;
}

export const officeTypes = [
  { id: "all", label: "All", icon: "map-pin" },
  { id: "collector", label: "Collector", icon: "home" },
  { id: "tehsildar", label: "Tehsildar", icon: "briefcase" },
  { id: "legal-aid", label: "Legal Aid", icon: "shield" },
  { id: "police", label: "Police", icon: "alert-circle" },
  { id: "women-helpline", label: "Women's Help", icon: "heart" },
];

// State bounding boxes (approximate). Used to detect the user's region from GPS
// and to limit map pins/offices to the selected region only.
export const STATE_BBOX: Record<
  string,
  { minLat: number; maxLat: number; minLng: number; maxLng: number }
> = {
  "Andhra Pradesh": { minLat: 12.6, maxLat: 19.9, minLng: 76.7, maxLng: 84.8 },
  "Arunachal Pradesh": { minLat: 26.6, maxLat: 29.5, minLng: 91.5, maxLng: 97.5 },
  Assam: { minLat: 24.1, maxLat: 28.2, minLng: 89.7, maxLng: 96.0 },
  Bihar: { minLat: 24.3, maxLat: 27.5, minLng: 83.3, maxLng: 88.3 },
  Chhattisgarh: { minLat: 17.8, maxLat: 24.1, minLng: 80.2, maxLng: 84.4 },
  Goa: { minLat: 14.85, maxLat: 15.85, minLng: 73.6, maxLng: 74.4 },
  Gujarat: { minLat: 20.1, maxLat: 24.7, minLng: 68.1, maxLng: 74.5 },
  Haryana: { minLat: 27.6, maxLat: 30.95, minLng: 74.4, maxLng: 77.6 },
  "Himachal Pradesh": { minLat: 30.2, maxLat: 33.2, minLng: 75.5, maxLng: 79.0 },
  Jharkhand: { minLat: 21.9, maxLat: 25.4, minLng: 83.3, maxLng: 87.6 },
  Karnataka: { minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.6 },
  Kerala: { minLat: 8.2, maxLat: 12.8, minLng: 74.8, maxLng: 77.4 },
  "Madhya Pradesh": { minLat: 21.0, maxLat: 26.9, minLng: 74.0, maxLng: 82.8 },
  Maharashtra: { minLat: 15.6, maxLat: 22.1, minLng: 72.6, maxLng: 80.9 },
  Manipur: { minLat: 23.8, maxLat: 25.7, minLng: 93.0, maxLng: 94.8 },
  Meghalaya: { minLat: 25.0, maxLat: 26.1, minLng: 89.8, maxLng: 92.8 },
  Mizoram: { minLat: 21.9, maxLat: 24.5, minLng: 92.2, maxLng: 93.5 },
  Nagaland: { minLat: 25.2, maxLat: 27.05, minLng: 93.3, maxLng: 95.3 },
  Odisha: { minLat: 17.8, maxLat: 22.6, minLng: 81.4, maxLng: 87.5 },
  Punjab: { minLat: 29.5, maxLat: 32.5, minLng: 73.9, maxLng: 76.95 },
  Rajasthan: { minLat: 23.0, maxLat: 30.2, minLng: 69.5, maxLng: 78.3 },
  Sikkim: { minLat: 27.0, maxLat: 28.2, minLng: 88.0, maxLng: 88.95 },
  "Tamil Nadu": { minLat: 8.0, maxLat: 13.6, minLng: 76.2, maxLng: 80.4 },
  Telangana: { minLat: 15.8, maxLat: 19.95, minLng: 77.2, maxLng: 81.4 },
  Tripura: { minLat: 22.9, maxLat: 24.55, minLng: 91.1, maxLng: 92.4 },
  "Uttar Pradesh": { minLat: 23.85, maxLat: 30.4, minLng: 77.05, maxLng: 84.65 },
  Uttarakhand: { minLat: 28.7, maxLat: 31.5, minLng: 77.6, maxLng: 81.05 },
  "West Bengal": { minLat: 21.5, maxLat: 27.2, minLng: 85.8, maxLng: 89.9 },
  // Union Territories
  "Andaman and Nicobar Islands": { minLat: 6.5, maxLat: 13.7, minLng: 92.2, maxLng: 94.0 },
  Chandigarh: { minLat: 30.65, maxLat: 30.8, minLng: 76.7, maxLng: 76.85 },
  "Dadra and Nagar Haveli and Daman and Diu": { minLat: 20.1, maxLat: 20.5, minLng: 72.8, maxLng: 73.2 },
  Delhi: { minLat: 28.4, maxLat: 28.95, minLng: 76.8, maxLng: 77.45 },
  "Jammu and Kashmir": { minLat: 32.2, maxLat: 35.0, minLng: 73.7, maxLng: 80.3 },
  Ladakh: { minLat: 32.3, maxLat: 36.0, minLng: 75.8, maxLng: 80.0 },
  Lakshadweep: { minLat: 8.0, maxLat: 12.5, minLng: 71.8, maxLng: 74.0 },
  Puducherry: { minLat: 10.7, maxLat: 12.0, minLng: 74.8, maxLng: 79.9 },
};

export function detectRegionFromCoords(lat: number, lng: number): string {
  for (const [state, b] of Object.entries(STATE_BBOX)) {
    if (lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng) {
      return state;
    }
  }
  return "All";
}

// Helper to build a standard 5-office set per district capital.
// Order of entries: collector, tehsildar, legal-aid (DLSA), police, women-helpline.
type Seed = {
  state: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  collectorPhone?: string;
  policePhone?: string;
  dlsaPhone?: string;
  tehsildarPhone?: string;
  womenPhone?: string;
};

const WOMEN_HELPLINE_NATIONAL = "181";
const POLICE_EMERGENCY = "112";

let __id = 0;
const nextId = () => `o${++__id}`;

function buildOfficesForCity(s: Seed): Office[] {
  const jitter = (n: number, k: number) => +(n + k).toFixed(4);
  return [
    {
      id: nextId(),
      name: `District Collectorate, ${s.district}`,
      type: "collector",
      address: `Collector's Office, ${s.city}`,
      latitude: jitter(s.lat, 0.002),
      longitude: jitter(s.lng, 0.002),
      phone: s.collectorPhone,
      state: s.state,
      district: s.district,
    },
    {
      id: nextId(),
      name: `Tehsildar Office, ${s.district}`,
      type: "tehsildar",
      address: `Tehsil Office, ${s.city}`,
      latitude: jitter(s.lat, -0.003),
      longitude: jitter(s.lng, 0.003),
      phone: s.tehsildarPhone,
      state: s.state,
      district: s.district,
    },
    {
      id: nextId(),
      name: `District Legal Services Authority (DLSA), ${s.district}`,
      type: "legal-aid",
      address: `District Court Complex, ${s.city}`,
      latitude: jitter(s.lat, 0.004),
      longitude: jitter(s.lng, -0.002),
      phone: s.dlsaPhone ?? "15100",
      state: s.state,
      district: s.district,
    },
    {
      id: nextId(),
      name: `City Police Station, ${s.district}`,
      type: "police",
      address: `Police Lines, ${s.city}`,
      latitude: jitter(s.lat, -0.004),
      longitude: jitter(s.lng, -0.003),
      phone: s.policePhone ?? POLICE_EMERGENCY,
      state: s.state,
      district: s.district,
    },
    {
      id: nextId(),
      name: `Women's Helpline / Mahila Thana, ${s.district}`,
      type: "women-helpline",
      address: `Women & Child Welfare, ${s.city}`,
      latitude: jitter(s.lat, 0.005),
      longitude: jitter(s.lng, 0.004),
      phone: s.womenPhone ?? WOMEN_HELPLINE_NATIONAL,
      state: s.state,
      district: s.district,
    },
  ];
}

// Comprehensive seed list: every state/UT capital plus major district HQs.
// Coordinates are city-centre approximations; phone numbers are official
// landlines or national helplines (181 women, 112 police, 15100 NALSA legal).
const SEEDS: Seed[] = [
  // ───────────── Andhra Pradesh ─────────────
  { state: "Andhra Pradesh", district: "Visakhapatnam", city: "Visakhapatnam", lat: 17.6868, lng: 83.2185, collectorPhone: "0891-2562288" },
  { state: "Andhra Pradesh", district: "Vijayawada (Krishna)", city: "Vijayawada", lat: 16.5062, lng: 80.6480, collectorPhone: "0866-2451888" },
  { state: "Andhra Pradesh", district: "Guntur", city: "Guntur", lat: 16.3067, lng: 80.4365, collectorPhone: "0863-2234300" },
  { state: "Andhra Pradesh", district: "Tirupati", city: "Tirupati", lat: 13.6288, lng: 79.4192, collectorPhone: "0877-2236007" },
  { state: "Andhra Pradesh", district: "Kurnool", city: "Kurnool", lat: 15.8281, lng: 78.0373, collectorPhone: "08518-277701" },
  { state: "Andhra Pradesh", district: "Anantapur", city: "Anantapur", lat: 14.6819, lng: 77.6006, collectorPhone: "08554-275433" },
  { state: "Andhra Pradesh", district: "Nellore", city: "Nellore", lat: 14.4426, lng: 79.9865, collectorPhone: "0861-2331622" },
  { state: "Andhra Pradesh", district: "Kakinada", city: "Kakinada", lat: 16.9891, lng: 82.2475, collectorPhone: "0884-2365555" },
  { state: "Andhra Pradesh", district: "Rajamahendravaram", city: "Rajahmundry", lat: 17.0005, lng: 81.8040 },
  { state: "Andhra Pradesh", district: "Chittoor", city: "Chittoor", lat: 13.2172, lng: 79.1003 },

  // ───────────── Arunachal Pradesh ─────────────
  { state: "Arunachal Pradesh", district: "Itanagar", city: "Itanagar", lat: 27.0844, lng: 93.6053, collectorPhone: "0360-2212087" },
  { state: "Arunachal Pradesh", district: "Tawang", city: "Tawang", lat: 27.5859, lng: 91.8594 },
  { state: "Arunachal Pradesh", district: "Pasighat (East Siang)", city: "Pasighat", lat: 28.0668, lng: 95.3261 },
  { state: "Arunachal Pradesh", district: "Ziro (Lower Subansiri)", city: "Ziro", lat: 27.5630, lng: 93.8270 },
  { state: "Arunachal Pradesh", district: "Tezu (Lohit)", city: "Tezu", lat: 27.9210, lng: 96.1610 },

  // ───────────── Assam ─────────────
  { state: "Assam", district: "Kamrup Metropolitan (Guwahati)", city: "Guwahati", lat: 26.1445, lng: 91.7362, collectorPhone: "0361-2734502" },
  { state: "Assam", district: "Dibrugarh", city: "Dibrugarh", lat: 27.4728, lng: 94.9120 },
  { state: "Assam", district: "Jorhat", city: "Jorhat", lat: 26.7509, lng: 94.2037 },
  { state: "Assam", district: "Silchar (Cachar)", city: "Silchar", lat: 24.8333, lng: 92.7789 },
  { state: "Assam", district: "Tezpur (Sonitpur)", city: "Tezpur", lat: 26.6528, lng: 92.7926 },
  { state: "Assam", district: "Nagaon", city: "Nagaon", lat: 26.3450, lng: 92.6840 },
  { state: "Assam", district: "Tinsukia", city: "Tinsukia", lat: 27.4922, lng: 95.3468 },
  { state: "Assam", district: "Barpeta", city: "Barpeta", lat: 26.3220, lng: 91.0050 },
  { state: "Assam", district: "Dhubri", city: "Dhubri", lat: 26.0205, lng: 89.9742 },

  // ───────────── Bihar ─────────────
  { state: "Bihar", district: "Patna", city: "Patna", lat: 25.5941, lng: 85.1376, collectorPhone: "0612-2219810" },
  { state: "Bihar", district: "Gaya", city: "Gaya", lat: 24.7914, lng: 85.0002 },
  { state: "Bihar", district: "Muzaffarpur", city: "Muzaffarpur", lat: 26.1209, lng: 85.3647 },
  { state: "Bihar", district: "Bhagalpur", city: "Bhagalpur", lat: 25.2425, lng: 86.9842 },
  { state: "Bihar", district: "Darbhanga", city: "Darbhanga", lat: 26.1542, lng: 85.8918 },
  { state: "Bihar", district: "Purnia", city: "Purnia", lat: 25.7771, lng: 87.4753 },
  { state: "Bihar", district: "Begusarai", city: "Begusarai", lat: 25.4180, lng: 86.1290 },
  { state: "Bihar", district: "Nalanda (Bihar Sharif)", city: "Bihar Sharif", lat: 25.1980, lng: 85.5230 },
  { state: "Bihar", district: "Saran (Chhapra)", city: "Chhapra", lat: 25.7805, lng: 84.7475 },
  { state: "Bihar", district: "Katihar", city: "Katihar", lat: 25.5390, lng: 87.5790 },
  { state: "Bihar", district: "Munger", city: "Munger", lat: 25.3760, lng: 86.4730 },

  // ───────────── Chhattisgarh ─────────────
  { state: "Chhattisgarh", district: "Raipur", city: "Raipur", lat: 21.2514, lng: 81.6296, collectorPhone: "0771-2445001" },
  { state: "Chhattisgarh", district: "Bilaspur", city: "Bilaspur", lat: 22.0797, lng: 82.1409 },
  { state: "Chhattisgarh", district: "Durg", city: "Durg", lat: 21.1900, lng: 81.2849 },
  { state: "Chhattisgarh", district: "Bhilai", city: "Bhilai", lat: 21.1938, lng: 81.3509 },
  { state: "Chhattisgarh", district: "Korba", city: "Korba", lat: 22.3458, lng: 82.6963 },
  { state: "Chhattisgarh", district: "Raigarh", city: "Raigarh", lat: 21.8974, lng: 83.3950 },
  { state: "Chhattisgarh", district: "Jagdalpur (Bastar)", city: "Jagdalpur", lat: 19.0805, lng: 82.0339 },
  { state: "Chhattisgarh", district: "Ambikapur (Surguja)", city: "Ambikapur", lat: 23.1170, lng: 83.1950 },

  // ───────────── Goa ─────────────
  { state: "Goa", district: "North Goa (Panaji)", city: "Panaji", lat: 15.4909, lng: 73.8278, collectorPhone: "0832-2225383" },
  { state: "Goa", district: "South Goa (Margao)", city: "Margao", lat: 15.2832, lng: 73.9862, collectorPhone: "0832-2794611" },

  // ───────────── Gujarat ─────────────
  { state: "Gujarat", district: "Ahmedabad", city: "Ahmedabad", lat: 23.0225, lng: 72.5714, collectorPhone: "079-27551155" },
  { state: "Gujarat", district: "Gandhinagar", city: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
  { state: "Gujarat", district: "Surat", city: "Surat", lat: 21.1702, lng: 72.8311 },
  { state: "Gujarat", district: "Vadodara", city: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { state: "Gujarat", district: "Rajkot", city: "Rajkot", lat: 22.3039, lng: 70.8022 },
  { state: "Gujarat", district: "Bhavnagar", city: "Bhavnagar", lat: 21.7645, lng: 72.1519 },
  { state: "Gujarat", district: "Jamnagar", city: "Jamnagar", lat: 22.4707, lng: 70.0577 },
  { state: "Gujarat", district: "Junagadh", city: "Junagadh", lat: 21.5222, lng: 70.4579 },
  { state: "Gujarat", district: "Anand", city: "Anand", lat: 22.5645, lng: 72.9289 },
  { state: "Gujarat", district: "Bharuch", city: "Bharuch", lat: 21.7051, lng: 72.9959 },
  { state: "Gujarat", district: "Mehsana", city: "Mehsana", lat: 23.5980, lng: 72.3790 },
  { state: "Gujarat", district: "Kutch (Bhuj)", city: "Bhuj", lat: 23.2419, lng: 69.6669 },

  // ───────────── Haryana ─────────────
  { state: "Haryana", district: "Gurugram", city: "Gurugram", lat: 28.4595, lng: 77.0266, collectorPhone: "0124-2300485" },
  { state: "Haryana", district: "Faridabad", city: "Faridabad", lat: 28.4089, lng: 77.3178 },
  { state: "Haryana", district: "Panchkula", city: "Panchkula", lat: 30.6942, lng: 76.8606 },
  { state: "Haryana", district: "Ambala", city: "Ambala", lat: 30.3782, lng: 76.7767 },
  { state: "Haryana", district: "Karnal", city: "Karnal", lat: 29.6857, lng: 76.9905 },
  { state: "Haryana", district: "Hisar", city: "Hisar", lat: 29.1492, lng: 75.7217 },
  { state: "Haryana", district: "Rohtak", city: "Rohtak", lat: 28.8955, lng: 76.6066 },
  { state: "Haryana", district: "Panipat", city: "Panipat", lat: 29.3909, lng: 76.9635 },
  { state: "Haryana", district: "Sonipat", city: "Sonipat", lat: 28.9931, lng: 77.0151 },
  { state: "Haryana", district: "Yamunanagar", city: "Yamunanagar", lat: 30.1290, lng: 77.2674 },

  // ───────────── Himachal Pradesh ─────────────
  { state: "Himachal Pradesh", district: "Shimla", city: "Shimla", lat: 31.1048, lng: 77.1734, collectorPhone: "0177-2657005" },
  { state: "Himachal Pradesh", district: "Mandi", city: "Mandi", lat: 31.7080, lng: 76.9320 },
  { state: "Himachal Pradesh", district: "Kangra (Dharamshala)", city: "Dharamshala", lat: 32.2190, lng: 76.3234 },
  { state: "Himachal Pradesh", district: "Kullu", city: "Kullu", lat: 31.9578, lng: 77.1095 },
  { state: "Himachal Pradesh", district: "Solan", city: "Solan", lat: 30.9045, lng: 77.0967 },
  { state: "Himachal Pradesh", district: "Bilaspur (HP)", city: "Bilaspur", lat: 31.3300, lng: 76.7600 },
  { state: "Himachal Pradesh", district: "Hamirpur", city: "Hamirpur", lat: 31.6840, lng: 76.5210 },
  { state: "Himachal Pradesh", district: "Una", city: "Una", lat: 31.4685, lng: 76.2708 },
  { state: "Himachal Pradesh", district: "Chamba", city: "Chamba", lat: 32.5530, lng: 76.1260 },
  { state: "Himachal Pradesh", district: "Sirmaur (Nahan)", city: "Nahan", lat: 30.5590, lng: 77.2950 },

  // ───────────── Jharkhand ─────────────
  { state: "Jharkhand", district: "Ranchi", city: "Ranchi", lat: 23.3441, lng: 85.3096, collectorPhone: "0651-2446066" },
  { state: "Jharkhand", district: "Jamshedpur (East Singhbhum)", city: "Jamshedpur", lat: 22.8046, lng: 86.2029 },
  { state: "Jharkhand", district: "Dhanbad", city: "Dhanbad", lat: 23.7957, lng: 86.4304 },
  { state: "Jharkhand", district: "Bokaro", city: "Bokaro Steel City", lat: 23.6693, lng: 86.1511 },
  { state: "Jharkhand", district: "Hazaribagh", city: "Hazaribagh", lat: 23.9925, lng: 85.3637 },
  { state: "Jharkhand", district: "Deoghar", city: "Deoghar", lat: 24.4836, lng: 86.6976 },
  { state: "Jharkhand", district: "Giridih", city: "Giridih", lat: 24.1844, lng: 86.3032 },
  { state: "Jharkhand", district: "Dumka", city: "Dumka", lat: 24.2680, lng: 87.2490 },

  // ───────────── Karnataka ─────────────
  { state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", lat: 12.9716, lng: 77.5946, collectorPhone: "080-22213067" },
  { state: "Karnataka", district: "Mysuru", city: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { state: "Karnataka", district: "Mangaluru (Dakshina Kannada)", city: "Mangaluru", lat: 12.9141, lng: 74.8560 },
  { state: "Karnataka", district: "Hubballi-Dharwad", city: "Hubballi", lat: 15.3647, lng: 75.1240 },
  { state: "Karnataka", district: "Belagavi", city: "Belagavi", lat: 15.8497, lng: 74.4977 },
  { state: "Karnataka", district: "Kalaburagi", city: "Kalaburagi", lat: 17.3297, lng: 76.8343 },
  { state: "Karnataka", district: "Davanagere", city: "Davanagere", lat: 14.4644, lng: 75.9218 },
  { state: "Karnataka", district: "Ballari", city: "Ballari", lat: 15.1394, lng: 76.9214 },
  { state: "Karnataka", district: "Tumakuru", city: "Tumakuru", lat: 13.3392, lng: 77.1140 },
  { state: "Karnataka", district: "Shivamogga", city: "Shivamogga", lat: 13.9299, lng: 75.5681 },
  { state: "Karnataka", district: "Udupi", city: "Udupi", lat: 13.3409, lng: 74.7421 },
  { state: "Karnataka", district: "Vijayapura", city: "Vijayapura", lat: 16.8302, lng: 75.7100 },

  // ───────────── Kerala ─────────────
  { state: "Kerala", district: "Thiruvananthapuram", city: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, collectorPhone: "0471-2730045" },
  { state: "Kerala", district: "Kollam", city: "Kollam", lat: 8.8932, lng: 76.6141 },
  { state: "Kerala", district: "Pathanamthitta", city: "Pathanamthitta", lat: 9.2648, lng: 76.7870 },
  { state: "Kerala", district: "Alappuzha", city: "Alappuzha", lat: 9.4981, lng: 76.3388 },
  { state: "Kerala", district: "Kottayam", city: "Kottayam", lat: 9.5916, lng: 76.5222 },
  { state: "Kerala", district: "Idukki", city: "Painavu", lat: 9.8497, lng: 76.9681 },
  { state: "Kerala", district: "Ernakulam (Kochi)", city: "Kochi", lat: 9.9312, lng: 76.2673 },
  { state: "Kerala", district: "Thrissur", city: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { state: "Kerala", district: "Palakkad", city: "Palakkad", lat: 10.7867, lng: 76.6548 },
  { state: "Kerala", district: "Malappuram", city: "Malappuram", lat: 11.0510, lng: 76.0710 },
  { state: "Kerala", district: "Kozhikode", city: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { state: "Kerala", district: "Wayanad (Kalpetta)", city: "Kalpetta", lat: 11.6090, lng: 76.0838 },
  { state: "Kerala", district: "Kannur", city: "Kannur", lat: 11.8745, lng: 75.3704 },
  { state: "Kerala", district: "Kasaragod", city: "Kasaragod", lat: 12.4996, lng: 74.9869 },

  // ───────────── Madhya Pradesh ─────────────
  { state: "Madhya Pradesh", district: "Bhopal", city: "Bhopal", lat: 23.2599, lng: 77.4126, collectorPhone: "0755-2540560" },
  { state: "Madhya Pradesh", district: "Indore", city: "Indore", lat: 22.7196, lng: 75.8577 },
  { state: "Madhya Pradesh", district: "Gwalior", city: "Gwalior", lat: 26.2183, lng: 78.1828 },
  { state: "Madhya Pradesh", district: "Jabalpur", city: "Jabalpur", lat: 23.1815, lng: 79.9864 },
  { state: "Madhya Pradesh", district: "Ujjain", city: "Ujjain", lat: 23.1765, lng: 75.7885 },
  { state: "Madhya Pradesh", district: "Sagar", city: "Sagar", lat: 23.8388, lng: 78.7378 },
  { state: "Madhya Pradesh", district: "Dewas", city: "Dewas", lat: 22.9676, lng: 76.0534 },
  { state: "Madhya Pradesh", district: "Satna", city: "Satna", lat: 24.6005, lng: 80.8322 },
  { state: "Madhya Pradesh", district: "Rewa", city: "Rewa", lat: 24.5373, lng: 81.3037 },
  { state: "Madhya Pradesh", district: "Ratlam", city: "Ratlam", lat: 23.3343, lng: 75.0376 },
  { state: "Madhya Pradesh", district: "Chhindwara", city: "Chhindwara", lat: 22.0574, lng: 78.9382 },

  // ───────────── Maharashtra ─────────────
  { state: "Maharashtra", district: "Mumbai City", city: "Mumbai", lat: 18.9388, lng: 72.8354, collectorPhone: "022-22621956" },
  { state: "Maharashtra", district: "Mumbai Suburban", city: "Bandra", lat: 19.0596, lng: 72.8295 },
  { state: "Maharashtra", district: "Pune", city: "Pune", lat: 18.5204, lng: 73.8567 },
  { state: "Maharashtra", district: "Thane", city: "Thane", lat: 19.2183, lng: 72.9781 },
  { state: "Maharashtra", district: "Nagpur", city: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { state: "Maharashtra", district: "Nashik", city: "Nashik", lat: 19.9975, lng: 73.7898 },
  { state: "Maharashtra", district: "Aurangabad (Chhatrapati Sambhajinagar)", city: "Aurangabad", lat: 19.8762, lng: 75.3433 },
  { state: "Maharashtra", district: "Solapur", city: "Solapur", lat: 17.6599, lng: 75.9064 },
  { state: "Maharashtra", district: "Kolhapur", city: "Kolhapur", lat: 16.7050, lng: 74.2433 },
  { state: "Maharashtra", district: "Amravati", city: "Amravati", lat: 20.9320, lng: 77.7523 },
  { state: "Maharashtra", district: "Akola", city: "Akola", lat: 20.7002, lng: 77.0082 },
  { state: "Maharashtra", district: "Sangli", city: "Sangli", lat: 16.8524, lng: 74.5815 },
  { state: "Maharashtra", district: "Satara", city: "Satara", lat: 17.6805, lng: 74.0183 },
  { state: "Maharashtra", district: "Ratnagiri", city: "Ratnagiri", lat: 16.9944, lng: 73.3000 },
  { state: "Maharashtra", district: "Raigad (Alibag)", city: "Alibag", lat: 18.6414, lng: 72.8722 },
  { state: "Maharashtra", district: "Palghar", city: "Palghar", lat: 19.6970, lng: 72.7649 },
  { state: "Maharashtra", district: "Jalgaon", city: "Jalgaon", lat: 21.0077, lng: 75.5626 },

  // ───────────── Manipur ─────────────
  { state: "Manipur", district: "Imphal West", city: "Imphal", lat: 24.8170, lng: 93.9368, collectorPhone: "0385-2451065" },
  { state: "Manipur", district: "Imphal East", city: "Porompat", lat: 24.8019, lng: 93.9784 },
  { state: "Manipur", district: "Bishnupur", city: "Bishnupur", lat: 24.6300, lng: 93.7700 },
  { state: "Manipur", district: "Churachandpur", city: "Churachandpur", lat: 24.3360, lng: 93.6720 },
  { state: "Manipur", district: "Thoubal", city: "Thoubal", lat: 24.6390, lng: 94.0140 },
  { state: "Manipur", district: "Ukhrul", city: "Ukhrul", lat: 25.1100, lng: 94.3600 },

  // ───────────── Meghalaya ─────────────
  { state: "Meghalaya", district: "East Khasi Hills (Shillong)", city: "Shillong", lat: 25.5788, lng: 91.8933, collectorPhone: "0364-2226220" },
  { state: "Meghalaya", district: "West Garo Hills (Tura)", city: "Tura", lat: 25.5167, lng: 90.2167 },
  { state: "Meghalaya", district: "Jaintia Hills (Jowai)", city: "Jowai", lat: 25.4498, lng: 92.2030 },
  { state: "Meghalaya", district: "Ri-Bhoi (Nongpoh)", city: "Nongpoh", lat: 25.9050, lng: 91.8700 },

  // ───────────── Mizoram ─────────────
  { state: "Mizoram", district: "Aizawl", city: "Aizawl", lat: 23.7271, lng: 92.7176, collectorPhone: "0389-2334555" },
  { state: "Mizoram", district: "Lunglei", city: "Lunglei", lat: 22.8800, lng: 92.7400 },
  { state: "Mizoram", district: "Champhai", city: "Champhai", lat: 23.4570, lng: 93.3290 },
  { state: "Mizoram", district: "Kolasib", city: "Kolasib", lat: 24.2280, lng: 92.6790 },

  // ───────────── Nagaland ─────────────
  { state: "Nagaland", district: "Kohima", city: "Kohima", lat: 25.6747, lng: 94.1086, collectorPhone: "0370-2270222" },
  { state: "Nagaland", district: "Dimapur", city: "Dimapur", lat: 25.9091, lng: 93.7266 },
  { state: "Nagaland", district: "Mokokchung", city: "Mokokchung", lat: 26.3220, lng: 94.5170 },
  { state: "Nagaland", district: "Tuensang", city: "Tuensang", lat: 26.2800, lng: 94.8290 },
  { state: "Nagaland", district: "Wokha", city: "Wokha", lat: 26.0980, lng: 94.2620 },

  // ───────────── Odisha ─────────────
  { state: "Odisha", district: "Khordha (Bhubaneswar)", city: "Bhubaneswar", lat: 20.2961, lng: 85.8245, collectorPhone: "0674-2392834" },
  { state: "Odisha", district: "Cuttack", city: "Cuttack", lat: 20.4625, lng: 85.8828 },
  { state: "Odisha", district: "Puri", city: "Puri", lat: 19.8135, lng: 85.8312 },
  { state: "Odisha", district: "Ganjam (Berhampur)", city: "Berhampur", lat: 19.3149, lng: 84.7941 },
  { state: "Odisha", district: "Sambalpur", city: "Sambalpur", lat: 21.4669, lng: 83.9812 },
  { state: "Odisha", district: "Rourkela (Sundargarh)", city: "Rourkela", lat: 22.2604, lng: 84.8536 },
  { state: "Odisha", district: "Balasore", city: "Balasore", lat: 21.4942, lng: 86.9335 },
  { state: "Odisha", district: "Kalahandi (Bhawanipatna)", city: "Bhawanipatna", lat: 19.9070, lng: 83.1640 },
  { state: "Odisha", district: "Koraput", city: "Koraput", lat: 18.8120, lng: 82.7100 },

  // ───────────── Punjab ─────────────
  { state: "Punjab", district: "Ludhiana", city: "Ludhiana", lat: 30.9009, lng: 75.8573, collectorPhone: "0161-2403100" },
  { state: "Punjab", district: "Amritsar", city: "Amritsar", lat: 31.6340, lng: 74.8723 },
  { state: "Punjab", district: "Jalandhar", city: "Jalandhar", lat: 31.3260, lng: 75.5762 },
  { state: "Punjab", district: "Patiala", city: "Patiala", lat: 30.3398, lng: 76.3869 },
  { state: "Punjab", district: "Bathinda", city: "Bathinda", lat: 30.2110, lng: 74.9455 },
  { state: "Punjab", district: "Mohali (SAS Nagar)", city: "Mohali", lat: 30.7046, lng: 76.7179 },
  { state: "Punjab", district: "Pathankot", city: "Pathankot", lat: 32.2740, lng: 75.6520 },
  { state: "Punjab", district: "Hoshiarpur", city: "Hoshiarpur", lat: 31.5320, lng: 75.9120 },
  { state: "Punjab", district: "Ferozepur", city: "Ferozepur", lat: 30.9258, lng: 74.6133 },
  { state: "Punjab", district: "Moga", city: "Moga", lat: 30.8170, lng: 75.1714 },

  // ───────────── Rajasthan ─────────────
  { state: "Rajasthan", district: "Jaipur", city: "Jaipur", lat: 26.9124, lng: 75.7873, collectorPhone: "0141-2227295" },
  { state: "Rajasthan", district: "Jodhpur", city: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { state: "Rajasthan", district: "Udaipur", city: "Udaipur", lat: 24.5854, lng: 73.7125 },
  { state: "Rajasthan", district: "Kota", city: "Kota", lat: 25.2138, lng: 75.8648 },
  { state: "Rajasthan", district: "Ajmer", city: "Ajmer", lat: 26.4499, lng: 74.6399 },
  { state: "Rajasthan", district: "Bikaner", city: "Bikaner", lat: 28.0229, lng: 73.3119 },
  { state: "Rajasthan", district: "Bharatpur", city: "Bharatpur", lat: 27.2152, lng: 77.4977 },
  { state: "Rajasthan", district: "Alwar", city: "Alwar", lat: 27.5530, lng: 76.6346 },
  { state: "Rajasthan", district: "Sikar", city: "Sikar", lat: 27.6094, lng: 75.1399 },
  { state: "Rajasthan", district: "Sri Ganganagar", city: "Sri Ganganagar", lat: 29.9094, lng: 73.8800 },
  { state: "Rajasthan", district: "Pali", city: "Pali", lat: 25.7711, lng: 73.3234 },
  { state: "Rajasthan", district: "Jaisalmer", city: "Jaisalmer", lat: 26.9157, lng: 70.9083 },

  // ───────────── Sikkim ─────────────
  { state: "Sikkim", district: "East Sikkim (Gangtok)", city: "Gangtok", lat: 27.3389, lng: 88.6065, collectorPhone: "03592-202218" },
  { state: "Sikkim", district: "West Sikkim (Gyalshing)", city: "Gyalshing", lat: 27.2840, lng: 88.2620 },
  { state: "Sikkim", district: "South Sikkim (Namchi)", city: "Namchi", lat: 27.1670, lng: 88.3640 },
  { state: "Sikkim", district: "North Sikkim (Mangan)", city: "Mangan", lat: 27.5080, lng: 88.5260 },

  // ───────────── Tamil Nadu ─────────────
  { state: "Tamil Nadu", district: "Chennai", city: "Chennai", lat: 13.0827, lng: 80.2707, collectorPhone: "044-25224801" },
  { state: "Tamil Nadu", district: "Coimbatore", city: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { state: "Tamil Nadu", district: "Madurai", city: "Madurai", lat: 9.9252, lng: 78.1198 },
  { state: "Tamil Nadu", district: "Tiruchirappalli", city: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { state: "Tamil Nadu", district: "Salem", city: "Salem", lat: 11.6643, lng: 78.1460 },
  { state: "Tamil Nadu", district: "Tirunelveli", city: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { state: "Tamil Nadu", district: "Tirupur", city: "Tirupur", lat: 11.1085, lng: 77.3411 },
  { state: "Tamil Nadu", district: "Erode", city: "Erode", lat: 11.3410, lng: 77.7172 },
  { state: "Tamil Nadu", district: "Vellore", city: "Vellore", lat: 12.9165, lng: 79.1325 },
  { state: "Tamil Nadu", district: "Thanjavur", city: "Thanjavur", lat: 10.7870, lng: 79.1378 },
  { state: "Tamil Nadu", district: "Dindigul", city: "Dindigul", lat: 10.3673, lng: 77.9803 },
  { state: "Tamil Nadu", district: "Kanchipuram", city: "Kanchipuram", lat: 12.8342, lng: 79.7036 },
  { state: "Tamil Nadu", district: "Cuddalore", city: "Cuddalore", lat: 11.7480, lng: 79.7714 },

  // ───────────── Telangana ─────────────
  { state: "Telangana", district: "Hyderabad", city: "Hyderabad", lat: 17.3850, lng: 78.4867, collectorPhone: "040-24742222" },
  { state: "Telangana", district: "Rangareddy", city: "Lakdikapul", lat: 17.4015, lng: 78.4516 },
  { state: "Telangana", district: "Medchal-Malkajgiri", city: "Shamirpet", lat: 17.5860, lng: 78.5860 },
  { state: "Telangana", district: "Warangal", city: "Warangal", lat: 17.9689, lng: 79.5941 },
  { state: "Telangana", district: "Karimnagar", city: "Karimnagar", lat: 18.4386, lng: 79.1288 },
  { state: "Telangana", district: "Khammam", city: "Khammam", lat: 17.2473, lng: 80.1514 },
  { state: "Telangana", district: "Nalgonda", city: "Nalgonda", lat: 17.0542, lng: 79.2671 },
  { state: "Telangana", district: "Mahbubnagar", city: "Mahbubnagar", lat: 16.7393, lng: 77.9974 },
  { state: "Telangana", district: "Nizamabad", city: "Nizamabad", lat: 18.6725, lng: 78.0941 },

  // ───────────── Tripura ─────────────
  { state: "Tripura", district: "West Tripura (Agartala)", city: "Agartala", lat: 23.8315, lng: 91.2868, collectorPhone: "0381-2324412" },
  { state: "Tripura", district: "South Tripura (Belonia)", city: "Belonia", lat: 23.2510, lng: 91.4530 },
  { state: "Tripura", district: "North Tripura (Dharmanagar)", city: "Dharmanagar", lat: 24.3700, lng: 92.1690 },
  { state: "Tripura", district: "Dhalai (Ambassa)", city: "Ambassa", lat: 23.9360, lng: 91.8540 },

  // ───────────── Uttar Pradesh ─────────────
  { state: "Uttar Pradesh", district: "Lucknow", city: "Lucknow", lat: 26.8467, lng: 80.9462, collectorPhone: "0522-2611117" },
  { state: "Uttar Pradesh", district: "Kanpur Nagar", city: "Kanpur", lat: 26.4499, lng: 80.3319 },
  { state: "Uttar Pradesh", district: "Agra", city: "Agra", lat: 27.1767, lng: 78.0081 },
  { state: "Uttar Pradesh", district: "Varanasi", city: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { state: "Uttar Pradesh", district: "Prayagraj", city: "Prayagraj", lat: 25.4358, lng: 81.8463 },
  { state: "Uttar Pradesh", district: "Meerut", city: "Meerut", lat: 28.9845, lng: 77.7064 },
  { state: "Uttar Pradesh", district: "Ghaziabad", city: "Ghaziabad", lat: 28.6692, lng: 77.4538 },
  { state: "Uttar Pradesh", district: "Gautam Buddha Nagar (Noida)", city: "Noida", lat: 28.5355, lng: 77.3910 },
  { state: "Uttar Pradesh", district: "Bareilly", city: "Bareilly", lat: 28.3670, lng: 79.4304 },
  { state: "Uttar Pradesh", district: "Aligarh", city: "Aligarh", lat: 27.8974, lng: 78.0880 },
  { state: "Uttar Pradesh", district: "Moradabad", city: "Moradabad", lat: 28.8386, lng: 78.7733 },
  { state: "Uttar Pradesh", district: "Gorakhpur", city: "Gorakhpur", lat: 26.7606, lng: 83.3732 },
  { state: "Uttar Pradesh", district: "Saharanpur", city: "Saharanpur", lat: 29.9680, lng: 77.5510 },
  { state: "Uttar Pradesh", district: "Mathura", city: "Mathura", lat: 27.4924, lng: 77.6737 },
  { state: "Uttar Pradesh", district: "Jhansi", city: "Jhansi", lat: 25.4484, lng: 78.5685 },
  { state: "Uttar Pradesh", district: "Ayodhya", city: "Ayodhya", lat: 26.7990, lng: 82.2040 },
  { state: "Uttar Pradesh", district: "Muzaffarnagar", city: "Muzaffarnagar", lat: 29.4727, lng: 77.7085 },

  // ───────────── Uttarakhand ─────────────
  { state: "Uttarakhand", district: "Dehradun", city: "Dehradun", lat: 30.3165, lng: 78.0322, collectorPhone: "0135-2655662" },
  { state: "Uttarakhand", district: "Haridwar", city: "Haridwar", lat: 29.9457, lng: 78.1642 },
  { state: "Uttarakhand", district: "Nainital", city: "Nainital", lat: 29.3919, lng: 79.4542 },
  { state: "Uttarakhand", district: "Udham Singh Nagar (Rudrapur)", city: "Rudrapur", lat: 28.9784, lng: 79.4081 },
  { state: "Uttarakhand", district: "Pauri Garhwal", city: "Pauri", lat: 30.1469, lng: 78.7800 },
  { state: "Uttarakhand", district: "Tehri Garhwal (New Tehri)", city: "New Tehri", lat: 30.3770, lng: 78.4360 },
  { state: "Uttarakhand", district: "Almora", city: "Almora", lat: 29.5980, lng: 79.6590 },
  { state: "Uttarakhand", district: "Pithoragarh", city: "Pithoragarh", lat: 29.5830, lng: 80.2090 },
  { state: "Uttarakhand", district: "Chamoli (Gopeshwar)", city: "Gopeshwar", lat: 30.4070, lng: 79.3210 },
  { state: "Uttarakhand", district: "Rudraprayag", city: "Rudraprayag", lat: 30.2840, lng: 78.9810 },

  // ───────────── West Bengal ─────────────
  { state: "West Bengal", district: "Kolkata", city: "Kolkata", lat: 22.5726, lng: 88.3639, collectorPhone: "033-22143526" },
  { state: "West Bengal", district: "Howrah", city: "Howrah", lat: 22.5958, lng: 88.2636 },
  { state: "West Bengal", district: "North 24 Parganas (Barasat)", city: "Barasat", lat: 22.7218, lng: 88.4814 },
  { state: "West Bengal", district: "South 24 Parganas (Alipore)", city: "Alipore", lat: 22.5300, lng: 88.3320 },
  { state: "West Bengal", district: "Hooghly (Chinsurah)", city: "Chinsurah", lat: 22.9015, lng: 88.3950 },
  { state: "West Bengal", district: "Nadia (Krishnanagar)", city: "Krishnanagar", lat: 23.4050, lng: 88.5020 },
  { state: "West Bengal", district: "Murshidabad (Berhampore)", city: "Berhampore", lat: 24.0975, lng: 88.2495 },
  { state: "West Bengal", district: "Burdwan (Bardhaman)", city: "Bardhaman", lat: 23.2324, lng: 87.8615 },
  { state: "West Bengal", district: "Darjeeling", city: "Darjeeling", lat: 27.0410, lng: 88.2663 },
  { state: "West Bengal", district: "Siliguri (Jalpaiguri)", city: "Siliguri", lat: 26.7271, lng: 88.3953 },
  { state: "West Bengal", district: "Malda", city: "Malda", lat: 25.0119, lng: 88.1433 },
  { state: "West Bengal", district: "Purulia", city: "Purulia", lat: 23.3320, lng: 86.3650 },
  { state: "West Bengal", district: "Bankura", city: "Bankura", lat: 23.2330, lng: 87.0750 },

  // ───────────── Andaman & Nicobar Islands ─────────────
  { state: "Andaman and Nicobar Islands", district: "South Andaman (Port Blair)", city: "Port Blair", lat: 11.6234, lng: 92.7265, collectorPhone: "03192-233089" },
  { state: "Andaman and Nicobar Islands", district: "North & Middle Andaman (Mayabunder)", city: "Mayabunder", lat: 12.9300, lng: 92.9000 },
  { state: "Andaman and Nicobar Islands", district: "Nicobar (Car Nicobar)", city: "Car Nicobar", lat: 9.1700, lng: 92.8200 },

  // ───────────── Chandigarh ─────────────
  { state: "Chandigarh", district: "Chandigarh", city: "Chandigarh", lat: 30.7333, lng: 76.7794, collectorPhone: "0172-2740001" },

  // ───────────── Dadra & Nagar Haveli and Daman & Diu ─────────────
  { state: "Dadra and Nagar Haveli and Daman and Diu", district: "Daman", city: "Daman", lat: 20.3974, lng: 72.8328, collectorPhone: "0260-2230473" },
  { state: "Dadra and Nagar Haveli and Daman and Diu", district: "Diu", city: "Diu", lat: 20.7144, lng: 70.9874 },
  { state: "Dadra and Nagar Haveli and Daman and Diu", district: "Dadra & Nagar Haveli (Silvassa)", city: "Silvassa", lat: 20.2738, lng: 72.9961 },

  // ───────────── Delhi ─────────────
  { state: "Delhi", district: "New Delhi", city: "New Delhi", lat: 28.6139, lng: 77.2090, collectorPhone: "011-23361017" },
  { state: "Delhi", district: "Central Delhi", city: "Daryaganj", lat: 28.6448, lng: 77.2168 },
  { state: "Delhi", district: "North Delhi", city: "Civil Lines", lat: 28.6826, lng: 77.2231 },
  { state: "Delhi", district: "South Delhi", city: "Saket", lat: 28.5244, lng: 77.2066 },
  { state: "Delhi", district: "East Delhi", city: "Preet Vihar", lat: 28.6310, lng: 77.2956 },
  { state: "Delhi", district: "West Delhi", city: "Rajouri Garden", lat: 28.6470, lng: 77.1216 },
  { state: "Delhi", district: "South-West Delhi", city: "Dwarka", lat: 28.5921, lng: 77.0460 },
  { state: "Delhi", district: "North-West Delhi", city: "Rohini", lat: 28.7041, lng: 77.1025 },
  { state: "Delhi", district: "North-East Delhi", city: "Seelampur", lat: 28.6708, lng: 77.2680 },
  { state: "Delhi", district: "South-East Delhi", city: "Defence Colony", lat: 28.5728, lng: 77.2295 },
  { state: "Delhi", district: "Shahdara", city: "Shahdara", lat: 28.6735, lng: 77.2890 },

  // ───────────── Jammu & Kashmir ─────────────
  { state: "Jammu and Kashmir", district: "Srinagar", city: "Srinagar", lat: 34.0837, lng: 74.7973, collectorPhone: "0194-2452002" },
  { state: "Jammu and Kashmir", district: "Jammu", city: "Jammu", lat: 32.7266, lng: 74.8570 },
  { state: "Jammu and Kashmir", district: "Anantnag", city: "Anantnag", lat: 33.7311, lng: 75.1487 },
  { state: "Jammu and Kashmir", district: "Baramulla", city: "Baramulla", lat: 34.1990, lng: 74.3650 },
  { state: "Jammu and Kashmir", district: "Udhampur", city: "Udhampur", lat: 32.9159, lng: 75.1416 },
  { state: "Jammu and Kashmir", district: "Kathua", city: "Kathua", lat: 32.3700, lng: 75.5200 },
  { state: "Jammu and Kashmir", district: "Pulwama", city: "Pulwama", lat: 33.8716, lng: 74.9134 },
  { state: "Jammu and Kashmir", district: "Kupwara", city: "Kupwara", lat: 34.5311, lng: 74.2554 },

  // ───────────── Ladakh ─────────────
  { state: "Ladakh", district: "Leh", city: "Leh", lat: 34.1526, lng: 77.5770, collectorPhone: "01982-252010" },
  { state: "Ladakh", district: "Kargil", city: "Kargil", lat: 34.5539, lng: 76.1349 },

  // ───────────── Lakshadweep ─────────────
  { state: "Lakshadweep", district: "Lakshadweep (Kavaratti)", city: "Kavaratti", lat: 10.5667, lng: 72.6417, collectorPhone: "04896-262258" },

  // ───────────── Puducherry ─────────────
  { state: "Puducherry", district: "Puducherry", city: "Puducherry", lat: 11.9416, lng: 79.8083, collectorPhone: "0413-2253555" },
  { state: "Puducherry", district: "Karaikal", city: "Karaikal", lat: 10.9254, lng: 79.8380 },
  { state: "Puducherry", district: "Mahé", city: "Mahé", lat: 11.7011, lng: 75.5360 },
  { state: "Puducherry", district: "Yanam", city: "Yanam", lat: 16.7333, lng: 82.2167 },
];

export const offices: Office[] = SEEDS.flatMap(buildOfficesForCity);
