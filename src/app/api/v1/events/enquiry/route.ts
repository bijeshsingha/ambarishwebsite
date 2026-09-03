import { NextResponse } from "next/server";
import { submitPmsEventEnquiry } from "@/lib/hotel-os-client";
import { sendEventEnquiryNotificationEmail } from "@/lib/email";

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

    const paxNumber = typeof attendees === "number"
      ? attendees
      : Number(String(attendees).split("-")[0] || 50);

    // 1. Sync with PMS CRM
    try {
      await submitPmsEventEnquiry({
        eventType: eventType.toUpperCase().replace(/\s+/g, "_").substring(0, 50),
        eventTitle: `${eventType} - ${name}`,
        eventDate,
        durationDays: 1,
        attendees: paxNumber,
        seatingLayout: seatingLayout.toUpperCase(),
        organizerName: name,
        organizerPhone: phone,
        organizerEmail: email,
        additionalNotes: notes,
      });
    } catch (pmsErr: any) {
      console.warn("[Event Enquiry] PMS sync warning:", pmsErr.message);
    }

    // 2. Dispatch Email Notification
    sendEventEnquiryNotificationEmail({
      eventType,
      eventDate,
      attendees,
      seatingLayout,
      name,
      email,
      phone,
      notes,
    }).catch((mailErr) => {
      console.warn("[Event Enquiry] Email dispatch warning:", mailErr.message);
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
    });
  } catch (error: any) {
    console.error("[Event Enquiry] Submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
