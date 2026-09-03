import { HOTEL_INFO } from "@/data/hotel-info";

/**
 * Centralized Server Configuration Module
 * Single source of truth for environment variables, third-party integrations, and hotel metadata.
 */

function sanitizeSecret(val?: string): string {
  if (!val) return "";
  return val.replace(/^["']|["']$/g, "").replace(/\s+/g, "");
}

export const serverConfig = {
  pms: {
    apiUrl: (process.env.PMS_API_URL || "http://localhost:3000/api/v1").replace(/\/+$/, ""),
    apiKey: process.env.PMS_API_SECRET || "ambarish_pms_secret_2026",
    propertyId: process.env.PMS_PROPERTY_ID || "prop_ambarish",
  },
  mail: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: (process.env.SMTP_USER || process.env.NOTIFICATION_EMAIL || HOTEL_INFO.email).trim(),
    pass: sanitizeSecret(process.env.SMTP_PASS),
    recipient: (process.env.NOTIFICATION_EMAIL || HOTEL_INFO.email).trim(),
  },
  app: {
    baseUrl: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005").replace(/\/+$/, ""),
  },
};
