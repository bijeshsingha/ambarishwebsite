import { NextResponse } from "next/server";
import { createPmsReservation, getPmsReservationByReference } from "@/lib/hotel-os-client";
import { sendReservationNotificationEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.checkIn || !body.checkOut || !body.guestName || !body.guestPhone) {
      return NextResponse.json(
        { error: "Missing required reservation fields (checkIn, checkOut, guestName, guestPhone)" },
        { status: 400 }
      );
    }

    const pmsResult = await createPmsReservation(body);
    const confirmationNo = pmsResult.confirmationNo;

    // Asynchronously dispatch email notification
    sendReservationNotificationEmails({
      confirmationNo,
      ...body,
    }).catch((mailErr) => {
      console.warn("[Reservation API] Email dispatch warning:", mailErr?.message);
    });

    return NextResponse.json({
      success: true,
      reservation: {
        bookingReference: confirmationNo,
        confirmationNo,
        ...body,
      },
      data: pmsResult.rawData,
    });
  } catch (error: any) {
    console.error("[Reservation API] Creation failed:", error?.message);
    return NextResponse.json(
      { error: error.message || "Reservation creation failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("id");

  if (!reference) {
    return NextResponse.json({ error: "Booking reference required" }, { status: 400 });
  }

  const reservation = await getPmsReservationByReference(reference);

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found in PMS" }, { status: 404 });
  }

  return NextResponse.json({ success: true, reservation });
}
