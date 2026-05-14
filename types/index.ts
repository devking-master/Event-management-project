export type UserRole = "user" | "organizer" | "admin";

export interface JwtUser {
  id: string;
  email: string;
  role: UserRole;
}

export type TicketType = "Regular" | "VIP" | "VVIP" | "Transportation";
export type TicketStatus = "pending" | "paid" | "checked-in" | "cancelled";
export type PaymentStatus = "pending" | "successful" | "failed" | "refunded";
export type LogisticsStatus = "pending" | "in-progress" | "completed";
export type AccommodationStatus = "reserved" | "checked-in" | "checked-out" | "cancelled";
export type InviteStatus = "pending" | "accepted" | "declined";

export interface EventPayload {
  title: string;
  description?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  ticketTypes: {
    name: TicketType;
    price: number;
    quantity: number;
  }[];
  totalTickets: number;
  isFree: boolean;
  transportationAvailable: boolean;
  isTransportationFree: boolean;
  transportationPrice: number;
  transportationDetails?: string;
  status?: "upcoming" | "ongoing" | "ended";
}

export interface TicketPayload {
  eventId: string;
  userId: string;
  type: TicketType;
  price: number;
  code: string;
  status: TicketStatus;
}

export interface OrderPayload {
  userId: string;
  eventId: string;
  tickets: {
    type: TicketType;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
}

export interface PaymentPayload {
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: "Paystack" | "Flutterwave";
}

export interface GuestPayload {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  ticketType: TicketType;
  paymentStatus: PaymentStatus;
  checkInStatus: boolean;
}

export interface LogisticsPayload {
  eventId: string;
  title: string;
  category: "Venue setup" | "Transportation" | "Equipment" | "Vendors" | "Security" | "Staff/volunteers" | "Food & drinks" | "Timeline/schedule" | string;
  description: string;
  status: LogisticsStatus;
  assignedStaff?: string;
  deadline?: string;
  createdBy: string;
}

export interface AccommodationPayload {
  eventId: string;
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  status: AccommodationStatus;
  specialRequest?: string;
  createdBy: string;
}

export interface InvitePayload {
  eventId: string;
  email: string;
  status: InviteStatus;
}

export interface MerchandisePayload {
  eventId: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
}
