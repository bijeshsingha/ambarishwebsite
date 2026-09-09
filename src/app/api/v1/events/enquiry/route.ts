import { NextResponse } from "next/server";
import { sendEventEnquiryNotificationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // SEC 09 & Table 3: 3 inquiries per hour per source
  const rate = checkRateLimit("events_enquiry", clientIp, 3, 3600);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rate.resetInSeconds) } }
    );
  }

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
        { error: "INVALID_FIELDS", message: "Missing required fields (name, email, phone, eventDate, eventType)" },
        { status: 400 }
      );
    }

    try {
      await sendEventEnquiryNotificationEmail({
        eventType: String(eventType).slice(0, 100),
        eventDate: String(eventDate).slice(0, 30),
        attendees: String(attendees).slice(0, 10),
        seatingLayout: String(seatingLayout).slice(0, 50),
        name: String(name).slice(0, 100),
        email: String(email).slice(0, 100),
        phone: String(phone).replace(/[^0-9+]/g, "").slice(0, 20),
        notes: String(notes).slice(0, 500),
      });
    } catch (mailErr: any) {
      console.warn("[Event Enquiry] Email dispatch warning:", mailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Banquet / Event proposal submitted successfully. Our events team will contact you shortly.",
    });
  } catch (error: any) {
    console.error("[Event Enquiry] Submission error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
