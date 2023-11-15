export interface rideConfirmEmailData {
    userName: string | undefined;
    pickUpLocation: string;
    dropOffLocation: string;
    driverName: string;
    vehicleType: string;
    vehicleNo: string;
    amount: string;
}

export interface emailInfo {
    to: string | undefined;
    subject: string;
    message: string;
}