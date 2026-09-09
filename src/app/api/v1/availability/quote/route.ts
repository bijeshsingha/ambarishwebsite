import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTodayDate, getTomorrowDate } from "@/lib/formatters";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { fetchPmsAvailability } from "@/lib/hotel-os-client";

// Physical room counts across floors 2 to 6
const PHYSICAL_CAPACITIES = [
  {
    roomTypeId: "rt_deluxe_king",
    roomTypeCode: "DELUXE_KING",
    roomTypeName: "Double Deluxe Room (King Bed)",
    totalRooms: 10,
    capacity: 3,
  },
  {
    roomTypeId: "rt_deluxe_twin",
    roomTypeCode: "DELUXE_TWIN",
    roomTypeName: "Double Deluxe Room (Twin Beds)",
    totalRooms: 15,
    capacity: 3,
  },
  {
    roomTypeId: "rt_exec_king",
    roomTypeCode: "EXEC_KING",
    roomTypeName: "Executive Room (King Bed)",
    totalRooms: 3,
    capacity: 3,
  },
  {
    roomTypeId: "rt_exec_twin",
    roomTypeCode: "EXEC_TWIN",
    roomTypeName: "Executive Room (Twin Beds)",
    totalRooms: 5,
    capacity: 3,
  },
  {
    roomTypeId: "rt_suite",
    roomTypeCode: "SUITE",
    roomTypeName: "Presidential Luxury Suite",
    totalRooms: 2,
    capacity: 4,
  },
];

function getStayDatesArray(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const curr = new Date(checkIn);
  const end = new Date(checkOut);
  while (curr < end) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

export async function GET(request: Request) {
  const clientIp = getClientIp(request);

  // SEC 09 & Table 3: 30 requests per minute per source
  const rate = checkRateLimit("availability", clientIp, 30, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(rate.resetInSeconds) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn") || getTodayDate();
  const checkOut = searchParams.get("checkOut") || getTomorrowDate();

  // Validate dates
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || outDate <= inDate) {
    return NextResponse.json(
      { error: "INVALID_DATES", message: "Departure date must be after arrival date." },
      { status: 400 }
    );
  }

  const now = Date.now();

  // Expire stale holds
  db.prepare(
    "UPDATE inventory_holds SET status = 'EXPIRED' WHERE status = 'ACTIVE' AND expires_at < ?"
  ).run(now);

  const stayDates = getStayDatesArray(checkIn, checkOut);

  // SEC 05: Calculate live availability across stay dates based on confirmed + held rooms
  const categories = PHYSICAL_CAPACITIES.map((cat) => {
    let minAvailable = cat.totalRooms;
    let maxOccupiedOrBlocked = 0;

    for (const stayDate of stayDates) {
      // 1. Check active unexpired holds
      const heldRow = db
        .prepare(
          "SELECT COALESCE(SUM(quantity), 0) as held FROM inventory_holds WHERE room_type_id = ? AND stay_date = ? AND status = 'ACTIVE' AND expires_at > ?"
        )
        .get(cat.roomTypeId, stayDate, now) as { held: number };

      // 2. Check confirmed reservations
      const resRows = db
        .prepare(
          "SELECT booked_rooms_json FROM reservations WHERE status = 'CONFIRMED' AND check_in <= ? AND check_out > ?"
        )
        .all(stayDate, stayDate) as Array<{ booked_rooms_json: string }>;

      let confirmedCount = 0;
      for (const row of resRows) {
        try {
          const booked = JSON.parse(row.booked_rooms_json);
          for (const rm of booked) {
            if (rm.roomTypeId === cat.roomTypeId) {
              confirmedCount += rm.quantity || 1;
            }
          }
        } catch {
          // ignore parsing error
        }
      }

      const occupied = (heldRow ? heldRow.held : 0) + confirmedCount;
      if (occupied > maxOccupiedOrBlocked) {
        maxOccupiedOrBlocked = occupied;
      }
      const available = Math.max(0, cat.totalRooms - occupied);
      if (available < minAvailable) {
        minAvailable = available;
      }
    }

    return {
      roomTypeId: cat.roomTypeId,
      roomTypeCode: cat.roomTypeCode,
      roomTypeName: cat.roomTypeName,
      totalRooms: cat.totalRooms,
      occupiedOrBlocked: maxOccupiedOrBlocked,
      availableCount: minAvailable,
      capacity: cat.capacity,
    };
  });

  const totalAvailableRooms = categories.reduce((sum, c) => sum + c.availableCount, 0);

  // SEC 06: Connect PMS integration if live connection enabled
  let pmsData: any = null;
  try {
    pmsData = await fetchPmsAvailability(checkIn, checkOut);
  } catch {
    // Graceful fallback to local authoritative inventory
  }

  return NextResponse.json({
    arrivalDate: checkIn,
    departureDate: checkOut,
    totalRooms: 35,
    availableRooms: totalAvailableRooms,
    categories,
    pmsSynced: !pmsData?.fallback,
  });
}
