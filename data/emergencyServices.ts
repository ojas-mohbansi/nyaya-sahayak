export interface EmergencyService {
  id: string;
  name: string;
  number: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

export const emergencyServices: EmergencyService[] = [
  {
    id: "women",
    name: "Women's Helpline",
    number: "181",
    description: "National Commission for Women helpline for women in distress",
    icon: "heart",
    color: "#783232",
    features: [
      "24/7 toll-free helpline",
      "Auto-SMS with your location",
      "One-tap dial",
      "Counselling support",
    ],
  },
  {
    id: "police",
    name: "Police Emergency",
    number: "100",
    description: "Dial for any police emergency or crime reporting",
    icon: "shield",
    color: "#2d3e50",
    features: [
      "Available 24/7",
      "Quick dial with GPS coordinates",
      "Crime reporting",
      "Nearest patrol dispatch",
    ],
  },
  {
    id: "ambulance",
    name: "Ambulance / Road Accident",
    number: "108",
    description: "Emergency ambulance service for medical emergencies",
    icon: "activity",
    color: "#ef4444",
    features: [
      "Free ambulance service",
      "Location sharing for quick response",
      "Available across India",
      "Trauma care equipped",
    ],
  },
  {
    id: "legal-aid",
    name: "Legal Aid Helpline",
    number: "15100",
    description: "NALSA toll-free helpline for free legal aid and advice",
    icon: "book-open",
    color: "#c8aa78",
    features: [
      "NALSA toll-free connection",
      "Free legal advice",
      "Lawyer referral service",
      "Available in multiple languages",
    ],
  },
  {
    id: "child",
    name: "Child Helpline",
    number: "1098",
    description: "For children in distress or danger",
    icon: "users",
    color: "#2d7a4f",
    features: [
      "24/7 toll-free helpline",
      "Child rescue",
      "Missing children",
      "Child abuse reporting",
    ],
  },
  {
    id: "disaster",
    name: "Disaster Management",
    number: "1078",
    description: "National Disaster Management helpline",
    icon: "alert-triangle",
    color: "#b07d2a",
    features: [
      "Flood/earthquake/cyclone help",
      "Evacuation coordination",
      "Relief information",
      "24/7 availability",
    ],
  },
  {
    id: "mental-health",
    name: "iCall Mental Health",
    number: "9152987821",
    description: "Free mental health counselling and support",
    icon: "phone",
    color: "#4a2d6e",
    features: [
      "Free counselling service",
      "Trained psychologists",
      "Confidential helpline",
      "Mon–Sat, 8am to 10pm",
    ],
  },
  {
    id: "senior-citizen",
    name: "Senior Citizen Helpline",
    number: "14567",
    description: "Dedicated helpline for senior citizens in distress",
    icon: "users",
    color: "#2d3e50",
    features: [
      "Elder abuse reporting",
      "Medical emergency referral",
      "Legal aid for seniors",
      "24/7 toll-free",
    ],
  },
];
