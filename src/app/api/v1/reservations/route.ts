import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateReservationReference, ReservationData } from "@/lib/hotel-os-client";
import { HOTEL_INFO } from "@/data/hotel-info";
import { formatCurrencyINR } from "@/lib/formatters";

// In-memory store for runtime
const reservationsStore = new Map<string, ReservationData>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = generateReservationReference();
    const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newReservation: ReservationData = {
      id,
      bookingReference: reference,
      status: "CONFIRMED",
      roomSlug: body.roomSlug,
      roomName: body.roomName,
      ratePlanCode: body.ratePlanCode || "EP",
      ratePlanName: body.ratePlanName || "European Plan",
      bookedRooms: body.bookedRooms || undefined,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights: body.nights || 1,
      rooms: body.rooms || 1,
      adults: body.adults || 2,
      children: body.children || 0,
      bookingType: body.bookingType || "individual",
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      guestCity: body.guestCity || "",
      guestGstin: body.guestGstin || "",
      companyName: body.companyName || "",
      billingAddress: body.billingAddress || "",
      specialRequests: body.specialRequests || "",
      promoCode: body.promoCode || undefined,
      discountAmount: body.discountAmount || 0,
      baseAmount: body.baseAmount,
      taxAmount: body.taxAmount,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod || "RAZORPAY",
      paymentId: body.paymentId || `pay_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    reservationsStore.set(id, newReservation);
    reservationsStore.set(reference, newReservation);

    // ==========================================
    // 1. OPTIONAL PMS WEBHOOK SYNC (e.g. Hotel OS)
    // ==========================================
    const pmsWebhookUrl = process.env.PMS_WEBHOOK_URL;
    if (pmsWebhookUrl) {
      try {
        fetch(pmsWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.PMS_API_SECRET
              ? { Authorization: `Bearer ${process.env.PMS_API_SECRET}` }
              : {}),
          },
          body: JSON.stringify(newReservation),
        }).catch((err) => console.error("PMS sync forward error:", err));
      } catch (err) {
        console.error("PMS webhook trigger error:", err);
      }
    }

    // ==========================================
    // 2. AUTOMATED NOTIFICATION & EMAIL DISPATCH
    // ==========================================
    const recipientEmail = process.env.NOTIFICATION_EMAIL || HOTEL_INFO.email;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      // Itemized rooms table HTML
      const roomsHtml = newReservation.bookedRooms && newReservation.bookedRooms.length > 0
        ? newReservation.bookedRooms.map((rm) => `
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>${rm.quantity}x ${rm.roomName}</strong> ${rm.bedType ? `(${rm.bedType})` : ""} - ${rm.ratePlanName}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrencyINR(rm.pricePerNight * rm.quantity)}/night</td>
            </tr>
          `).join("")
        : `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>${newReservation.rooms}x ${newReservation.roomName}</strong> (${newReservation.ratePlanName})</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrencyINR(newReservation.baseAmount)}</td>
          </tr>
        `;

      // 1. Hotel Management Notification Email
      const adminHtml = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; background: #FAF7F2; padding: 24px; color: #1A1715;">
          <div style="max-width: 600px; margin: auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E6DED3; overflow: hidden;">
            <div style="background: #0C0B0B; padding: 20px 24px; text-align: center;">
              <h2 style="color: #B4872F; margin: 0; font-size: 18px; letter-spacing: 1px;">HOTEL AMBARISH GRAND RESIDENCY</h2>
              <p style="color: #F5EBDD; margin: 4px 0 0 0; font-size: 11px;">NEW DIRECT RESERVATION #${reference}</p>
            </div>
            <div style="padding: 24px;">
              <h3 style="margin-top: 0; color: #0C0B0B;">🎉 Direct Booking Received: ${formatCurrencyINR(newReservation.totalAmount)}</h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
                <tr><td style="padding: 6px 0; color: #777;">Reference:</td><td><strong>${reference}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #777;">Primary Guest:</td><td><strong>${newReservation.guestName}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #777;">Phone:</td><td><a href="tel:${newReservation.guestPhone}" style="color: #B4872F; font-weight: bold;">${newReservation.guestPhone}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #777;">Email:</td><td><a href="mailto:${newReservation.guestEmail}">${newReservation.guestEmail}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #777;">Dates:</td><td><strong>${newReservation.checkIn}</strong> to <strong>${newReservation.checkOut}</strong> (${newReservation.nights} Nights)</td></tr>
                <tr><td style="padding: 6px 0; color: #777;">Inventory:</td><td>${newReservation.rooms} Rooms • ${newReservation.adults} Guests</td></tr>
                <tr><td style="padding: 6px 0; color: #777;">Payment Mode:</td><td><strong>${newReservation.paymentMethod}</strong></td></tr>
                ${newReservation.specialRequests ? `<tr><td style="padding: 6px 0; color: #777;">Special Notes:</td><td>${newReservation.specialRequests}</td></tr>` : ""}
              </table>

              <h4 style="margin: 16px 0 8px 0; font-size: 12px; text-transform: uppercase; color: #A27520;">Reserved Rooms</h4>
              <table style="width: 100%; border-collapse: collapse; background: #FAF7F2; border-radius: 8px; font-size: 12px;">
                ${roomsHtml}
              </table>

              <div style="margin-top: 20px; padding: 12px; background: #FAF7F2; border-radius: 8px; text-align: center;">
                <a href="tel:${newReservation.guestPhone}" style="color: #B62576; font-weight: bold; text-decoration: none;">📞 Call Guest: ${newReservation.guestPhone}</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: newReservation.guestEmail,
        subject: `[New Booking] Ref #${reference} — ${newReservation.guestName} (${newReservation.rooms} Rms, ${newReservation.nights}N)`,
        html: adminHtml,
      });

      // 2. Guest Confirmation Voucher Email
      try {
        await transporter.sendMail({
          from: `"${HOTEL_INFO.name}" <${smtpUser}>`,
          to: newReservation.guestEmail,
          subject: `Reservation Confirmed: #${reference} at Hotel Ambarish Grand Residency`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
              <h2 style="color: #0C0B0B; margin-top: 0;">Reservation Confirmed</h2>
              <p>Dear <strong>${newReservation.guestName}</strong>,</p>
              <p>Thank you for choosing <strong>Hotel Ambarish Grand Residency by Divine View</strong>. Your booking reference is <strong style="color: #A27520; font-size: 16px;">${reference}</strong>.</p>
              
              <div style="background: #FAF7F2; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 13px;">
                <p style="margin: 4px 0;"><strong>Check-In:</strong> ${newReservation.checkIn} (from 12:00 PM)</p>
                <p style="margin: 4px 0;"><strong>Check-Out:</strong> ${newReservation.checkOut} (until 11:00 AM)</p>
                <p style="margin: 4px 0;"><strong>Total Rooms:</strong> ${newReservation.rooms} (${newReservation.adults} Guests)</p>
                <p style="margin: 4px 0;"><strong>Total Amount:</strong> ${formatCurrencyINR(newReservation.totalAmount)} (Inclusive of GST)</p>
              </div>

              <p style="font-size: 13px; color: #555;">Please present a valid Government Photo ID for all adult occupants at the front desk upon check-in.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 11px; color: #888;">
                Hotel Ambarish Grand Residency<br/>
                Md Shah Road, Paltan Bazaar, Guwahati, Assam 781008 (250m from Railway Station)<br/>
                Helpdesk: ${HOTEL_INFO.phone} | Email: ${HOTEL_INFO.email}
              </p>
            </div>
          `,
        });
      } catch (clientErr) {
        console.warn("Guest voucher email dispatch error:", clientErr);
      }
    } else {
      console.log("==================================================");
      console.log(`🏨 NEW ROOM RESERVATION CREATED: Ref #${reference}`);
      console.log(`Guest: ${newReservation.guestName} (${newReservation.guestPhone}, ${newReservation.guestEmail})`);
      console.log(`Dates: ${newReservation.checkIn} to ${newReservation.checkOut} (${newReservation.nights} Nights)`);
      console.log(`Rooms: ${newReservation.rooms} Rooms | Total: Rs ${newReservation.totalAmount}`);
      console.log(`Payment: ${newReservation.paymentMethod}`);
      console.log(`Notification Target: ${recipientEmail}`);
      console.log("💡 To enable real email dispatch, add SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local");
      console.log("==================================================");
    }

    return NextResponse.json({
      success: true,
      reservation: newReservation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Reservation creation failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || searchParams.get("reference");

  if (!id) {
    return NextResponse.json({ error: "id or reference required" }, { status: 400 });
  }

  const reservation = reservationsStore.get(id);
  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  return NextResponse.json({ reservation });
}
