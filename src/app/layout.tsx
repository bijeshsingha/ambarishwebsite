import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyBar from "@/components/layout/MobileStickyBar";
import { HOTEL_INFO } from "@/data/hotel-info";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0C0B0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hotelambarish.com"),
  title: "Hotel Ambarish Grand Residency by Divine View | 3-Star Hotel in Paltan Bazaar, Guwahati",
  description:
    "Official website of Hotel Ambarish Grand Residency by Divine View, Paltan Bazaar, Guwahati. 250m from Guwahati Railway Station. Deluxe rooms, executive suites, in-house dining, banquet halls, and secure direct booking.",
  keywords: [
    "Hotel Ambarish Grand Residency by Divine View",
    "Hotel Ambarish Grand Residency",
    "Hotel Ambarish Guwahati",
    "Hotel near Guwahati Railway Station",
    "Paltan Bazaar Hotel",
    "3 star hotel in Guwahati",
    "Ambarish Hotel direct booking",
    "Hotel Divine View Guwahati",
  ],
  authors: [{ name: "Hotel Ambarish Grand Residency by Divine View" }],
  alternates: {
    canonical: "https://hotelambarish.com",
  },
  openGraph: {
    title: "Hotel Ambarish Grand Residency by Divine View | Guwahati",
    description: "Comfortable Guwahati stays, made simple. Best rate guarantee with instant direct booking.",
    url: "https://hotelambarish.com",
    siteName: "Hotel Ambarish Grand Residency by Divine View",
    images: [
      {
        url: "/images/polished/hotel-exterior.webp",
        width: 1600,
        height: 900,
        alt: "Hotel Ambarish Grand Residency by Divine View Guwahati",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Ambarish Grand Residency by Divine View | Guwahati",
    description: "Comfortable Guwahati stays, made simple. Best rate guarantee with instant direct booking.",
    images: ["/images/polished/hotel-exterior.webp"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Hotel Entity
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: HOTEL_INFO.name,
    description: "3-Star Business & Transit Hotel in Paltan Bazaar, Guwahati.",
    starRating: {
      "@type": "Rating",
      ratingValue: "3",
    },
    telephone: HOTEL_INFO.phoneRaw,
    email: HOTEL_INFO.email,
    url: "https://hotelambarish.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: HOTEL_INFO.address.street,
      addressLocality: HOTEL_INFO.address.city,
      addressRegion: HOTEL_INFO.address.state,
      postalCode: HOTEL_INFO.address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: HOTEL_INFO.coordinates.lat,
      longitude: HOTEL_INFO.coordinates.lng,
    },
    checkinTime: "11:00",
    checkoutTime: "12:00",
    amenityFeature: HOTEL_INFO.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    priceRange: "₹₹",
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col justify-between bg-[#0C0B0B] text-[#F5EBDD] selection:bg-[#B4872F] selection:text-white">
        <Header />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer />
        <MobileStickyBar />
      </body>
    </html>
  );
}
