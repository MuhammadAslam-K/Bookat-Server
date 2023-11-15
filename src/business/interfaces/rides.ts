export interface rideData {
    driverId: any;
    userId: any;
    fromLocationLat: any;
    fromLocationLong: any;
    toLocationLat: any;
    toLocationLong: any;
    userFromLocation: any;
    userToLocation: any;
    driverLatitude: any;
    driverLongitude: any;
    rideDistance: any;
    userVehicleType: string
    amount: any
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