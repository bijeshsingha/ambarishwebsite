import { NextResponse } from "next/server";
import { sendB2bEnquiryNotificationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // SEC 09 & Table 3: 3 inquiries per hour per source
  const rate = checkRateLimit("b2b_enquiry", clientIp, 3, 3600);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rate.resetInSeconds) } }
    );
  }

  try {
    const body = await request.json();

    if (!body.companyName || !body.contactPerson || !body.phone || !body.email) {
      return NextResponse.json(
        { error: "INVALID_FIELDS", message: "Company name, contact person, email, and phone number are required" },
        { status: 400 }
      );
    }

    const payload = {
      companyName: String(body.companyName).slice(0, 100),
      accountType: body.accountType === "TRAVEL_AGENT" ? "TRAVEL_AGENT" : "CORPORATE",
      contactPerson: String(body.contactPerson).slice(0, 100),
      designation: body.designation ? String(body.designation).slice(0, 100) : undefined,
      email: String(body.email).slice(0, 100),
      phone: String(body.phone).replace(/[^0-9+]/g, "").slice(0, 20),
      gstin: body.gstin ? String(body.gstin).slice(0, 20) : undefined,
      city: body.city ? String(body.city).slice(0, 100) : undefined,
      state: body.state ? String(body.state).slice(0, 100) : undefined,
      estimatedMonthlyRoomNights: Math.max(0, Math.min(1000, Number(body.estimatedMonthlyRoomNights || 0))),
      requiredMealPlans: Array.isArray(body.requiredMealPlans) ? body.requiredMealPlans.slice(0, 5) : [],
      billingPreference: body.billingPreference || "BILL_TO_COMPANY",
      message: body.message ? String(body.message).slice(0, 500) : undefined,
    };

    try {
      await sendB2bEnquiryNotificationEmail(payload);
    } catch (mailErr: any) {
      console.warn("[B2B Enquiry] Email dispatch warning:", mailErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: "B2B Corporate enquiry submitted successfully. Our sales team will reach out shortly.",
    });
  } catch (error: any) {
    console.error("[B2B Enquiry] Error:", error?.message);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process B2B enquiry" },
      { status: 500 }
    );
  }
}
