export type LocationType = {
  latitude: number;
  longitude: number;
};

export interface RegistrationData {
  phoneNumber: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface OtpVerificationData {
  phoneNumber: string;
  otp: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  password?: string;
}

export interface ParkingLot {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  available_spots_count: number;
  opening_hours: string;
  closing_hours: string;
}

export interface ParkingSpot {
  id: number;
  spot_number: string;
  spot_type: string;
  hourly_rate: string;
  is_available: boolean;
}

export interface BookingData {
  parkingSpot: number;
  vehicle: number;
  startTime: string;
  endTime: string;
}

export interface Vehicle {
  id: number;
  licensePlate: string;
  vehicleType: string;
  make: string;
  model: string;
  color: string;
}

export interface VehicleData {
  licensePlate: string;
  vehicleType: string;
  make: string;
  model: string;
  color: string;
}

export interface User {
  tokenType: string;
  exp: number;
  iat: number;
  jti: string;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
