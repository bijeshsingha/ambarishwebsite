export interface MenuItem {
  name: string;
  category: "Breakfast" | "Snacks & Starters" | "Chinese" | "Main Course" | "Rice & Biryani" | "Salads & Raita" | "Beverages";
  description?: string;
  isVeg: boolean;
  price: number;
  pieces?: string;
  isSpecial?: boolean;
  image?: string;
}

export interface FeaturedDish {
  id: string;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  image: string;
  tag: string;
  description: string;
}

export interface DiningInfo {
  name: string;
  tagline: string;
  description: string;
  intercom: {
    reception: string;
    restaurant: string;
    orderPreparationTime: string;
  };
  timings: {
    meal: string;
    hours: string;
    description: string;
  }[];
  features: string[];
  fullMenu: MenuItem[];
  featuredDishes: FeaturedDish[];
  images: string[];
}

export const DINING_INFO: DiningInfo = {
  name: "The Ambarish Restaurant",
  tagline: "Authentic Assamese specialties, wholesome North Indian main courses, and freshly cooked Chinese delicacies.",
  description:
    "The Ambarish Restaurant serves hotel guests and visitors with an extensive breakfast and à la carte menu cooked fresh to order. From traditional Assamese Fish Tenga and Aloo Pitika to rich Chicken Butter Masala and sizzling Chinese noodles, our culinary team delivers comforting flavors with prompt in-room dining service.",
  intercom: {
    reception: "555",
    restaurant: "9",
    orderPreparationTime: "40 Mins",
  },
  timings: [
    {
      meal: "Breakfast Service",
      hours: "08:00 AM – 11:00 AM",
      description: "Hot Puri Sabji, Parathas, Omelettes, Toast, Sandwiches, Assam Milk Tea, and Coffee.",
    },
    {
      meal: "À La Carte Lunch & Dinner",
      hours: "12:00 Noon – 10:45 PM",
      description: "Complete multi-cuisine menu: Assamese curries, Chicken/Mutton mains, Chinese wok favorites, and Biryanis.",
    },
    {
      meal: "In-Room Dining (Intercom Ext 9)",
      hours: "24 Hours",
      description: "Prompt room delivery with hot trays (Order preparation time: approx. 40 minutes).",
    },
  ],
  features: [
    "100% freshly cooked to order with authentic local spices",
    "Special Assamese preparations: Fish Tenga, Fish Sarso, and Aloo Pitika",
    "Dedicated pure-vegetarian options and separate prep counters",
    "Direct in-room dining delivery via Ext 9 / Ext 555",
    "Comfortable air-conditioned restaurant dining hall",
  ],
  images: [
    "/images/polished/restaurant-dining.webp",
    "/images/polished/restaurant-empty-symmetrical.webp",
    "/images/polished/restaurant-empty-angle-1.webp",
    "/images/polished/restaurant-empty-angle-2.webp",
    "/images/polished/restaurant-empty-portrait.webp",
  ],
  featuredDishes: [
    {
      id: "dish-1",
      name: "Chicken Butter Masala",
      category: "North Indian Main Course",
      price: 250,
      isVeg: false,
      image: "/images/dining/chicken-butter-masala.webp",
      tag: "Chef's Special",
      description: "Succulent chicken cooked in a creamy, velvety spiced tomato gravy infused with butter and kasuri methi.",
    },
    {
      id: "dish-2",
      name: "Chicken Dum Biryani",
      category: "Rice & Biryani",
      price: 250,
      isVeg: false,
      image: "/images/dining/chicken-biryani.webp",
      tag: "House Bestseller",
      description: "Fragrant long-grain basmati rice slow-cooked with spiced chicken pieces, saffron, and whole roasted spices.",
    },
    {
      id: "dish-3",
      name: "Chole Bhature",
      category: "Breakfast Specialty",
      price: 90,
      isVeg: true,
      image: "/images/dining/chole-bhature.webp",
      tag: "Morning Favorite",
      description: "Two freshly fried golden bhatures served hot with rich chickpea curry, pickled onions, and tangy green chutney.",
    },
    {
      id: "dish-4",
      name: "Chilli Paneer (Dry)",
      category: "Chinese Indo-Wok",
      price: 250,
      isVeg: true,
      image: "/images/dining/chilli-paneer-dry.webp",
      tag: "Wok Star",
      description: "Crispy paneer cubes wok-tossed with fresh bell peppers, green chillies, and savory dark soy glaze.",
    },
  ],
  fullMenu: [
    // --- BREAKFAST (8:00 AM - 11:00 AM) ---
    { name: "Bread Toast", category: "Breakfast", isVeg: true, price: 50 },
    { name: "Plain Bread with Butter / Jam", category: "Breakfast", isVeg: true, price: 50 },
    { name: "Bread Omelet", category: "Breakfast", isVeg: false, price: 80 },
    { name: "French Toast", category: "Breakfast", isVeg: false, price: 110 },
    { name: "3pc Puri Sabji", category: "Breakfast", isVeg: true, price: 80, isSpecial: true },
    { name: "2pc Roti Sabji", category: "Breakfast", isVeg: true, price: 80 },
    { name: "2pc Plain Paratha with Sabjee", category: "Breakfast", isVeg: true, price: 100 },
    {
      name: "Chole Bhatore",
      category: "Breakfast",
      isVeg: true,
      price: 90,
      isSpecial: true,
      image: "/images/dining/chole-bhature.webp",
      description: "Piping hot fluffy bhatures served with spiced Punjabi chole curry.",
    },
    { name: "Aloo Paratha (1pc)", category: "Breakfast", isVeg: true, price: 70 },
    { name: "Onion Paratha (1pc)", category: "Breakfast", isVeg: true, price: 70 },
    { name: "Paneer Paratha (1pc)", category: "Breakfast", isVeg: true, price: 120 },
    { name: "Plain Paratha (1pc)", category: "Breakfast", isVeg: true, price: 40 },
    { name: "Tawa Roti", category: "Breakfast", isVeg: true, price: 20 },
    { name: "Butter Roti", category: "Breakfast", isVeg: true, price: 30 },
    { name: "Boil Egg (2 pcs)", category: "Breakfast", isVeg: false, price: 50 },
    { name: "Masala / Plain Omelette", category: "Breakfast", isVeg: false, price: 70 },
    { name: "Egg Bhurji", category: "Breakfast", isVeg: false, price: 120 },
    { name: "Milk Tea", category: "Beverages", isVeg: true, price: 40 },
    { name: "Black Tea", category: "Beverages", isVeg: true, price: 30 },
    { name: "Milk Coffee", category: "Beverages", isVeg: true, price: 60 },
    { name: "Black Coffee", category: "Beverages", isVeg: true, price: 50 },
    { name: "Hot Milk", category: "Beverages", isVeg: true, price: 80 },

    // --- SNACKS ---
    { name: "French Fries", category: "Snacks & Starters", isVeg: true, price: 150 },
    { name: "Peanut Masala", category: "Snacks & Starters", isVeg: true, price: 120 },
    { name: "Vegetable Pakoda", category: "Snacks & Starters", isVeg: true, price: 150 },
    { name: "Onion Ring Pakoda", category: "Snacks & Starters", isVeg: true, price: 160 },
    { name: "Egg Pakoda (6pc)", category: "Snacks & Starters", isVeg: false, price: 180 },
    { name: "Paneer Pakoda", category: "Snacks & Starters", isVeg: true, price: 220 },
    { name: "Chicken Pakoda", category: "Snacks & Starters", isVeg: false, price: 220, isSpecial: true },

    // --- CHINESE STARTERS & MAIN COURSE ---
    { name: "American Corn Salt Pepper", category: "Chinese", isVeg: true, price: 250 },
    { name: "Crispy Chilly Baby Corn", category: "Chinese", isVeg: true, price: 250 },
    {
      name: "Chilly Paneer (Dry/Gravy)",
      category: "Chinese",
      isVeg: true,
      price: 250,
      isSpecial: true,
      image: "/images/dining/chilli-paneer-dry.webp",
      description: "Crisp cottage cheese tossed in spicy soy-chilli gravy with peppers.",
    },
    { name: "Veg. Manchurian (Dry/Gravy) 8pc", category: "Chinese", isVeg: true, price: 250 },
    { name: "Crispy Chicken Dry", category: "Chinese", isVeg: false, price: 300, isSpecial: true },
    { name: "Chilly Chicken (Dry/Gravy) 8pc", category: "Chinese", isVeg: false, price: 250, isSpecial: true },
    { name: "Chicken 65 Dry", category: "Chinese", isVeg: false, price: 250 },
    { name: "Chicken Manchurian (Dry/Gravy) 8pc", category: "Chinese", isVeg: false, price: 250 },
    { name: "Chicken in Hot Garlic Sauce (Dry/Gravy) 8pc", category: "Chinese", isVeg: false, price: 250 },
    { name: "Garlic Chicken (Gravy) 8pc", category: "Chinese", isVeg: false, price: 150 },
    { name: "Veg. Hakka Noodles", category: "Chinese", isVeg: true, price: 180 },
    { name: "Egg Hakka Noodles", category: "Chinese", isVeg: false, price: 180 },
    { name: "Chicken Hakka Noodles", category: "Chinese", isVeg: false, price: 200 },
    { name: "Vegetable Fried Rice", category: "Chinese", isVeg: true, price: 150 },
    { name: "Egg Fried Rice", category: "Chinese", isVeg: false, price: 180 },
    { name: "Chicken Fried Rice", category: "Chinese", isVeg: false, price: 200 },
    { name: "Vegetable Gravy Noodles", category: "Chinese", isVeg: true, price: 200 },
    { name: "Chicken Gravy Noodles", category: "Chinese", isVeg: false, price: 230 },

    // --- MAIN COURSE (NON-VEG & ASSAMESE) ---
    {
      name: "Chicken Butter Masala",
      category: "Main Course",
      isVeg: false,
      price: 250,
      isSpecial: true,
      image: "/images/dining/chicken-butter-masala.webp",
      description: "Rich buttery tomato gravy with tender boneless/bone-in chicken.",
    },
    { name: "Chicken Bharta", category: "Main Course", isVeg: false, price: 280, isSpecial: true },
    { name: "Kadai Chicken", category: "Main Course", isVeg: false, price: 280 },
    { name: "Chicken Masala", category: "Main Course", isVeg: false, price: 230 },
    { name: "Chicken Curry", category: "Main Course", isVeg: false, price: 230 },
    { name: "Chicken Rogan", category: "Main Course", isVeg: false, price: 230 },
    { name: "Mutton Do Pyaza", category: "Main Course", isVeg: false, price: 350, isSpecial: true },
    { name: "Mutton Curry", category: "Main Course", isVeg: false, price: 350 },
    { name: "Mutton Kosha", category: "Main Course", isVeg: false, price: 350, isSpecial: true },
    { name: "Fish Fry (2pcs)", category: "Main Course", isVeg: false, price: 180 },
    { name: "Fish Masala (2pcs)", category: "Main Course", isVeg: false, price: 200 },
    { name: "Fish Curry (2pcs)", category: "Main Course", isVeg: false, price: 200 },
    { name: "Fish Tenga (2pcs - Traditional Assamese)", category: "Main Course", isVeg: false, price: 200, isSpecial: true },
    { name: "Fish Sarso (2pcs - Mustard Curry)", category: "Main Course", isVeg: false, price: 200, isSpecial: true },
    { name: "Egg Curry (2pcs)", category: "Main Course", isVeg: false, price: 120 },
    { name: "Egg Masala", category: "Main Course", isVeg: false, price: 130 },
    { name: "Egg Kosha", category: "Main Course", isVeg: false, price: 130 },

    // --- MAIN COURSE (VEGETARIAN & PANEER) ---
    { name: "Paneer Butter Masala", category: "Main Course", isVeg: true, price: 250, isSpecial: true },
    { name: "Paneer Do Pyaza", category: "Main Course", isVeg: true, price: 250 },
    { name: "Kadai Paneer", category: "Main Course", isVeg: true, price: 250 },
    { name: "Palak Paneer (Seasonal)", category: "Main Course", isVeg: true, price: 250 },
    { name: "Paneer Nakma", category: "Main Course", isVeg: true, price: 300, isSpecial: true },
    { name: "Aloo Dum", category: "Main Course", isVeg: true, price: 170 },
    { name: "Aloo Matar", category: "Main Course", isVeg: true, price: 180 },
    { name: "Boil Vegetable", category: "Main Course", isVeg: true, price: 150 },
    { name: "Aloo Jeera", category: "Main Course", isVeg: true, price: 90 },
    { name: "Aloo Bhaji", category: "Main Course", isVeg: true, price: 90 },
    { name: "Aloo Pitika (Authentic Assamese)", category: "Main Course", isVeg: true, price: 80, isSpecial: true },
    { name: "Plain Dal", category: "Main Course", isVeg: true, price: 120 },
    { name: "Pili Dal Fry", category: "Main Course", isVeg: true, price: 150 },
    { name: "Pili Dal Tadka", category: "Main Course", isVeg: true, price: 150 },

    // --- RICE & BIRYANI ---
    {
      name: "Chicken Biryani",
      category: "Rice & Biryani",
      isVeg: false,
      price: 250,
      isSpecial: true,
      image: "/images/dining/chicken-biryani.webp",
      description: "Layered dum cooked basmati rice with aromatic spices & spiced chicken.",
    },
    { name: "Chicken Pulao", category: "Rice & Biryani", isVeg: false, price: 220 },
    { name: "Vegetable Pulao", category: "Rice & Biryani", isVeg: true, price: 200 },
    { name: "Jeera Rice", category: "Rice & Biryani", isVeg: true, price: 180 },
    { name: "Plain Khichdi", category: "Rice & Biryani", isVeg: true, price: 180 },
    { name: "Steam Rice (Basmati)", category: "Rice & Biryani", isVeg: true, price: 150 },
    { name: "Steam Rice (Regular)", category: "Rice & Biryani", isVeg: true, price: 90 },

    // --- PAPAD, SALAD & RAITA ---
    { name: "Papad Bhurji", category: "Salads & Raita", isVeg: true, price: 80 },
    { name: "Roasted / Fry Papad (2pc)", category: "Salads & Raita", isVeg: true, price: 50 },
    { name: "Green Salad", category: "Salads & Raita", isVeg: true, price: 100 },
    { name: "Kuchumber Salad", category: "Salads & Raita", isVeg: true, price: 100 },
    { name: "Onion Salad", category: "Salads & Raita", isVeg: true, price: 100 },
    { name: "Plain Raita", category: "Salads & Raita", isVeg: true, price: 70 },
    { name: "Mix Raita", category: "Salads & Raita", isVeg: true, price: 90 },
  ],
};

