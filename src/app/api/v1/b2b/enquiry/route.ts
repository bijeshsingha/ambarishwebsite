import { NextResponse } from "next/server";
import { HOTEL_INFO } from "@/data/hotel-info";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Proxy to PMS API
    const pmsUrl = process.env.PMS_API_URL || "http://localhost:3000/api/v1";
    const pmsRes = await fetch(`${pmsUrl}/b2b/enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PMS_API_SECRET || "",
      },
      body: JSON.stringify({
        enquiryType: body.enquiryType || "CORPORATE_RATE_CONTRACT",
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
      }),
    });

    if (!pmsRes.ok) {
      const errData = await pmsRes.text();
      console.warn("Failed to sync b2b enquiry with PMS", errData);
      throw new Error("Failed to submit B2B enquiry to PMS");
    }

    return NextResponse.json({
      success: true,
      message: "B2B Enquiry submitted successfully",
    });
  } catch (error: any) {
    console.error("B2B enquiry submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process B2B enquiry" },
      { status: 500 }
    );
  }
}
