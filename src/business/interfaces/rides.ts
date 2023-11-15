import { ObjectId } from "mongoose";

export interface rideData {
    driverId: ObjectId;
    userId: string;
    fromLocationLat: string;
    fromLocationLong: string;
    toLocationLat: string;
    toLocationLong: string;
    userFromLocation: string;
    userToLocation: string;
    driverLatitude: string;
    driverLongitude: string;
    rideDistance: string;
    userVehicleType: string
    amount: string
}

export interface scheduleRideBookingData {
    vehicle: string;
    amount: string;
    fromLocation: string;
    toLocation: string;
    distance: string;
    duration: number;
    fromLocationLat: number;
    fromLocationLong: number;
    toLocationLat: number;
    toLocationLong: number;
    selectedDateTime: string;
}

export interface rideConfirm {
    userLat: string
    userLon: string
    userVehicleType: string
    userId: string
    userFromLocation: string
    userToLocation: string
    amount: string
    rideDistance: string
    rideDuration: string
    fromLocationLat: string
    fromLocationLong: string
    toLocationLat: string
    toLocationLong: string
}

export interface rideconfirmData {
    data: rideConfirm
}


export interface ReScheduleRide {
    user_id: string;
    price: number;
    vehicleType: string;
    pickupCoordinates: {
        latitude: number;
        longitude: number;
    };
    dropoffCoordinates: {
        latitude: number;
        longitude: number;
    };
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    pickUpDate: Date;
    duration: string;
}