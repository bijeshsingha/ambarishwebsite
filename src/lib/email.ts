import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { serverConfig } from "@/lib/config";
import { HOTEL_INFO } from "@/data/hotel-info";
import { formatCurrencyINR } from "@/lib/formatters";

/**
 * SEC 11 Hardened Email Subsystem
 * Features official branding, responsive luxury hotel layouts, and defensive transport locks.
 */

// Load and cache official hotel logo for CID attachment
let logoAttachment: { filename: string; content: Buffer; cid: string } | null = null;
try {
  const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
  if (fs.existsSync(logoPath)) {
    logoAttachment = {
      filename: "logo.png",
      content: fs.readFileSync(logoPath),
      cid: "hotelLogo",
    };
  }
} catch (e) {
  console.warn("[Email] Logo file load error:", e);
}

export interface ReservationEmailPayload {
  confirmationNo: string;
  bookingType?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  adults: number;
  children: number;
  bookedRooms?: Array<{
    roomName?: string;
    bedType?: string;
    ratePlanName?: string;
    pricePerNight?: number;
    quantity?: number;
  }>;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestCity?: string;
  guestState?: string;
  guestGstin?: string;
  companyName?: string;
  b2b?: {
    accountType?: string;
    companyName?: string;
    corporateEmail?: string;
    poNumber?: string;
    billingInstruction?: string;
  };
  specialRequests?: string;
  promoCode?: string;
  discountAmount?: number;
  baseAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  status?: string;
  adminConfirmToken?: string;
  paymentMethod?: string;
  paymentId?: string;
  offlineFallback?: boolean;
}

export interface EventEmailPayload {
  eventType: string;
  eventDate: string;
  attendees: string | number;
  seatingLayout?: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface B2bEmailPayload {
  companyName: string;
  accountType?: string;
  contactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  gstin?: string;
  city?: string;
  state?: string;
  estimatedMonthlyRoomNights?: number;
  requiredMealPlans?: string[];
  billingPreference?: string;
  message?: string;
}

/**
 * Escape HTML to prevent injection into email bodies (SEC 11)
 */
export function escapeHtml(unsafe: any): string {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strip CR/LF characters to prevent header injection in subject / addresses (SEC 11)
 */
export function sanitizeHeader(str: any): string {
  if (!str) return "";
  return String(str).replace(/[\r\n]+/g, " ").trim();
}

/**
 * Creates and returns configured Nodemailer transporter with defensive locks
 */
function getMailTransporter() {
  const { host, port, user, pass } = serverConfig.mail;

  if (!pass) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      // SEC 11: Defend against SSRF / local file access from untrusted templates
      disableFileAccess: true,
      disableUrlAccess: true,
    } as any),
    senderEmail: user,
  };
}

/**
 * Sends both Hotel Notification & Guest Confirmation Voucher emails
 */
