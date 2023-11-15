import { ObjectId } from "mongoose";
import scheduleRideSaveQuery from "../../../adapters/data-access/repositories/scheduleRide/scheduleRideSaveQuery";
import scheduleRideGetQuery from "../../../adapters/data-access/repositories/scheduleRide/scheduleRideGetQuery";
import scheduleRideUpdateQuery from "../../../adapters/data-access/repositories/scheduleRide/scheduleRideUpdateQuery";
import driverRepositoryUpdateQuerys from "../../../adapters/data-access/repositories/driverRepository/driverRepositoryUpdateQuerys";
import userRepositoryUpdateQuery from "../../../adapters/data-access/repositories/userRepository/userRepositoryUpdateQuery";
import { handleError } from "../../errors/errorHandling";
import { ReScheduleRide, scheduleRideBookingData } from "../../interfaces/rides";



export default {
    scheduleRide: async (data: scheduleRideBookingData, userId: string) => {
        try {
            return await scheduleRideSaveQuery.saveNewRide(data, userId)
        } catch (error) {
            handleError(error as Error)
        }
    },

    getScheduledRideOfUser: async (userId: ObjectId) => {
        try {
            return await scheduleRideGetQuery.getPendingScheduledRidesWithUserId(userId)
        } catch (error) {
            handleError(error as Error);

        }
    },

    cancelTheRide: async (data: { driverId: ObjectId, rideId: ObjectId }, userId: ObjectId) => {
        try {
            await Promise.all([
                scheduleRideUpdateQuery.cancelTheBookedRide(data.rideId),
                driverRepositoryUpdateQuerys.popUpTheScheduledRide(data.driverId, data.rideId),
                userRepositoryUpdateQuery.updateCancelledRides(userId)
            ]);
            return true
        } catch (error) {
            handleError(error as Error);
        }
    },

    reScheduleRideWithRideId: async (data: { rideId: string; selectedDateTime: string }) => {
        try {
            const result = await scheduleRideGetQuery.getScheduledRidesById(data.rideId)
            if (result) {
                const updatedResult: ReScheduleRide = {
                    ...result.toObject(),
                    pickUpDate: new Date(data.selectedDateTime),
                };
                await scheduleRideSaveQuery.rescheduleTheRide(updatedResult)
                return true
            }
        } catch (error) {
            handleError(error as Error)
        }
    }
}