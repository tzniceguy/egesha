type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "unknown";

interface Booking {
  id: string;
  date: Date;
  status: BookingStatus;
  location: string;
  price: number;
  imageUrl?: string;
}

export const bookings: Booking[] = [
  {
    id: "booking-001",
    date: new Date("2024-02-20T10:00:00"),
    status: "pending",
    location: "Downtown Parking Lot",
    price: 1500,
    imageUrl:
      "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=800&auto=format&fit=crop",
  },
  {
    id: "booking-002",
    date: new Date("2024-02-21T14:30:00"),
    status: "confirmed",
    location: "Airport Terminal B",
    price: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1604063155785-ee4488b8ad15?w=800&auto=format&fit=crop",
  },
  {
    id: "booking-003",
    date: new Date("2024-02-19T09:15:00"),
    status: "completed",
    location: "Shopping Mall Complex",
    price: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop",
  },
  {
    id: "booking-004",
    date: new Date("2024-02-22T16:45:00"),
    status: "cancelled",
    location: "City Center Garage",
    price: 1800,
    imageUrl:
      "https://images.unsplash.com/photo-1611192826767-69731acc9821?w=800&auto=format&fit=crop",
  },
  {
    id: "booking-005",
    date: new Date("2024-02-23T11:30:00"),
    status: "unknown",
    location: "Beach Front Parking",
    price: 2500,
    imageUrl:
      "https://images.unsplash.com/photo-1582642880428-3e0c55f4c0bb?w=800&auto=format&fit=crop",
  },
];
