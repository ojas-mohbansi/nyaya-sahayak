export function detectRegionFromCoords(lat: number, lng: number): string {
  if (lat >= 28.4 && lat <= 28.95 && lng >= 76.8 && lng <= 77.45) return "Delhi";
  if (lat >= 15.6 && lat <= 22.1 && lng >= 72.6 && lng <= 80.9) return "Maharashtra";
  if (lat >= 11.6 && lat <= 18.5 && lng >= 74.0 && lng <= 78.7) return "Karnataka";
  if (lat >= 8.0 && lat <= 13.6 && lng >= 76.2 && lng <= 80.4) return "Tamil Nadu";
  if (lat >= 15.8 && lat <= 19.9 && lng >= 77.2 && lng <= 81.4) return "Telangana";
  if (lat >= 22.0 && lat <= 28.3 && lng >= 68.1 && lng <= 74.5) return "Rajasthan";
  if (lat >= 23.0 && lat <= 27.5 && lng >= 77.0 && lng <= 84.5) return "Madhya Pradesh";
  if (lat >= 17.0 && lat <= 20.0 && lng >= 81.0 && lng <= 85.0) return "Andhra Pradesh";
  if (lat >= 22.0 && lat <= 27.2 && lng >= 84.0 && lng <= 87.5) return "Jharkhand";
  if (lat >= 20.0 && lat <= 26.5 && lng >= 81.7 && lng <= 84.4) return "Chhattisgarh";
  if (lat >= 23.6 && lat <= 27.5 && lng >= 85.5 && lng <= 88.2) return "West Bengal";
  if (lat >= 26.0 && lat <= 28.4 && lng >= 77.4 && lng <= 84.6) return "Uttar Pradesh";
  if (lat >= 24.0 && lat <= 27.5 && lng >= 74.4 && lng <= 78.3) return "Rajasthan";
  if (lat >= 28.9 && lat <= 32.5 && lng >= 73.9 && lng <= 77.8) return "Punjab";
  if (lat >= 28.9 && lat <= 31.5 && lng >= 77.6 && lng <= 81.0) return "Uttarakhand";
  return "All";
}

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

export const offices: Office[] = [
  {
    id: "1",
    name: "District Collectorate, Central Delhi",
    type: "collector",
    address: "Jai Singh Road, New Delhi",
    latitude: 28.6315,
    longitude: 77.2167,
    phone: "011-23361017",
    state: "Delhi",
    district: "Central Delhi",
  },
  {
    id: "2",
    name: "DLSA - District Legal Services Authority",
    type: "legal-aid",
    address: "Tis Hazari Courts, Delhi",
    latitude: 28.6631,
    longitude: 77.2265,
    phone: "011-23920710",
    state: "Delhi",
    district: "North Delhi",
  },
  {
    id: "3",
    name: "Parliament Street Police Station",
    type: "police",
    address: "Parliament Street, New Delhi",
    latitude: 28.6250,
    longitude: 77.2130,
    phone: "011-23363876",
    state: "Delhi",
    district: "New Delhi",
  },
  {
    id: "4",
    name: "Women's Helpline Center",
    type: "women-helpline",
    address: "Nanakpura, New Delhi",
    latitude: 28.5830,
    longitude: 77.1950,
    phone: "181",
    state: "Delhi",
    district: "South Delhi",
  },
  {
    id: "5",
    name: "Tehsildar Office, Sadar",
    type: "tehsildar",
    address: "Connaught Place, New Delhi",
    latitude: 28.6340,
    longitude: 77.2190,
    phone: "011-23417114",
    state: "Delhi",
    district: "New Delhi",
  },
  {
    id: "6",
    name: "District Court, Patiala House",
    type: "legal-aid",
    address: "India Gate Circle, New Delhi",
    latitude: 28.6180,
    longitude: 77.2340,
    phone: "011-23383725",
    state: "Delhi",
    district: "New Delhi",
  },
  {
    id: "7",
    name: "Collector Office, Mumbai",
    type: "collector",
    address: "Old Custom House, Fort, Mumbai",
    latitude: 18.9321,
    longitude: 72.8370,
    phone: "022-22621956",
    state: "Maharashtra",
    district: "Mumbai",
  },
  {
    id: "8",
    name: "DLSA Mumbai",
    type: "legal-aid",
    address: "City Civil Court, Mumbai",
    latitude: 18.9448,
    longitude: 72.8311,
    phone: "022-22621813",
    state: "Maharashtra",
    district: "Mumbai",
  },
  {
    id: "9",
    name: "Colaba Police Station",
    type: "police",
    address: "Colaba, Mumbai",
    latitude: 18.9067,
    longitude: 72.8147,
    phone: "022-22841414",
    state: "Maharashtra",
    district: "Mumbai",
  },
  {
    id: "10",
    name: "Collector Office, Bengaluru Urban",
    type: "collector",
    address: "KG Road, Bengaluru",
    latitude: 12.9768,
    longitude: 77.5706,
    phone: "080-22213067",
    state: "Karnataka",
    district: "Bengaluru Urban",
  },
  {
    id: "11",
    name: "DLSA Bengaluru",
    type: "legal-aid",
    address: "City Civil Court Complex, Bengaluru",
    latitude: 12.9802,
    longitude: 77.5919,
    phone: "080-25325346",
    state: "Karnataka",
    district: "Bengaluru Urban",
  },
  {
    id: "12",
    name: "Collector Office, Chennai",
    type: "collector",
    address: "Rajaji Salai, Chennai",
    latitude: 13.0827,
    longitude: 80.2707,
    phone: "044-25224801",
    state: "Tamil Nadu",
    district: "Chennai",
  },
  {
    id: "13",
    name: "DLSA Chennai",
    type: "legal-aid",
    address: "High Court Campus, Chennai",
    latitude: 13.0878,
    longitude: 80.2885,
    phone: "044-25341738",
    state: "Tamil Nadu",
    district: "Chennai",
  },
  {
    id: "14",
    name: "Collector Office, Hyderabad",
    type: "collector",
    address: "Tank Bund Road, Hyderabad",
    latitude: 17.4123,
    longitude: 78.4707,
    phone: "040-24742222",
    state: "Telangana",
    district: "Hyderabad",
  },
  {
    id: "15",
    name: "DLSA Hyderabad",
    type: "legal-aid",
    address: "City Civil Court, Hyderabad",
    latitude: 17.3950,
    longitude: 78.4780,
    phone: "040-24652060",
    state: "Telangana",
    district: "Hyderabad",
  },
];
