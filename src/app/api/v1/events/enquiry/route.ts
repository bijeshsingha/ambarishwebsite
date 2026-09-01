import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { HOTEL_INFO } from "@/data/hotel-info";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventType,
      eventDate,
      attendees,
      seatingLayout = "Theatre",
      name,
      email,
      phone,
      notes = "",
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !eventDate || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, phone, eventDate, eventType)" },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.NOTIFICATION_EMAIL || HOTEL_INFO.email;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // HTML Email Template for Hotel Management
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #1A1715; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E6DED3; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #0C0B0B; padding: 24px 32px; text-align: center; }
          .header h1 { color: #B4872F; margin: 0; font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
          .header p { color: #F5EBDD; margin: 6px 0 0 0; font-size: 12px; opacity: 0.8; }
          .content { padding: 32px; }
          .badge { display: inline-block; background: #B4872F; color: #FFFFFF; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          .title { font-size: 22px; font-weight: bold; margin: 0 0 16px 0; color: #0C0B0B; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
          th { text-align: left; padding: 12px; background: #FAF7F2; color: #7A7067; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 35%; border-bottom: 1px solid #EDE7DE; }
          td { padding: 12px; border-bottom: 1px solid #EDE7DE; color: #1A1715; font-weight: 500; }
          .cta-box { background: #FAF7F2; border-radius: 12px; padding: 16px; margin-top: 24px; text-align: center; border: 1px solid #EDE7DE; }
          .cta-box a { color: #B62576; font-weight: bold; text-decoration: none; font-size: 15px; }
          .footer { padding: 20px 32px; background: #FAF7F2; border-top: 1px solid #EDE7DE; text-align: center; font-size: 11px; color: #7A7067; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hotel Ambarish Grand Residency</h1>
            <p>Banquets &amp; Events Desk — Paltan Bazaar, Guwahati</p>
          </div>
          <div class="content">
            <span class="badge">New Event Proposal</span>
            <h2 class="title">RFP Received for ${eventType}</h2>
            <p style="color: #4A443F; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
              A new meeting/event proposal request has been submitted through the hotel website.
            </p>

            <table>
              <tr>
                <th>Event Category</th>
                <td><strong>${eventType}</strong></td>
              </tr>
              <tr>
                <th>Target Date</th>
                <td>${eventDate}</td>
              </tr>
              <tr>
                <th>Estimated Attendees</th>
                <td>${attendees} Pax</td>
              </tr>
              <tr>
                <th>Seating Layout</th>
                <td>${seatingLayout}</td>
              </tr>
              <tr>
                <th>Contact Name</th>
                <td><strong>${name}</strong></td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td><a href="tel:${phone}" style="color: #B4872F; text-decoration: none; font-weight: bold;">${phone}</a></td>
              </tr>
              <tr>
                <th>Email Address</th>
                <td><a href="mailto:${email}" style="color: #B4872F; text-decoration: none;">${email}</a></td>
              </tr>
              ${
                notes
                  ? `<tr><th>Special Requests</th><td>${notes}</td></tr>`
                  : ""
              }
              <tr>
                <th>Submission Time</th>
                <td>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
              </tr>
            </table>

            <div class="cta-box">
              <span style="font-size: 12px; color: #7A7067; display: block; margin-bottom: 6px;">Quick Action:</span>
              <a href="tel:${phone}">📞 Call Guest Directly: ${phone}</a>
            </div>
          </div>
          <div class="footer">
            Hotel Ambarish Grand Residency • Md Shah Road, Paltan Bazaar, Guwahati 781008<br/>
            Direct Front Desk: ${HOTEL_INFO.phone}
          </div>
        </div>
      </body>
      </html>
    `;

    // If SMTP credentials exist, send real email via nodemailer
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Send to hotel management
      await transporter.sendMail({
        from: `"${HOTEL_INFO.name}" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `[Event Enquiry] ${eventType} on ${eventDate} — ${name}`,
        html: htmlContent,
      });

      // Send auto-acknowledgement to guest
      try {
        await transporter.sendMail({
          from: `"${HOTEL_INFO.name}" <${smtpUser}>`,
          to: email,
          subject: `We've received your event enquiry — ${HOTEL_INFO.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
              <h2 style="color: #0C0B0B;">Dear ${name},</h2>
              <p>Thank you for considering <strong>Hotel Ambarish Grand Residency</strong> for your <strong>${eventType}</strong> on <strong>${eventDate}</strong>.</p>
              <p>Our banquet and event coordinator is reviewing venue availability for <strong>${attendees} attendees</strong> and will reach out to you on <strong>${phone}</strong> shortly.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                Hotel Ambarish Grand Residency<br/>
                Md Shah Road, Paltan Bazaar, Guwahati, Assam 781008<br/>
                Helpdesk: ${HOTEL_INFO.phone} | Email: ${HOTEL_INFO.email}
              </p>
            </div>
          `,
        });
      } catch (clientErr) {
        console.warn("Guest auto-responder email error:", clientErr);
      }

      return NextResponse.json({
        success: true,
        delivered: true,
        recipient: recipientEmail,
        message: "Email successfully delivered to hotel management and acknowledged to guest.",
      });
    } else {
      // SMTP not configured yet -> Log detailed enquiry to server console
      console.log("==================================================");
      console.log("📩 NEW EVENT ENQUIRY RECEIVED (SMTP NOT CONFIGURED)");
      console.log(`Event: ${eventType}`);
      console.log(`Date: ${eventDate}`);
      console.log(`Attendees: ${attendees} Pax`);
      console.log(`Layout: ${seatingLayout}`);
      console.log(`Name: ${name}`);
      console.log(`Phone: ${phone}`);
      console.log(`Email: ${email}`);
      console.log(`Notes: ${notes}`);
      console.log(`Target Email: ${recipientEmail}`);
      console.log("💡 To enable real SMTP email dispatch, configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local");
      console.log("==================================================");

      return NextResponse.json({
        success: true,
        delivered: false,
        logged: true,
        recipient: recipientEmail,
        message: "Enquiry recorded successfully. (Configure SMTP credentials in .env.local for live email dispatch)",
      });
    }
  } catch (error: any) {
    console.error("Event enquiry submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process event enquiry" },
      { status: 500 }
    );
  }
}
