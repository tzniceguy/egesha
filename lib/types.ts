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

export interface ParkingLots {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  availableSpotsCount: number;
  openingHours: string;
  closingHours: string;
}

export interface ParkingSpot {
  id: number;
  spotNumber: string;
  spotType: string;
  hourlyRate: string;
  isAvailable: boolean;
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
