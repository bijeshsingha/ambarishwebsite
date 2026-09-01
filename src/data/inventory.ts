/**
 * Hotel Ambarish Grand Residency - Physical Room Inventory Database
 * Exact 35 Physical Rooms across Floors 2 to 6
 */

export interface PhysicalRoom {
  roomNumber: string;
  category: "DELUXE" | "EXECUTIVE" | "SUITE";
  categorySlug: "deluxe-room" | "executive-room" | "suite-room";
  categoryName: string;
  bedType: "KING" | "TWIN";
  bedLabel: string;
  floor: number;
}

export const HOTEL_PHYSICAL_ROOMS: PhysicalRoom[] = [
  // Floor 2 (2 Rooms)
  { roomNumber: "206", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 2 },
  { roomNumber: "207", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 2 },

  // Floor 3 (10 Rooms: 8 Deluxe + 1 Executive)
  { roomNumber: "301", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 3 },
  { roomNumber: "302", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 3 },
  { roomNumber: "303", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 3 },
  { roomNumber: "304", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 3 },
  { roomNumber: "305", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 3 },
  { roomNumber: "306", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 3 },
  { roomNumber: "308", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 3 },
  { roomNumber: "309", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 3 },
  { roomNumber: "310", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 3 },
  { roomNumber: "311", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 3 },

  // Floor 4 (10 Rooms: 10 Deluxe)
  { roomNumber: "401", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 4 },
  { roomNumber: "402", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 4 },
  { roomNumber: "403", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 4 },
  { roomNumber: "404", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 4 },
  { roomNumber: "405", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 4 },
  { roomNumber: "406", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 4 },
  { roomNumber: "408", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 4 },
  { roomNumber: "409", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 4 },
  { roomNumber: "410", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 4 },
  { roomNumber: "411", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 4 },

  // Floor 5 (7 Rooms: 4 Deluxe + 2 Suite + 1 Executive)
  { roomNumber: "501", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "KING", bedLabel: "King Bed", floor: 5 },
  { roomNumber: "502", category: "SUITE", categorySlug: "suite-room", categoryName: "Presidential Luxury Suite", bedType: "KING", bedLabel: "King Bed", floor: 5 },
  { roomNumber: "503", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "KING", bedLabel: "King Bed", floor: 5 },
  { roomNumber: "504", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 5 },
  { roomNumber: "505", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 5 },
  { roomNumber: "506", category: "DELUXE", categorySlug: "deluxe-room", categoryName: "Double Deluxe Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 5 },
  { roomNumber: "507", category: "SUITE", categorySlug: "suite-room", categoryName: "Presidential Luxury Suite", bedType: "KING", bedLabel: "King Bed", floor: 5 },

  // Floor 6 (6 Rooms: 6 Executive)
  { roomNumber: "601", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 6 },
  { roomNumber: "602", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 6 },
  { roomNumber: "604", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "KING", bedLabel: "King Bed", floor: 6 },
  { roomNumber: "605", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "KING", bedLabel: "King Bed", floor: 6 },
  { roomNumber: "606", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 6 },
  { roomNumber: "607", category: "EXECUTIVE", categorySlug: "executive-room", categoryName: "Executive Room", bedType: "TWIN", bedLabel: "Twin Bed", floor: 6 },
];

/**
 * Maximum physical room counts per category and bed type
 */
export const PHYSICAL_ROOM_CAPACITIES: Record<string, number> = {
  "deluxe-room_KING": 10,   // 10 King Deluxe Rooms
  "deluxe-room_TWIN": 15,   // 15 Twin Deluxe Rooms
  "executive-room_KING": 3, // 3 King Executive Rooms
  "executive-room_TWIN": 5, // 5 Twin Executive Rooms
  "suite-room_KING": 2,     // 2 Presidential Suites (King)
};

/**
 * Helper to get available inventory limit for a given category and bed type
 */
export function getMaxRoomCapacity(categorySlug: string, bedType: "KING" | "TWIN"): number {
  const key = `${categorySlug}_${bedType}`;
  return PHYSICAL_ROOM_CAPACITIES[key] || 1;
}

/**
 * Helper to get available bed type options for a category
 */
export function getBedTypeOptions(categorySlug: string): { type: "KING" | "TWIN"; label: string; maxCapacity: number }[] {
  if (categorySlug === "deluxe-room") {
    return [
      { type: "KING", label: "King Bed", maxCapacity: 10 },
      { type: "TWIN", label: "Twin Beds", maxCapacity: 15 },
    ];
  }
  if (categorySlug === "executive-room") {
    return [
      { type: "KING", label: "King Bed", maxCapacity: 3 },
      { type: "TWIN", label: "Twin Beds", maxCapacity: 5 },
    ];
  }
  if (categorySlug === "suite-room") {
    return [
      { type: "KING", label: "Master King Bed", maxCapacity: 2 },
    ];
  }
  return [{ type: "KING", label: "King Bed", maxCapacity: 1 }];
}
