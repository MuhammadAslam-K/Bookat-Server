import { ObjectId } from "mongoose";
import { scheduleRideBookingData } from "../../../../business/interfaces/rides";
import ScheduleRideSchema from "../../models/scheduledRide-model";
import { handleError } from "../../../../business/errors/errorHandling";


export default {
    saveNewRide: async (data: scheduleRideBookingData, userId: string) => {
        try {
            const ride = new ScheduleRideSchema({
                user_id: userId,
                price: data.amount,
                vehicleType: data.vehicle,
                'pickupCoordinates.latitude': data.fromLocationLat,
                'pickupCoordinates.longitude': data.fromLocationLong,
                'dropoffCoordinates.latitude': data.toLocationLat,
                'dropoffCoordinates.longitude': data.toLocationLong,
                pickupLocation: data.fromLocation,
                dropoffLocation: data.toLocation,
                distance: data.distance,
                pickUpDate: data.selectedDateTime,
                duration: data.duration
            })
            await ride.save()
            return true
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

    rescheduleTheRide: async (data: any) => {
        console.log("data", data)
        try {
            const ride = new ScheduleRideSchema({
                user_id: data.user_id,
                price: data.price,
                vehicleType: data.vehicleType,
                'pickupCoordinates.latitude': data.pickupCoordinates.latitude,
                'pickupCoordinates.longitude': data.pickupCoordinates.longitude,
                'dropoffCoordinates.latitude': data.dropoffCoordinates.latitude,
                'dropoffCoordinates.longitude': data.dropoffCoordinates.longitude,
                pickupLocation: data.pickupLocation,
                dropoffLocation: data.dropoffLocation,
                distance: data.distance,
                pickUpDate: data.pickUpDate,
                duration: data.duration

            })
            await ride.save()
            return true
        } catch (error) {
            handleError(error as Error)
        }
    }
}