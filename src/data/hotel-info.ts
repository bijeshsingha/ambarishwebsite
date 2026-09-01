export interface HotelInfo {
  name: string;
  tagline: string;
  starRating: number;
  category: string;
  phone: string;
  phoneRaw: string;
  altPhone: string;
  email: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    full: string;
    landmark: string;
  };
  checkInTime: string;
  checkOutTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  transportDistances: {
    name: string;
    distance: string;
    time: string;
    type: "rail" | "air" | "bus" | "landmark";
  }[];
}

export const HOTEL_INFO: HotelInfo = {
  name: "Hotel Ambarish Grand Residency by Divine View",
  tagline: "A comfortable Guwahati stay, made simple.",
  starRating: 3,
  category: "3-Star Business & Transit Hotel",
  phone: "088220 41211",
  phoneRaw: "+918822041211",
  altPhone: "+91 361 273 4500",
  email: "reservation.ambarish@gmail.com",
  address: {
    street: "Md Shah Road, Paltan Bazaar",
    area: "Paltan Bazaar",
    city: "Guwahati",
    state: "Assam",
    pincode: "781008",
    full: "Md Shah Road, Paltan Bazaar, Guwahati, Assam 781008",
    landmark: "200 meters from Guwahati Railway Station",
  },
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
  coordinates: {
    lat: 26.1824,
    lng: 91.7516,
  },
  amenities: [
    "High-Speed Wi-Fi",
    "24/7 Front Desk & Security",
    "In-House Multi-Cuisine Restaurant",
    "Conference & Banquet Facilities",
    "Secure On-Site Car Parking",
    "24-Hour Power Backup",
    "Daily Housekeeping & Room Service",
    "Travel & Cab Assistance",
    "Elevator / Lift Access",
    "Doctor on Call",
  ],
  transportDistances: [
    {
      name: "Guwahati Railway Station (Paltan Bazaar Side)",
      distance: "250 meters",
      time: "3 mins walk",
      type: "rail",
    },
    {
      name: "Paltan Bazaar ASTC Bus Terminus",
      distance: "400 meters",
      time: "5 mins walk",
      type: "bus",
    },
    {
      name: "ISBT (Inter-State Bus Terminus) Betkuchi",
      distance: "8.5 km",
      time: "20 mins drive",
      type: "bus",
    },
    {
      name: "Lokpriya Gopinath Bordoloi Airport (GAU)",
      distance: "21.5 km",
      time: "40 mins drive",
      type: "air",
    },
    {
      name: "Maa Kamakhya Temple (Nilachal Hill)",
      distance: "7.2 km",
      time: "20 mins drive",
      type: "landmark",
    },
    {
      name: "Brahmaputra Riverfront / Fancy Bazaar",
      distance: "2.1 km",
      time: "8 mins drive",
      type: "landmark",
    },
  ],
};
