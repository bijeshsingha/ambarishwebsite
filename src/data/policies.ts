export interface PolicySection {
  title: string;
  items: string[];
}

export const HOTEL_POLICIES: PolicySection[] = [
  {
    title: "Check-in & Check-out Policies",
    items: [
      "Standard Check-in Time: 12:00 PM (Noon).",
      "Standard Check-out Time: 11:00 AM.",
      "Early Check-in between 06:00 AM and 12:00 PM is subject to room availability upon arrival (nominal early-charge may apply for before 8:00 AM).",
      "Late Check-out up to 02:00 PM is subject to availability and prior front-desk approval.",
    ],
  },
  {
    title: "Mandatory Government Photo ID Proof",
    items: [
      "As per government regulations, all adult guests (18+ years) must present a valid physical Government Photo ID with address proof at the time of check-in.",
      "Accepted ID Proofs for Indian Nationals: Aadhaar Card, Passport, Voter ID Card, or Driving License. (PAN Card is NOT accepted as ID/Address proof as per statutory norms).",
      "Foreign Nationals must present a valid Passport along with an active Indian Visa or OCI card.",
    ],
  },
  {
    title: "Cancellation & Refund Terms",
    items: [
      "Free Cancellation: Cancellations made at least 24 hours prior to the standard check-in time (12:00 PM on arrival date) are eligible for a 100% refund of the deposit paid.",
      "Late Cancellation / No-Show: Cancellations made within 24 hours of check-in or failure to arrive on the booked date will attract a retention charge equivalent to 1 night's room tariff + taxes.",
      "Refund Processing: Eligible refunds for payments made via Razorpay / Card / UPI are processed back to the original source account within 5 to 7 business days.",
    ],
  },
  {
    title: "Child & Extra Bed Policy",
    items: [
      "Children stay complimentary (FREE of charge) when sharing existing bedding with parents.",
      "Extra adult (Pax) beyond standard room double occupancy (2 adults): ₹500 per night (inclusive of extra mattress bed and fresh linens).",
      "Extra rollaway mattress provided upon request at the front desk.",
    ],
  },
  {
    title: "General Hotel Code & Safety",
    items: [
      "All guest rooms and public indoor areas are strictly 100% Non-Smoking.",
      "Visitors are permitted in the lobby area; overnight stay of unregistered guests in guest rooms is strictly prohibited.",
      "24/7 CCTV surveillance is maintained in all common corridors, lobby, and parking areas for guest safety.",
    ],
  },
];

export interface FAQItem {
  question: string;
  answer: string;
  category: "booking" | "location" | "dining" | "services";
}

export const FAQS: FAQItem[] = [
  {
    question: "How close is Hotel Ambarish to Guwahati Railway Station?",
    answer: "Hotel Ambarish Grand Residency is located just 250 meters (a 2-3 minute easy walk) from the Paltan Bazaar exit of Guwahati Railway Station, making it the most convenient stay in Guwahati for rail passengers.",
    category: "location",
  },
  {
    question: "Is car parking available on property?",
    answer: "Yes, we provide secure, covered on-site car and two-wheeler parking for our resident guests at zero additional charge.",
    category: "services",
  },
  {
    question: "What are the restaurant and breakfast timings?",
    answer: "Our in-house multi-cuisine restaurant serves breakfast from 7:30 AM to 10:30 AM, lunch from 12:30 PM to 3:30 PM, and dinner until 10:45 PM. Room service is operational 24/7.",
    category: "dining",
  },
  {
    question: "Can I get a corporate tax invoice with my company's GSTIN?",
    answer: "Yes, absolutely! During checkout or at our front desk, simply provide your company name and GSTIN number, and we will issue an official B2B GST tax invoice.",
    category: "booking",
  },
  {
    question: "Do you assist with airport transfers and local sightseeing?",
    answer: "Yes, our travel concierge desk assists with reliable AC taxi pickups and drops to Lokpriya Gopinath Bordoloi Airport (21 km away) as well as day tours to Maa Kamakhya Temple, Umananda Island, and Pobitora Wildlife Sanctuary.",
    category: "services",
  },
  {
    question: "Is high-speed Wi-Fi included in the room rate?",
    answer: "Yes, uninterrupted high-speed Wi-Fi is complimentary for all guests across all rooms and common areas.",
    category: "services",
  },
];
