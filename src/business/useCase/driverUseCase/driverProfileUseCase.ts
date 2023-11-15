import { ObjectId } from "mongoose"
import driverRepositoryGetQuerys from "../../../adapters/data-access/repositories/driverRepository/driverRepositoryGetQuerys"
import driverRepositoryUpdateQuerys from "../../../adapters/data-access/repositories/driverRepository/driverRepositoryUpdateQuerys"
import { handleError } from "../../errors/errorHandling"
import { profileUpdate } from "../../interfaces/driver"


export default {
    getDriverProfile: async (driverId: ObjectId) => {
        try {
            return (await driverRepositoryGetQuerys.findDriverWithId(driverId))
        } catch (error) {
            handleError(error as Error)
        }
    },

    updateProfile: async (data: profileUpdate, driverId: ObjectId) => {
        try {
            return (await driverRepositoryUpdateQuerys.updateDriverProfile(data, driverId))
        } catch (error) {
            handleError(error as Error)
        }
    }
}

