import { Schema } from "mongoose";
import driverRepositoryGetQuerys from "../../../adapters/data-access/repositories/driverRepository/driverRepositoryGetQuerys"
import driverRepositoryUpdateQuerys from "../../../adapters/data-access/repositories/driverRepository/driverRepositoryUpdateQuerys";
import { handleError } from "../../errors/errorHandling";
import cabRepositoryUpdateQuery from "../../../adapters/data-access/repositories/cabRepository/cabRepositoryUpdateQuery";
import { driverInfo } from "../../interfaces/driver";
import { vehicleInfo } from "../../interfaces/driver";

export default {

    saveDriverInfo: async (data: driverInfo, driverId: Schema.Types.ObjectId) => {
        try {
            const aadharidExists = await driverRepositoryGetQuerys.findDriverWithAadharId(data.aadharId)
            if (!aadharidExists) {
                const drivingLicenseIdExists = await driverRepositoryGetQuerys.findDriverWithDrivingLicenseId(data.drivingLicenseId)

                if (!drivingLicenseIdExists) {
                    return await driverRepositoryUpdateQuerys.updateDriverInfo(data, driverId);
                }
                else {
                    throw new Error("License Id already Exists please Re-check !!")
                }
            }
            else {
                throw new Error("Aadhar Id already Exists please Re-check !!")
            }

        } catch (error) {
            handleError(error as Error)
        }
    },

    saveVehicleInfo: async (data: vehicleInfo, driverId: Schema.Types.ObjectId) => {
        try {
            const rcExists = await driverRepositoryGetQuerys.findVehicleWithRcNo(data.registrationId)
            if (!rcExists) {
                await Promise.all([
                    cabRepositoryUpdateQuery.updateCabArray(data.vehicleType, driverId),
                    driverRepositoryUpdateQuerys.updateVehicleInfo(data, driverId)
                ])

            }
            else {
                throw new Error("Registration No already Exists please Re-check !!")
            }

        } catch (error) {
            handleError(error as Error)
        }
    },


}

