import { NextResponse } from "next/server";
import { getTodayDate, getTomorrowDate } from "@/lib/formatters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn") || getTodayDate();
  const checkOut = searchParams.get("checkOut") || getTomorrowDate();
  
  const pmsUrl = process.env.PMS_API_URL || "http://localhost:3000/api/v1";

  try {
    const res = await fetch(
      `${pmsUrl}/availability/quote?arrivalDate=${checkIn}&departureDate=${checkOut}`,
      {
        headers: {
          "x-api-key": process.env.PMS_API_SECRET || "",
        },
        next: { revalidate: 0 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    console.warn("PMS availability responded with non-200:", res.status);
    return NextResponse.json({
      fallback: true,
      arrivalDate: checkIn,
      departureDate: checkOut,
      categories: [],
    });
  } catch (error: any) {
    console.warn("PMS Availability fetch error (using fallback):", error?.message);
    return NextResponse.json({
      fallback: true,
      arrivalDate: checkIn,
      departureDate: checkOut,
      categories: [],
    });
  }
}
