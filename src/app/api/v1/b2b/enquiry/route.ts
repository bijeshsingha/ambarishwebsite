import { NextResponse } from "next/server";
import { sendB2bEnquiryNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.companyName || !body.contactPerson || !body.phone) {
      return NextResponse.json(
        { error: "Company name, contact person, and phone number are required" },
        { status: 400 }
      );
    }

    const payload = {
      companyName: body.companyName,
      accountType: body.accountType || "CORPORATE",
      contactPerson: body.contactPerson,
      designation: body.designation,
      email: body.email,
      phone: body.phone,
      gstin: body.gstin,
      city: body.city,
      state: body.state,
      estimatedMonthlyRoomNights: Number(body.estimatedMonthlyRoomNights || 0),
      requiredMealPlans: body.requiredMealPlans || [],
      billingPreference: body.billingPreference || "BILL_TO_COMPANY",
      message: body.message,
    };

    // Send email notification to hotel management
    sendB2bEnquiryNotificationEmail(payload).catch((mailErr) => {
      console.warn("[B2B Enquiry] Email dispatch warning:", mailErr?.message);
    });

    return NextResponse.json({
      success: true,
      message: "B2B Corporate enquiry submitted successfully. Our sales team will reach out shortly.",
    });
  } catch (error: any) {
    console.error("[B2B Enquiry] Error:", error?.message);
    return NextResponse.json(
      { error: error.message || "Failed to process B2B enquiry" },
      { status: 500 }
    );
  }
}
