import { NextResponse } from "next/server";
import { sendReservationNotificationEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const pmsPayload = {
      bookingType: body.bookingType || "INDIVIDUAL",
      source: "WEBSITE",
      channelRef: `WEB-${Date.now().toString().slice(-6)}`,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights: body.nights || 1,
      rooms: body.rooms || 1,
      adults: body.adults || 2,
      children: body.children || 0,
      bookedRooms: body.bookedRooms || [],
      guestName: body.guestName,
      guestPhone: body.guestPhone,
      guestEmail: body.guestEmail,
      guestCity: body.guestCity || "",
      guestState: body.guestState || "",
      guestNationality: body.guestNationality || "INDIAN",
      guestGstin: body.guestGstin || "",
      b2b: body.b2b || undefined,
      specialRequests: body.specialRequests || "",
      promoCode: body.promoCode || "",
      discountAmount: body.discountAmount || 0,
      baseAmount: body.baseAmount || 0,
      taxAmount: body.taxAmount || 0,
      totalAmount: body.totalAmount || 0,
      paymentMethod: body.paymentMethod || "PAY_AT_HOTEL",
      paymentId: body.paymentId || "PAY_AT_HOTEL",
      depositAmount: body.depositAmount || 0
    };

    const pmsUrl = process.env.PMS_API_URL || "http://localhost:3000/api/v1";
    const res = await fetch(`${pmsUrl}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PMS_API_SECRET || "",
      },
      body: JSON.stringify(pmsPayload),
    });

    if (!res.ok) {
      const errData = await res.text();
      console.error("PMS Reservation Error:", res.status, errData);
      throw new Error("Failed to submit reservation to PMS");
    }

    const data = await res.json();
    const confirmationNo = data.confirmationNo || data.bookingReference || `RES-PENDING`;

    // Dispatch background email notification to hotel management and guest
    sendReservationNotificationEmails({
      confirmationNo,
      ...pmsPayload,
    }).catch((mailErr) => {
      console.warn("Background email dispatch warning:", mailErr?.message);
    });

    return NextResponse.json({
      success: true,
      reservation: {
        bookingReference: confirmationNo,
        ...pmsPayload
      },
      data
    });
  } catch (error: any) {
    console.error("Reservation Error:", error);
    return NextResponse.json({ error: error.message || "Reservation creation failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || searchParams.get("reference");

  if (!id) {
    return NextResponse.json({ error: "id or reference required" }, { status: 400 });
  }

  try {
    const pmsUrl = process.env.PMS_API_URL || "http://localhost:3000/api/v1";
    const res = await fetch(`${pmsUrl}/reservations?propertyId=prop_ambarish`, {
      headers: {
        "x-api-key": process.env.PMS_API_SECRET || "",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from PMS" }, { status: res.status });
    }

    const list = await res.json();
    const found = Array.isArray(list)
      ? list.find((r: any) => r.confirmationNo === id || r.id === id || r.channelRef?.includes(id))
      : null;

    if (!found) {
      return NextResponse.json({ error: "Reservation not found in PMS" }, { status: 404 });
    }

    return NextResponse.json({ reservation: found });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