export interface BarHighlight {
  name: string;
  category: string;
  description: string;
}

export interface BarInfo {
  name: string;
  tagline: string;
  description: string;
  hours: string;
  location: string;
  ambiance: string;
  features: string[];
  images: {
    src: string;
    alt: string;
    caption: string;
  }[];
  highlights: BarHighlight[];
}

export const PAVILLION_BAR_INFO: BarInfo = {
  name: "Pavillion Bar",
  tagline: "An intimate, sophisticated lounge for fine spirits, chilled draughts, and evening unwinding.",
  description:
    "Located on the 2nd floor of Hotel Ambarish Grand Residency, Pavillion Bar provides a welcoming retreat for corporate travelers, transit guests, and friends. Featuring an extensive collection of premium whiskeys, single malts, spirits, chilled beers, and classic cocktails, accompanied by sizzling hot tandoori and Chinese appetizers freshly prepared from our kitchen.",
  hours: "11:00 AM – 11:00 PM Daily",
  location: "2nd Floor, Hotel Ambarish Grand Residency, Paltan Bazaar, Guwahati",
  ambiance: "Warm mood lighting, plush leather lounge seating, ambient music, and attentive personalized service.",
  features: [
    "Extensive domestic & imported spirits, single malts & scotch",
    "Chilled beers, fine wines, and classic cocktail creations",
    "Sizzling bar bites: Chicken Tikka, Chilli Paneer, Crispy Corn & Kebabs",
    "Plush air-conditioned lounge setting with privacy and comfort",
    "Dedicated table service for business catch-ups or quiet evening relaxation",
  ],
  images: [
    {
      src: "/images/bar/bar1-lounge-seating.webp",
      alt: "Pavillion Bar Plush Lounge Seating - Hotel Ambarish Guwahati",
      caption: "Intimate lounge seating with warm ambient lighting",
    },
    {
      src: "/images/bar/bar2-lounge-wide.webp",
      alt: "Pavillion Bar Wide Hall View - Hotel Ambarish",
      caption: "Spacious air-conditioned lounge ambiance",
    },
    {
      src: "/images/bar/bar3-counter-view.webp",
      alt: "Pavillion Bar Counter & Spirits Display - Hotel Ambarish",
      caption: "Curated spirits display and full bar service counter",
    },
    {
      src: "/images/bar/bar4-lounge-angle.webp",
      alt: "Pavillion Bar Corner Seating Angle - Hotel Ambarish",
      caption: "Comfortable booth and corner arrangements for private discussions",
    },
    {
      src: "/images/bar/bar5-entrance-sign.webp",
      alt: "Pavillion Bar Entrance & Signage - Hotel Ambarish",
      caption: "Welcoming 2nd floor entrance to Pavillion Bar",
    },
  ],
  highlights: [
    {
      name: "Fine Spirits & Single Malts",
      category: "Premium Spirits",
      description: "Carefully curated labels across single malts, blended Scotch, premium vodkas, and aged rums.",
    },
    {
      name: "Chilled Brews & Frosted Glasses",
      category: "Beers & Ciders",
      description: "Ice-cold bottled beers and lagers served at optimal temperature for refreshing evenings.",
    },
    {
      name: "Handcrafted Mixed Drinks",
      category: "Cocktails & Coolers",
      description: "Classics including Mojitos, Gin & Tonics, Whiskey Sours, and refreshing mocktails.",
    },
    {
      name: "Hot Sizzling Starters",
      category: "Kitchen Starters",
      description: "Freshly tossed tandoori kebabs, spicy chilli chicken, and crispy bites from our restaurant kitchen.",
    },
  ],
};

