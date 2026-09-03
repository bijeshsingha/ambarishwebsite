import nodemailer from "nodemailer";
import { HOTEL_INFO } from "@/data/hotel-info";
import { formatCurrencyINR } from "@/lib/formatters";

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
  paymentMethod?: string;
}

function getMailTransporter() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = (process.env.SMTP_USER || process.env.NOTIFICATION_EMAIL || HOTEL_INFO.email).trim();
  const smtpPass = process.env.SMTP_PASS?.replace(/^["']|["']$/g, "").replace(/\s+/g, "");

  if (!smtpPass) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    }),
    senderEmail: smtpUser,
  };
}

export async function sendReservationNotificationEmails(payload: ReservationEmailPayload) {
  const recipientEmail = process.env.NOTIFICATION_EMAIL || HOTEL_INFO.email;
  const mailConfig = getMailTransporter();

  // Itemized rooms table HTML
  const roomsHtml = payload.bookedRooms && payload.bookedRooms.length > 0
    ? payload.bookedRooms.map((rm) => `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #EDE7DE; font-size: 13px; color: #1A1715;">
            <strong>${rm.quantity || 1}x ${rm.roomName || "Double Deluxe Room"}</strong>
            ${rm.bedType ? `<span style="color: #787069;"> (${rm.bedType})</span>` : ""}
            <div style="font-size: 11px; color: #A27520; margin-top: 2px;">${rm.ratePlanName || "European Plan"}</div>
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #EDE7DE; text-align: right; font-family: monospace; font-size: 13px; font-weight: bold; color: #1A1715;">
            ${formatCurrencyINR((rm.pricePerNight || 0) * (rm.quantity || 1))}/night
          </td>
        </tr>
      `).join("")
    : `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EDE7DE; font-size: 13px; color: #1A1715;">
          <strong>${payload.rooms}x Reserved Rooms</strong>
        </td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EDE7DE; text-align: right; font-family: monospace; font-size: 13px; font-weight: bold; color: #1A1715;">
          ${formatCurrencyINR(payload.baseAmount || 0)}
        </td>
      </tr>
    `;

  // 1. Hotel Management Notification Email Template
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #1A1715; }
        .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E6DED3; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .header { background: #0C0B0B; padding: 24px 32px; text-align: center; border-bottom: 3px solid #B4872F; }
        .header h1 { color: #B4872F; margin: 0; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
        .header p { color: #F5EBDD; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 1px; }
        .content { padding: 32px; }
        .badge { display: inline-block; background: #B62576; color: #FFFFFF; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .title { font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #0C0B0B; }
        .card { background: #FAF7F2; border: 1px solid #EDE7DE; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
        table.grid { width: 100%; border-collapse: collapse; font-size: 13px; }
        table.grid td { padding: 6px 0; vertical-align: top; }
        table.grid td.label { color: #787069; width: 38%; font-weight: 500; }
        table.grid td.val { color: #1A1715; font-weight: 600; }
        table.rooms { width: 100%; border-collapse: collapse; background: #FAF7F2; border-radius: 10px; overflow: hidden; margin-top: 8px; }
        .total-box { background: #0C0B0B; color: #FFFFFF; border-radius: 12px; padding: 16px 20px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
        .cta-btn { display: inline-block; background: #B62576; color: #FFFFFF !important; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 24px; text-align: center; margin-top: 20px; }
        .footer { padding: 20px 32px; background: #FAF7F2; border-top: 1px solid #EDE7DE; text-align: center; font-size: 11px; color: #787069; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HOTEL AMBARISH GRAND RESIDENCY</h1>
          <p>NEW DIRECT WEBSITE RESERVATION #${payload.confirmationNo}</p>
        </div>
        <div class="content">
          <span class="badge">${payload.bookingType === "CORPORATE" ? "🏢 Corporate Booking (B2B)" : "🌟 Retail Direct Booking"}</span>
          <h2 class="title">New Reservation Confirmed: ${formatCurrencyINR(payload.totalAmount || 0)}</h2>

          <div class="card">
            <table class="grid">
              <tr><td class="label">Confirmation No:</td><td class="val" style="color: #A27520; font-family: monospace; font-size: 15px;">${payload.confirmationNo}</td></tr>
              <tr><td class="label">Primary Guest:</td><td class="val">${payload.guestName}</td></tr>
              <tr><td class="label">Phone:</td><td class="val"><a href="tel:${payload.guestPhone}" style="color: #B62576; text-decoration: none;">${payload.guestPhone}</a></td></tr>
              <tr><td class="label">Email:</td><td class="val"><a href="mailto:${payload.guestEmail}" style="color: #1A1715; text-decoration: none;">${payload.guestEmail}</a></td></tr>
              ${payload.guestCity || payload.guestState ? `<tr><td class="label">Location:</td><td class="val">${[payload.guestCity, payload.guestState].filter(Boolean).join(", ")}</td></tr>` : ""}
              <tr><td class="label">Stay Dates:</td><td class="val"><strong>${payload.checkIn}</strong> to <strong>${payload.checkOut}</strong> (${payload.nights} ${payload.nights === 1 ? "Night" : "Nights"})</td></tr>
              <tr><td class="label">Occupancy:</td><td class="val">${payload.rooms} ${payload.rooms === 1 ? "Room" : "Rooms"} • ${payload.adults} Adults ${payload.children > 0 ? `• ${payload.children} Children` : ""}</td></tr>
              <tr><td class="label">Payment Mode:</td><td class="val"><strong>${payload.paymentMethod || "PAY_AT_HOTEL"}</strong></td></tr>
              ${payload.specialRequests ? `<tr><td class="label">Special Requests:</td><td class="val" style="color: #B4872F;">${payload.specialRequests}</td></tr>` : ""}
            </table>

            ${payload.b2b?.companyName || payload.companyName ? `
              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #EDE7DE; font-size: 12px;">
                <strong style="color: #0C0B0B; display: block; margin-bottom: 4px;">🏢 Corporate / B2B Information</strong>
                <div>Company: <strong>${payload.b2b?.companyName || payload.companyName}</strong></div>
                ${payload.guestGstin ? `<div>GSTIN: <span style="font-family: monospace; color: #A27520;">${payload.guestGstin}</span></div>` : ""}
                ${payload.b2b?.poNumber ? `<div>PO Number: <span style="font-family: monospace;">${payload.b2b.poNumber}</span></div>` : ""}
                ${payload.b2b?.billingInstruction ? `<div>Billing Instruction: <strong>${payload.b2b.billingInstruction}</strong></div>` : ""}
              </div>
            ` : ""}
          </div>

          <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #A27520; margin-bottom: 6px; letter-spacing: 1px;">
            Booked Inventory Breakdown
          </div>
          <table class="rooms">
            ${roomsHtml}
          </table>

          <div style="margin-top: 20px; background: #FAF7F2; border-radius: 12px; padding: 14px 18px; border: 1px solid #EDE7DE; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #787069;">
              <span>Base Amount:</span>
              <span style="font-family: monospace; font-weight: 600; color: #1A1715;">${formatCurrencyINR(payload.baseAmount || 0)}</span>
            </div>
            ${payload.discountAmount && payload.discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #15803d;">
                <span>Discount (${payload.promoCode || "PROMO"}):</span>
                <span style="font-family: monospace; font-weight: 600;">-${formatCurrencyINR(payload.discountAmount)}</span>
              </div>
            ` : ""}
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #787069;">
              <span>GST Taxes (SAC 996311):</span>
              <span style="font-family: monospace; font-weight: 600; color: #1A1715;">${formatCurrencyINR(payload.taxAmount || 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #E6DED3; font-size: 15px; font-weight: bold; color: #0C0B0B;">
              <span>Total Payable Amount:</span>
              <span style="color: #B4872F; font-family: monospace;">${formatCurrencyINR(payload.totalAmount || 0)}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="tel:${payload.guestPhone}" class="cta-btn">📞 Call Guest: ${payload.guestPhone}</a>
          </div>
        </div>
        <div class="footer">
          Hotel Ambarish Grand Residency by Divine View • Paltan Bazaar, Guwahati, Assam 781008<br/>
          Front Desk Helpdesk: ${HOTEL_INFO.phone} | ${HOTEL_INFO.email}
        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Guest Confirmation Voucher Template
  const guestHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #1A1715; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E6DED3; overflow: hidden; }
        .header { background: #0C0B0B; padding: 24px 32px; text-align: center; }
        .header h1 { color: #B4872F; margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; }
        .header p { color: #F5EBDD; margin: 4px 0 0 0; font-size: 12px; }
        .content { padding: 32px; }
        .ref-box { background: #FAF7F2; border: 1px solid #EDE7DE; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0; }
        .ref-code { font-size: 22px; font-weight: bold; color: #A27520; font-family: monospace; letter-spacing: 2px; }
        table.details { width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0; }
        table.details td { padding: 8px 0; border-bottom: 1px solid #EDE7DE; }
        table.details td.label { color: #787069; width: 40%; }
        table.details td.val { color: #1A1715; font-weight: 600; text-align: right; }
        .footer { padding: 20px 32px; background: #FAF7F2; border-top: 1px solid #EDE7DE; text-align: center; font-size: 11px; color: #787069; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Hotel Ambarish Grand Residency</h1>
          <p>By Divine View — Paltan Bazaar, Guwahati</p>
        </div>
        <div class="content">
          <h2 style="color: #0C0B0B; margin-top: 0; font-size: 20px;">Reservation Confirmed</h2>
          <p>Dear <strong>${payload.guestName}</strong>,</p>
          <p>Thank you for choosing <strong>Hotel Ambarish Grand Residency</strong>. Your reservation has been registered directly in our hotel system.</p>
          
          <div class="ref-box">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #787069; display: block; margin-bottom: 4px;">Official Booking Reference</span>
            <div class="ref-code">${payload.confirmationNo}</div>
          </div>

          <table class="details">
            <tr><td class="label">Check-In Date:</td><td class="val">${payload.checkIn} (from 12:00 PM)</td></tr>
            <tr><td class="label">Check-Out Date:</td><td class="val">${payload.checkOut} (until 11:00 AM)</td></tr>
            <tr><td class="label">Duration:</td><td class="val">${payload.nights} ${payload.nights === 1 ? "Night" : "Nights"}</td></tr>
            <tr><td class="label">Rooms &amp; Guests:</td><td class="val">${payload.rooms} Rooms • ${payload.adults} Adults</td></tr>
            <tr><td class="label">Payment Mode:</td><td class="val">${payload.paymentMethod || "Pay at Hotel"}</td></tr>
            <tr><td class="label">Total Amount:</td><td class="val" style="color: #A27520; font-size: 15px;">${formatCurrencyINR(payload.totalAmount || 0)}</td></tr>
          </table>

          <div style="background: #FAF7F2; padding: 14px; border-radius: 8px; font-size: 12px; color: #4A443F; line-height: 1.5; margin-top: 20px;">
            📍 <strong>Location:</strong> Md Shah Road, Paltan Bazaar, Guwahati, Assam 781008 (Just 200m from Guwahati Railway Station).<br/>
            🪪 <strong>Check-In Note:</strong> Please present a valid Government Photo ID (Aadhaar/Voter ID/Passport/Driving License) for all adult occupants upon arrival.
          </div>
        </div>
        <div class="footer">
          Hotel Ambarish Grand Residency<br/>
          Helpdesk: ${HOTEL_INFO.phone} | Email: ${HOTEL_INFO.email}
        </div>
      </div>
    </body>
    </html>
  `;

  if (mailConfig) {
    try {
      // 1. Dispatch Hotel Management Alert
      await mailConfig.transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${mailConfig.senderEmail}>`,
        to: recipientEmail,
        replyTo: payload.guestEmail,
        subject: `[New Direct Booking] Ref #${payload.confirmationNo} — ${payload.guestName} (${payload.rooms} Rms, ${payload.nights}N)`,
        html: adminHtml,
      });

      console.log(`✅ [Email Dispatched] Hotel notification sent to ${recipientEmail} for #${payload.confirmationNo}`);

      // 2. Dispatch Guest Voucher Email if valid guest email provided
      if (payload.guestEmail && payload.guestEmail.includes("@")) {
        try {
          await mailConfig.transporter.sendMail({
            from: `"${HOTEL_INFO.name}" <${mailConfig.senderEmail}>`,
            to: payload.guestEmail,
            subject: `Reservation Confirmed: #${payload.confirmationNo} at Hotel Ambarish Grand Residency`,
            html: guestHtml,
          });
          console.log(`✅ [Email Dispatched] Guest confirmation voucher sent to ${payload.guestEmail}`);
        } catch (guestErr: any) {
          console.warn("Guest confirmation email error:", guestErr?.message);
        }
      }

      return { success: true, delivered: true, recipient: recipientEmail };
    } catch (err: any) {
      console.error("❌ SMTP Email Dispatch Error:", err?.message);
      return { success: false, delivered: false, error: err?.message };
    }
  } else {
    // SMTP credentials not yet provided in .env.local -> log detailed card to terminal
    console.log("==================================================");
    console.log(`🏨 NEW ROOM RESERVATION CREATED: Ref #${payload.confirmationNo}`);
    console.log(`Guest: ${payload.guestName} (${payload.guestPhone}, ${payload.guestEmail})`);
    console.log(`Dates: ${payload.checkIn} to ${payload.checkOut} (${payload.nights} Nights)`);
    console.log(`Rooms: ${payload.rooms} Rooms | Total: ${formatCurrencyINR(payload.totalAmount || 0)}`);
    console.log(`Notification Target: ${recipientEmail}`);
    console.log("💡 To deliver live emails directly to your Gmail inbox, add SMTP_USER and SMTP_PASS (Gmail App Password) in .env.local");
    console.log("==================================================");

    return { success: true, delivered: false, logged: true, recipient: recipientEmail };
  }
}
