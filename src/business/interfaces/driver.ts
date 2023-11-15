import { ObjectId } from "mongoose";

export interface profileUpdate {
    name: string,
    email: string,
    mobile: string,
    aadharId: string,
    licenseId: string,
    aadharImageUrl: string,
    licenseImageUrl: string,
    driverImageUrl: string,
    // vehicleVerified: string,
    // driverVerified: string,
}

export interface driverInfo {
    aadharId: string,
    drivingLicenseId: string,
    address: string,
    aadharImageUrl: string,
    licenseImageUrl: string,
    driverImageUrl: string
}

export interface vehicleInfo {
    registrationId: string,
    rcImageUrl: string,
    vehicleModel: string,
    maxPersons: string,
    vehicleType: string,
    vehicleImageUrl1: string,
    vehicleImageUrl2: string
}

export interface DriverData {
    latitude: string;
    longitude: string;
    driverId: ObjectId;
    vehicleType: string;
}

export interface Driver {
    latitude: string;
    longitude: string;
    driverId: string;
    vehicleType: string;
}