export async function sendReservationNotificationEmails(payload: ReservationEmailPayload) {
  const recipientEmail = serverConfig.mail.recipient;
  const mailSetup = getMailTransporter();

  const safeConfNo = escapeHtml(payload.confirmationNo);
  const safeGuestName = escapeHtml(payload.guestName);
  const safeGuestPhone = escapeHtml(payload.guestPhone);
  const safeGuestEmail = escapeHtml(payload.guestEmail);
  const safeGuestCity = escapeHtml(payload.guestCity || "");
  const safeGuestState = escapeHtml(payload.guestState || "");
  const safeSpecialRequests = escapeHtml(payload.specialRequests || "");
  const safePromoCode = escapeHtml(payload.promoCode || "");
  const safePaymentMethod = escapeHtml(payload.paymentMethod || "PAY_AT_HOTEL");
  const safePaymentId = escapeHtml(payload.paymentId || "");

  // Format phone number for WhatsApp
  const cleanPhoneDigits = String(payload.guestPhone || "").replace(/[^0-9]/g, "");
  const waPhone = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits;
  const waMessage = encodeURIComponent(
    `Namaste ${payload.guestName}, this is Hotel Ambarish Grand Residency regarding your direct reservation request #${payload.confirmationNo} (${payload.nights} night${payload.nights > 1 ? "s" : ""}, check-in ${payload.checkIn}). We look forward to confirming your stay with us.`
  );

  const roomsHtml = payload.bookedRooms && payload.bookedRooms.length > 0
    ? payload.bookedRooms.map((rm) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715; vertical-align: top;">
            <div style="font-weight: 600; color: #1A1715;">${escapeHtml(rm.quantity || 1)}x ${escapeHtml(rm.roomName || "Double Deluxe Room")}</div>
            ${rm.bedType ? `<div style="color: #7D756E; font-size: 11px; margin-top: 2px;">Bed: ${escapeHtml(rm.bedType)}</div>` : ""}
            <div style="font-size: 11px; color: #9A7228; font-weight: 600; margin-top: 2px;">${escapeHtml(rm.ratePlanName || "European Plan")}</div>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #F0ECE6; text-align: right; font-family: monospace; font-size: 13px; font-weight: 700; color: #1A1715; vertical-align: top; white-space: nowrap;">
            ${formatCurrencyINR((rm.pricePerNight || 0) * (rm.quantity || 1))}/night
          </td>
        </tr>
      `).join("")
    : `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">
          <strong>${escapeHtml(payload.rooms)}x Reserved Rooms</strong>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #F0ECE6; text-align: right; font-family: monospace; font-size: 13px; font-weight: 700; color: #1A1715; white-space: nowrap;">
          ${formatCurrencyINR(payload.baseAmount || 0)}
        </td>
      </tr>
    `;

  // =========================================================================
  // HOTEL OPERATIONS NOTIFICATION TEMPLATE
  // =========================================================================
  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Notification - Hotel Ambarish</title>
      <style>
        body { margin: 0; padding: 0; background-color: #F6F4F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F6F4F0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E6DFD5; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              
              <!-- Brand Logo Header -->
              <tr>
                <td style="padding: 30px 24px 22px; text-align: center; background-color: #FAF8F5; border-bottom: 2px solid #C5A059;">
                  <img src="cid:hotelLogo" alt="Hotel Ambarish Grand Residency by Divine View" width="220" style="display: block; width: 220px; max-width: 85%; height: auto; margin: 0 auto;" />
                  <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 10.5px; letter-spacing: 2.5px; text-transform: uppercase; color: #8C7355; margin-top: 10px; font-weight: 600;">
                    Paltan Bazaar • Guwahati • Assam
                  </div>
                </td>
              </tr>

              <!-- Header Status Ribbon -->
              <tr>
                <td style="background-color: #1A1715; padding: 12px 24px; text-align: center;">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #D8C3A5;">
                    ${payload.paymentMethod === "RAZORPAY" ? "DIRECT RESERVATION CONFIRMED" : "DIRECT RESERVATION REQUEST • CALL VERIFICATION"}
                  </span>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 28px 28px 24px;">

                  <!-- Reference Banner & Amount -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                    <tr>
                      <td style="vertical-align: middle;">
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7D756E; font-weight: 600; display: block; margin-bottom: 2px;">
                          Booking Reference
                        </span>
                        <span style="font-family: monospace; font-size: 18px; font-weight: 700; color: #9A7228; letter-spacing: 1px;">
                          ${safeConfNo}
                        </span>
                      </td>
                      <td style="text-align: right; vertical-align: middle;">
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7D756E; font-weight: 600; display: block; margin-bottom: 2px;">
                          Total Tariff
                        </span>
                        <span style="font-size: 20px; font-weight: 700; color: #1A1715; font-family: Georgia, serif;">
                          ${formatCurrencyINR(payload.totalAmount || 0)}
                        </span>
                      </td>
                    </tr>
                  </table>

                  ${payload.paymentMethod !== "RAZORPAY" ? `
                    <!-- Front Desk Quick Action Hub -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; border: 1.5px solid #D8C3A5; border-radius: 12px; margin-bottom: 24px; overflow: hidden;">
                      <tr>
                        <td style="padding: 18px 20px;">
                          <div style="display: inline-block; background-color: #9A7228; color: #FFFFFF; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; margin-bottom: 8px;">
                            Action Required: Call to Confirm
                          </div>
                          <div style="font-family: Georgia, serif; font-size: 16px; font-weight: 600; color: #1A1715; margin-bottom: 6px;">
                            Verify Live Availability with Guest
                          </div>
                          <p style="margin: 0 0 16px; font-size: 13px; color: #5C554E; line-height: 1.5;">
                            Guest <strong>${safeGuestName}</strong> selected <strong>Pay at Hotel</strong>. Zero advance payment is subject to room availability and demand. You may request an advance payment on call to guarantee reservation confirmation.
                          </p>

                          <!-- Action Buttons -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="border-radius: 6px; background-color: #1A1715;">
                                <a href="tel:${safeGuestPhone}" style="display: inline-block; padding: 10px 20px; font-size: 13px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px;">
                                  📞 Call ${safeGuestPhone}
                                </a>
                              </td>
                              <td style="width: 10px;"></td>
                              <td style="border-radius: 6px; background-color: #25D366;">
                                <a href="https://wa.me/${waPhone}?text=${waMessage}" target="_blank" style="display: inline-block; padding: 10px 18px; font-size: 13px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px;">
                                  💬 WhatsApp
                                </a>
                              </td>
                            </tr>
                          </table>

                          ${payload.adminConfirmToken ? `
                            <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 14px; width: 100%;">
                              <tr>
                                <td style="border-radius: 6px; background-color: #9A7228; text-align: center;">
                                  <a href="${serverConfig.app.baseUrl}/desk/confirm?reference=${encodeURIComponent(safeConfNo)}&token=${encodeURIComponent(payload.adminConfirmToken)}" target="_blank" style="display: block; padding: 11px 18px; font-size: 13px; font-weight: 700; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px;">
                                    ✅ Confirm Reservation &amp; Dispatch Voucher &rarr;
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <div style="font-size: 11px; color: #7D756E; text-align: center; margin-top: 6px;">
                              Opens front desk verification screen with prompt before final confirmation.
                            </div>
                          ` : ""}
                        </td>
                      </tr>
                    </table>
                  ` : ""}

                  <!-- Guest & Stay Specification Table -->
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #9A7228; margin-bottom: 8px;">
                    Reservation Details
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #EAE4DC; border-radius: 10px; overflow: hidden; margin-bottom: 22px;">
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; width: 38%; font-weight: 500;">
                        Primary Guest
                      </td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">
                        ${safeGuestName}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; font-weight: 500;">
                        Contact Phone
                      </td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">
                        <a href="tel:${safeGuestPhone}" style="color: #1A1715; text-decoration: none;">${safeGuestPhone}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; font-weight: 500;">
                        Email Address
                      </td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">
                        ${safeGuestEmail}
                      </td>
                    </tr>
                    ${safeGuestCity || safeGuestState ? `
                      <tr>
                        <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; font-weight: 500;">
                          Guest Origin
                        </td>
                        <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">
                          ${[safeGuestCity, safeGuestState].filter(Boolean).join(", ")}
                        </td>
                      </tr>
                    ` : ""}
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; font-weight: 500;">
                        Stay Dates
                      </td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">
                        ${escapeHtml(payload.checkIn)} to ${escapeHtml(payload.checkOut)} (${payload.nights} ${payload.nights === 1 ? "Night" : "Nights"})
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; font-weight: 500;">
                        Hotel Policy Times
                      </td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #5C554E;">
                        Check-in: <strong>12:00 PM</strong> (Early check-in from 5:00 AM free of charge) &bull; Check-out: <strong>12:00 PM</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; font-weight: 500;">
                        Party Size
                      </td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">
                        ${payload.rooms} ${payload.rooms === 1 ? "Room" : "Rooms"} &bull; ${payload.adults} Adults ${payload.children > 0 ? `&bull; ${payload.children} Children` : ""}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; font-size: 12px; color: #7D756E; font-weight: 500;">
                        Payment Mode
                      </td>
                      <td style="padding: 10px 16px; font-size: 13px; font-weight: 600;">
                        ${payload.paymentMethod === "RAZORPAY"
                          ? `<span style="color: #047857;">Paid Online (Razorpay) Ref: ${safePaymentId}</span>`
                          : `<span style="color: #9A7228;">Pay at Hotel (Pending Call Verification & Desk Settlement)</span>`}
                      </td>
                    </tr>
                    ${safeSpecialRequests ? `
                      <tr>
                        <td style="padding: 10px 16px; border-top: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; font-weight: 500;">
                          Special Requests
                        </td>
                        <td style="padding: 10px 16px; border-top: 1px solid #F0ECE6; font-size: 13px; color: #9A7228;">
                          ${safeSpecialRequests}
                        </td>
                      </tr>
                    ` : ""}
                  </table>

                  <!-- Booked Inventory Breakdown -->
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #9A7228; margin-bottom: 8px;">
                    Reserved Room Categories
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #EAE4DC; border-radius: 10px; overflow: hidden; margin-bottom: 22px;">
                    ${roomsHtml}
                  </table>

                  <!-- Billing & Accounting Breakdown -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; border: 1px solid #EAE4DC; border-radius: 10px; padding: 14px 18px;">
                    <tr>
                      <td style="padding: 4px 0; font-size: 12px; color: #7D756E;">Base Room Tariff:</td>
                      <td style="padding: 4px 0; font-size: 13px; font-family: monospace; font-weight: 600; color: #1A1715; text-align: right;">${formatCurrencyINR(payload.baseAmount || 0)}</td>
                    </tr>
                    ${payload.discountAmount && payload.discountAmount > 0 ? `
                      <tr>
                        <td style="padding: 4px 0; font-size: 12px; color: #15803d;">Promo Discount (${safePromoCode || "SPECIAL"}):</td>
                        <td style="padding: 4px 0; font-size: 13px; font-family: monospace; font-weight: 600; color: #15803d; text-align: right;">-${formatCurrencyINR(payload.discountAmount)}</td>
                      </tr>
                    ` : ""}
                    <tr>
                      <td style="padding: 4px 0; font-size: 12px; color: #7D756E;">Taxes (GST SAC 996311):</td>
                      <td style="padding: 4px 0; font-size: 13px; font-family: monospace; font-weight: 600; color: #1A1715; text-align: right;">${formatCurrencyINR(payload.taxAmount || 0)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0 0; border-top: 1px solid #E2D9CD; font-size: 14px; font-weight: 700; color: #1A1715;">Total Payable Amount:</td>
                      <td style="padding: 10px 0 0; border-top: 1px solid #E2D9CD; font-size: 16px; font-weight: 700; color: #9A7228; text-align: right; font-family: Georgia, serif;">${formatCurrencyINR(payload.totalAmount || 0)}</td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 22px 24px; background-color: #FAF8F5; border-top: 1px solid #EAE4DC; text-align: center; font-size: 11px; color: #7D756E; line-height: 1.6;">
                  <strong style="color: #1A1715;">Hotel Ambarish Grand Residency by Divine View</strong><br/>
                  Md Shah Road, Paltan Bazaar, Guwahati, Assam 781008<br/>
                  Front Desk: <a href="tel:${HOTEL_INFO.phone}" style="color: #9A7228; text-decoration: none; font-weight: 600;">${HOTEL_INFO.phone}</a> &bull; Email: <a href="mailto:${HOTEL_INFO.email}" style="color: #9A7228; text-decoration: none;">${HOTEL_INFO.email}</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // =========================================================================
  // GUEST VOUCHER & CONFIRMATION TEMPLATE
  // =========================================================================
  const isConfirmedBooking = payload.paymentMethod === "RAZORPAY" || payload.status === "CONFIRMED";

  const guestHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Voucher - Hotel Ambarish Grand Residency</title>
      <style>
        body { margin: 0; padding: 0; background-color: #F6F4F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F6F4F0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E6DFD5; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              
              <!-- Brand Logo Header -->
              <tr>
                <td style="padding: 30px 24px 22px; text-align: center; background-color: #FAF8F5; border-bottom: 2px solid #C5A059;">
                  <img src="cid:hotelLogo" alt="Hotel Ambarish Grand Residency by Divine View" width="220" style="display: block; width: 220px; max-width: 85%; height: auto; margin: 0 auto;" />
                  <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 10.5px; letter-spacing: 2.5px; text-transform: uppercase; color: #8C7355; margin-top: 10px; font-weight: 600;">
                    Paltan Bazaar • Guwahati • Assam
                  </div>
                </td>
              </tr>

              <!-- Header Status Ribbon -->
              <tr>
                <td style="background-color: #1A1715; padding: 12px 24px; text-align: center;">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #D8C3A5;">
                    ${isConfirmedBooking ? "OFFICIAL RESERVATION CONFIRMATION • GUARANTEED" : "BOOKING REQUEST RECEIVED • CONFIRMATION PENDING"}
                  </span>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 28px 28px 24px;">

                  <p style="font-size: 15px; color: #1A1715; margin: 0 0 14px 0;">
                    Dear <strong>${safeGuestName}</strong>,
                  </p>

                  ${isConfirmedBooking ? `
                    <p style="font-size: 13px; color: #5C554E; line-height: 1.6; margin: 0 0 16px 0;">
                      Thank you for choosing Hotel Ambarish Grand Residency. Your reservation has been officially confirmed and guaranteed by our Front Desk. Your official booking voucher is presented below.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 10px; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 14px 18px; font-size: 13px; color: #166534; line-height: 1.5;">
                          <strong>✓ Reservation Confirmed &amp; Room Guaranteed</strong><br/>
                          Your room is held for arrival on <strong>${escapeHtml(payload.checkIn)}</strong>. Please present this voucher at our reception counter for express check-in.
                        </td>
                      </tr>
                    </table>
                  ` : `
                    <p style="font-size: 13px; color: #5C554E; line-height: 1.6; margin: 0 0 16px 0;">
                      Thank you for submitting your direct booking request for Hotel Ambarish Grand Residency in Paltan Bazaar, Guwahati.
                    </p>

                    <!-- Status Explanation Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; border: 1.5px solid #D8C3A5; border-radius: 12px; margin-bottom: 22px;">
                      <tr>
                        <td style="padding: 16px 18px;">
                          <div style="display: inline-block; background-color: #9A7228; color: #FFFFFF; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px;">
                            Status: Confirmation Pending (Pay at Hotel)
                          </div>
                          <div style="font-family: Georgia, serif; font-size: 15px; font-weight: 600; color: #1A1715; margin-bottom: 6px;">
                            Our Front Desk Will Call You Shortly
                          </div>
                          <p style="margin: 0; font-size: 12.5px; color: #5C554E; line-height: 1.5;">
                            Zero upfront payment was charged online. Zero advance payment is subject to room availability and demand; our reception desk may request an advance payment during your verification call to guarantee confirmation.
                          </p>
                          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #E8DFD3; font-size: 12px; color: #7D756E;">
                            Need immediate confirmation? Call our front desk: <a href="tel:${HOTEL_INFO.phone}" style="color: #9A7228; font-weight: 700; text-decoration: none;">${HOTEL_INFO.phone}</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  `}

                  <!-- Reference Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; border: 1px solid #EAE4DC; border-radius: 10px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 16px; text-align: center;">
                        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #7D756E; display: block; margin-bottom: 4px;">
                          Booking Reference Number
                        </span>
                        <span style="font-family: monospace; font-size: 24px; font-weight: 700; color: #9A7228; letter-spacing: 2px;">
                          ${safeConfNo}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Stay Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #EAE4DC; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; width: 40%;">Check-in Date:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">${escapeHtml(payload.checkIn)} (12:00 PM • Early check-in from 5:00 AM)</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Check-out Date:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">${escapeHtml(payload.checkOut)} (Until 12:00 PM)</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Duration:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">${payload.nights} ${payload.nights === 1 ? "Night" : "Nights"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Reserved Rooms:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">${payload.rooms} Room(s) &bull; ${payload.adults} Adults</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Total Amount:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 15px; font-weight: 700; color: #9A7228; font-family: Georgia, serif;">${formatCurrencyINR(payload.totalAmount || 0)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; font-size: 12px; color: #7D756E;">Payment Mode:</td>
                      <td style="padding: 10px 16px; font-size: 13px; font-weight: 600;">
                        ${payload.paymentMethod === "RAZORPAY"
                          ? "<span style='color: #047857;'>Paid Online (Guaranteed)</span>"
                          : (isConfirmedBooking
                              ? "<span style='color: #047857;'>✓ Confirmed by Front Desk (Pay at Hotel on Arrival)</span>"
                              : "<span style='color: #9A7228;'>Pay at Hotel Reception upon Arrival</span>")}
                      </td>
                    </tr>
                  </table>

                  <!-- Mandatory Check-in Notice -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; border-radius: 8px; border: 1px solid #EAE4DC;">
                    <tr>
                      <td style="padding: 12px 16px; font-size: 11.5px; color: #5C554E; line-height: 1.5;">
                        <strong style="color: #1A1715;">Check-in Mandatory Requirement:</strong> In accordance with local regulations, a valid Government-issued Photo ID (Aadhaar, Passport, Voter ID) must be presented for every adult guest at check-in.
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 22px 24px; background-color: #FAF8F5; border-top: 1px solid #EAE4DC; text-align: center; font-size: 11px; color: #7D756E; line-height: 1.6;">
                  <strong style="color: #1A1715;">Hotel Ambarish Grand Residency by Divine View</strong><br/>
                  Md Shah Road, Paltan Bazaar, Guwahati, Assam 781008<br/>
                  Front Desk: <a href="tel:${HOTEL_INFO.phone}" style="color: #9A7228; text-decoration: none; font-weight: 600;">${HOTEL_INFO.phone}</a> &bull; Email: <a href="mailto:${HOTEL_INFO.email}" style="color: #9A7228; text-decoration: none;">${HOTEL_INFO.email}</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (mailSetup) {
    const cleanGuestEmail = sanitizeHeader(payload.guestEmail);
    const safeSubjectRef = sanitizeHeader(payload.confirmationNo);
    const isPayAtHotel = payload.paymentMethod !== "RAZORPAY";

    const adminSubject = isPayAtHotel
      ? `[Booking Request - Call to Confirm] #${safeSubjectRef} — ${sanitizeHeader(payload.guestName)} (${payload.nights}N)`
      : `[New Reservation] #${safeSubjectRef} — ${sanitizeHeader(payload.guestName)} (${payload.nights}N)`;

    const guestSubject = isConfirmedBooking
      ? `Your Booking Voucher #${safeSubjectRef} is Confirmed & Guaranteed — Hotel Ambarish Grand Residency`
      : `Booking Request Received #${safeSubjectRef} (Confirmation Pending) — Hotel Ambarish Grand Residency`;

    const emailAttachments = logoAttachment ? [logoAttachment] : [];

    try {
      // 1. Send to Hotel Operations
      await mailSetup.transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${mailSetup.senderEmail}>`,
        to: recipientEmail,
        replyTo: cleanGuestEmail,
        subject: adminSubject,
        html: adminHtml,
        attachments: emailAttachments,
      });

      // 2. Send voucher to guest if email provided
      if (cleanGuestEmail && cleanGuestEmail.includes("@")) {
        await mailSetup.transporter.sendMail({
          from: `"${HOTEL_INFO.name}" <${mailSetup.senderEmail}>`,
          to: cleanGuestEmail,
          subject: guestSubject,
          html: guestHtml,
          attachments: emailAttachments,
        });
      }

      return { success: true, delivered: true };
    } catch (err: any) {
      console.warn("[Email] Transporter error:", err.message);
    }
  }

  return { success: true, delivered: false };
}

/**
 * Dispatches confirmed voucher to the guest when Front Desk confirms the reservation
 */
export async function sendGuestConfirmedVoucherEmail(payload: ReservationEmailPayload) {
  const mailSetup = getMailTransporter();
  if (!mailSetup) return { success: true, delivered: false };

  const cleanGuestEmail = sanitizeHeader(payload.guestEmail);
  const safeSubjectRef = sanitizeHeader(payload.confirmationNo);
  const guestSubject = `Your Booking Voucher #${safeSubjectRef} is Confirmed & Guaranteed — Hotel Ambarish Grand Residency`;
  const emailAttachments = logoAttachment ? [logoAttachment] : [];

  const confirmedPayload = { ...payload, status: "CONFIRMED" };
  const safeGuestName = escapeHtml(confirmedPayload.guestName);
  const safeConfNo = escapeHtml(confirmedPayload.confirmationNo);

  const confirmedHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Voucher - Hotel Ambarish Grand Residency</title>
      <style>
        body { margin: 0; padding: 0; background-color: #F6F4F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F6F4F0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E6DFD5; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              
              <!-- Brand Logo Header -->
              <tr>
                <td style="padding: 30px 24px 22px; text-align: center; background-color: #FAF8F5; border-bottom: 2px solid #C5A059;">
                  <img src="cid:hotelLogo" alt="Hotel Ambarish Grand Residency by Divine View" width="220" style="display: block; width: 220px; max-width: 85%; height: auto; margin: 0 auto;" />
                  <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 10.5px; letter-spacing: 2.5px; text-transform: uppercase; color: #8C7355; margin-top: 10px; font-weight: 600;">
                    Paltan Bazaar • Guwahati • Assam
                  </div>
                </td>
              </tr>

              <!-- Header Status Ribbon -->
              <tr>
                <td style="background-color: #047857; padding: 12px 24px; text-align: center;">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #FFFFFF;">
                    ✓ OFFICIAL RESERVATION CONFIRMATION • GUARANTEED
                  </span>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 28px 28px 24px;">

                  <p style="font-size: 15px; color: #1A1715; margin: 0 0 14px 0;">
                    Dear <strong>${safeGuestName}</strong>,
                  </p>

                  <p style="font-size: 13px; color: #5C554E; line-height: 1.6; margin: 0 0 16px 0;">
                    We are pleased to inform you that your reservation with <strong>Hotel Ambarish Grand Residency</strong> has been officially confirmed and guaranteed by our front desk.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 10px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 14px 18px; font-size: 13px; color: #166534; line-height: 1.5;">
                        <strong>✓ Room Allocation Confirmed &amp; Guaranteed</strong><br/>
                        Your stay from <strong>${escapeHtml(confirmedPayload.checkIn)}</strong> to <strong>${escapeHtml(confirmedPayload.checkOut)}</strong> is guaranteed. Please present this voucher or reference code at the front desk upon arrival.
                      </td>
                    </tr>
                  </table>

                  <!-- Reference Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; border: 1px solid #EAE4DC; border-radius: 10px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 16px; text-align: center;">
                        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #7D756E; display: block; margin-bottom: 4px;">
                          Confirmed Booking Reference
                        </span>
                        <span style="font-family: monospace; font-size: 24px; font-weight: 700; color: #047857; letter-spacing: 2px;">
                          ${safeConfNo}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Stay Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #EAE4DC; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; width: 40%;">Check-in Date:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">${escapeHtml(confirmedPayload.checkIn)} (12:00 PM • Early check-in from 5:00 AM)</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Check-out Date:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">${escapeHtml(confirmedPayload.checkOut)} (Until 12:00 PM)</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Duration:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">${confirmedPayload.nights} ${confirmedPayload.nights === 1 ? "Night" : "Nights"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Reserved Rooms:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; color: #1A1715;">${confirmedPayload.rooms} Room(s) &bull; ${confirmedPayload.adults} Adults</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Total Amount:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 15px; font-weight: 700; color: #047857; font-family: Georgia, serif;">${formatCurrencyINR(confirmedPayload.totalAmount || 0)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; font-size: 12px; color: #7D756E;">Payment Mode:</td>
                      <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #047857;">
                        ✓ Confirmed &bull; Pay at Hotel Reception upon Arrival
                      </td>
                    </tr>
                  </table>

                  <!-- Mandatory Check-in Notice -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; border-radius: 8px; border: 1px solid #EAE4DC;">
                    <tr>
                      <td style="padding: 12px 16px; font-size: 11.5px; color: #5C554E; line-height: 1.5;">
                        <strong style="color: #1A1715;">Check-in Requirement:</strong> Valid Government-issued Photo ID (Aadhaar, Passport, Voter ID) is mandatory for each adult guest at check-in.
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 22px 24px; background-color: #FAF8F5; border-top: 1px solid #EAE4DC; text-align: center; font-size: 11px; color: #7D756E; line-height: 1.6;">
                  <strong style="color: #1A1715;">Hotel Ambarish Grand Residency by Divine View</strong><br/>
                  Md Shah Road, Paltan Bazaar, Guwahati, Assam 781008<br/>
                  Front Desk: <a href="tel:${HOTEL_INFO.phone}" style="color: #9A7228; text-decoration: none; font-weight: 600;">${HOTEL_INFO.phone}</a> &bull; Email: <a href="mailto:${HOTEL_INFO.email}" style="color: #9A7228; text-decoration: none;">${HOTEL_INFO.email}</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    if (cleanGuestEmail && cleanGuestEmail.includes("@")) {
      await mailSetup.transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${mailSetup.senderEmail}>`,
        to: cleanGuestEmail,
        subject: guestSubject,
        html: confirmedHtml,
        attachments: emailAttachments,
      });
      return { success: true, delivered: true };
    }
  } catch (err: any) {
    console.warn("[Email] Confirmed voucher dispatch error:", err.message);
  }
  return { success: false, delivered: false };
}

/**
 * Dispatches Reservation Cancellation Notice Email to Guest (and CC hotel front desk)
 */
export async function sendGuestCancelledBookingEmail(
  payload: ReservationEmailPayload,
  reason?: string
): Promise<{ success: boolean; delivered: boolean }> {
  const mailSetup = getMailTransporter();
  if (!mailSetup) {
    return { success: false, delivered: false };
  }
  const safeGuestName = escapeHtml(payload.guestName || "Valued Guest");
  const safeConfNo = escapeHtml(payload.confirmationNo || "PENDING");
  const cleanGuestEmail = (payload.guestEmail || "").trim();
  const safeReason = escapeHtml(reason || "Room inventory fully occupied for requested stay dates");
  const waPhone = HOTEL_INFO.phoneRaw.replace(/[^0-9]/g, "");

  const emailAttachments = logoAttachment ? [logoAttachment] : [];

  const cancelSubject = `Reservation Cancellation Notice: #${safeConfNo} — Hotel Ambarish Grand Residency`;

  const cancelledHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${cancelSubject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F6F4F0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E6DFD5; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              
              <!-- Brand Logo Header -->
              <tr>
                <td style="padding: 30px 24px 22px; text-align: center; background-color: #FAF8F5; border-bottom: 2px solid #C5A059;">
                  <img src="cid:hotelLogo" alt="Hotel Ambarish Grand Residency by Divine View" width="220" style="display: block; width: 220px; max-width: 85%; height: auto; margin: 0 auto;" />
                  <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 10.5px; letter-spacing: 2.5px; text-transform: uppercase; color: #8C7355; margin-top: 10px; font-weight: 600;">
                    Paltan Bazaar • Guwahati • Assam
                  </div>
                </td>
              </tr>

              <!-- Cancellation Header Ribbon -->
              <tr>
                <td style="background-color: #991B1B; padding: 12px 24px; text-align: center;">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #FFFFFF;">
                    RESERVATION CANCELLATION NOTICE • #${safeConfNo}
                  </span>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 28px 28px 24px;">

                  <p style="font-size: 15px; color: #1A1715; margin: 0 0 14px 0;">
                    Dear <strong>${safeGuestName}</strong>,
                  </p>

                  <p style="font-size: 13px; color: #5C554E; line-height: 1.6; margin: 0 0 16px 0;">
                    We are writing to inform you that your booking request with <strong>Hotel Ambarish Grand Residency</strong> has been cancelled and will not be processed.
                  </p>

                  <!-- Notice Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF2F2; border: 1.5px solid #FECACA; border-radius: 10px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 14px 18px; font-size: 13px; color: #991B1B; line-height: 1.5;">
                        <strong>Reservation Status: Cancelled</strong><br/>
                        ${safeReason}
                      </td>
                    </tr>
                  </table>

                  <!-- Reference Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; border: 1px solid #EAE4DC; border-radius: 10px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 16px; text-align: center;">
                        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #7D756E; display: block; margin-bottom: 4px;">
                          Cancelled Booking Reference
                        </span>
                        <span style="font-family: monospace; font-size: 24px; font-weight: 700; color: #991B1B; letter-spacing: 2px; text-decoration: line-through;">
                          ${safeConfNo}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Summary Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #EAE4DC; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E; width: 40%;">Stay Schedule:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">${escapeHtml(payload.checkIn)} to ${escapeHtml(payload.checkOut)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Guests &amp; Rooms:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #1A1715;">${payload.rooms} Room(s) • ${payload.adults} Adults</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 12px; color: #7D756E;">Payment Status:</td>
                      <td style="padding: 10px 16px; border-bottom: 1px solid #F0ECE6; font-size: 13px; font-weight: 600; color: #047857;">Zero Charges Billed (Pay at Hotel request)</td>
                    </tr>
                  </table>

                  <!-- Assistance & Direct Booking -->
                  <div style="background-color: #FAF8F5; border-radius: 10px; padding: 18px; border: 1px solid #EDE7DE; text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 13px; font-weight: 700; color: #1A1715; margin-bottom: 6px;">
                      Looking for Alternate Dates or Need Immediate Assistance?
                    </div>
                    <div style="font-size: 12px; color: #5C554E; margin-bottom: 14px; line-height: 1.5;">
                      Our reception desk is available 24/7. We would be delighted to assist you in checking availability for alternative dates or upgraded room categories.
                    </div>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #1A1715;">
                          <a href="tel:${HOTEL_INFO.phoneRaw}" style="display: inline-block; padding: 9px 18px; font-size: 12px; font-weight: 700; color: #FFFFFF; text-decoration: none;">
                            📞 Call 088220 41211
                          </a>
                        </td>
                        <td style="width: 10px;"></td>
                        <td style="border-radius: 6px; background-color: #25D366;">
                          <a href="https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello Hotel Ambarish, I am inquiring regarding cancelled booking #${safeConfNo}. Are there alternative dates or rooms available?`)}" target="_blank" style="display: inline-block; padding: 9px 16px; font-size: 12px; font-weight: 700; color: #FFFFFF; text-decoration: none;">
                            💬 WhatsApp Helpdesk
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <p style="font-size: 12px; color: #7D756E; line-height: 1.5; margin: 0;">
                    We apologize for any inconvenience caused and hope to have the pleasure of welcoming you to Guwahati in the future.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FAF8F5; padding: 20px 24px; border-top: 1px solid #E6DFD5; text-align: center;">
                  <div style="font-size: 12px; font-weight: 600; color: #1A1715;">Hotel Ambarish Grand Residency</div>
                  <div style="font-size: 11px; color: #7D756E; margin-top: 3px;">
                    ${HOTEL_INFO.address.street}, ${HOTEL_INFO.address.area}, ${HOTEL_INFO.address.city}, ${HOTEL_INFO.address.state} - ${HOTEL_INFO.address.pincode}
                  </div>
                  <div style="font-size: 11px; color: #7D756E; margin-top: 3px;">
                    Helpline: <strong>${HOTEL_INFO.phone}</strong> | Email: <strong>${HOTEL_INFO.email}</strong>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    if (cleanGuestEmail && cleanGuestEmail.includes("@")) {
      await mailSetup.transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${mailSetup.senderEmail}>`,
        to: cleanGuestEmail,
        cc: serverConfig.mail.recipient,
        subject: cancelSubject,
        html: cancelledHtml,
        attachments: emailAttachments,
      });
      return { success: true, delivered: true };
    }
  } catch (err: any) {
    console.warn("[Email] Cancellation notice dispatch error:", err.message);
  }
  return { success: false, delivered: false };
}

/**
 * Sends Event / Banquet Enquiry Notification (SEC 11 Hardened)
 */
export async function sendEventEnquiryNotificationEmail(payload: EventEmailPayload) {
  const recipientEmail = serverConfig.mail.recipient;
  const mailSetup = getMailTransporter();

  const safeName = escapeHtml(payload.name);
  const safePhone = escapeHtml(payload.phone);
  const safeEmail = escapeHtml(payload.email);
  const safeEventType = escapeHtml(payload.eventType);
  const safeEventDate = escapeHtml(payload.eventDate);
  const safeAttendees = escapeHtml(payload.attendees);
  const safeLayout = escapeHtml(payload.seatingLayout || "Standard");
  const safeNotes = escapeHtml(payload.notes || "");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #FAF7F2; padding: 24px; color: #1A1715;">
      <div style="max-width: 600px; margin: auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6DED3; padding: 24px;">
        <h2 style="color: #0C0B0B; margin-top: 0;">New Banquet / Event RFP Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Client Name:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">${safeName}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Phone:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">${safePhone}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Email:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Event Type:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">${safeEventType}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Date:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeEventDate}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Attendees:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeAttendees} guests</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Seating:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeLayout}</td></tr>
          ${safeNotes ? `<tr><td style="padding: 8px 0; color: #777;">Notes:</td><td style="padding: 8px 0;">${safeNotes}</td></tr>` : ""}
        </table>
      </div>
    </body>
    </html>
  `;

  if (mailSetup) {
    try {
      await mailSetup.transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${mailSetup.senderEmail}>`,
        to: recipientEmail,
        replyTo: sanitizeHeader(payload.email),
        subject: `[Event Inquiry] ${sanitizeHeader(payload.eventType)} — ${sanitizeHeader(payload.name)}`,
        html,
      });
      return { success: true, delivered: true };
    } catch (err: any) {
      console.warn("[Email] Event enquiry dispatch error:", err.message);
    }
  }
  return { success: true, delivered: false };
}

/**
 * Sends B2B Corporate / Travel Agency Enquiry notification (SEC 11 Hardened)
 */
export async function sendB2bEnquiryNotificationEmail(payload: B2bEmailPayload) {
  const recipientEmail = serverConfig.mail.recipient;
  const mailSetup = getMailTransporter();

  const safeCompany = escapeHtml(payload.companyName);
  const safeAccountType = escapeHtml(payload.accountType || "CORPORATE");
  const safeContact = escapeHtml(payload.contactPerson);
  const safeDesignation = escapeHtml(payload.designation || "Executive");
  const safePhone = escapeHtml(payload.phone);
  const safeEmail = escapeHtml(payload.email);
  const safeGstin = escapeHtml(payload.gstin || "");
  const safeNights = escapeHtml(payload.estimatedMonthlyRoomNights || "");
  const safeMsg = escapeHtml(payload.message || "");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #FAF7F2; padding: 24px; color: #1A1715;">
      <div style="max-width: 600px; margin: auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6DED3; padding: 24px;">
        <h2 style="color: #0C0B0B; margin-top: 0;">New Corporate / Agent Rate Request</h2>
        <p style="color: #B62576; font-weight: bold;">Company: ${safeCompany} (${safeAccountType})</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Contact Person:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">${safeContact} (${safeDesignation})</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Phone:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">${safePhone}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Email:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
          ${safeGstin ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">GSTIN:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-family: monospace;">${safeGstin}</td></tr>` : ""}
          ${safeNights ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Monthly Volume:</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeNights} Room Nights</td></tr>` : ""}
          ${safeMsg ? `<tr><td style="padding: 8px 0; color: #777;">Message:</td><td style="padding: 8px 0;">${safeMsg}</td></tr>` : ""}
        </table>
      </div>
    </body>
    </html>
  `;

  if (mailSetup) {
    try {
      await mailSetup.transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${mailSetup.senderEmail}>`,
        to: recipientEmail,
        replyTo: sanitizeHeader(payload.email),
        subject: `[B2B Rate Request] ${sanitizeHeader(payload.companyName)} — ${sanitizeHeader(payload.contactPerson)}`,
        html,
      });
      return { success: true, delivered: true };
    } catch (err: any) {
      console.warn("[Email] B2B enquiry dispatch error:", err.message);
    }
  }
  return { success: true, delivered: false };
}
