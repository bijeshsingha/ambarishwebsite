import { NextResponse } from "next/server";
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

    // Await email notification so serverless lambda does not terminate early
    try {
      await sendEventEnquiryNotificationEmail({
        eventType,
        eventDate,
        attendees,
        seatingLayout,
        name,
        email,
        phone,
        notes,
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
      { error: error.message || "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
