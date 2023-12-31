import { profileUpdate } from "../../interfaces/driver";
import userRepositoryUpdateQuery from "../../../adapters/data-access/repositories/userRepository/userRepositoryUpdateQuery";
import { ObjectId } from "mongoose";
import userRepositoryGetQuery from "../../../adapters/data-access/repositories/userRepository/userRepositoryGetQuery";
import { handleError } from "../../errors/errorHandling";


export default {

    updateProfile: async (data: profileUpdate, userId: ObjectId) => {
        try {
            // return true
            return await userRepositoryUpdateQuery.updateUserProfile(data, userId);
        } catch (error) {
            handleError(error as Error)
        }
    },

    getProfile: async (userID: string) => {
        try {
            return await userRepositoryGetQuery.getUserWithId(userID)
        } catch (error) {
            handleError(error as Error)
        }
    },
}