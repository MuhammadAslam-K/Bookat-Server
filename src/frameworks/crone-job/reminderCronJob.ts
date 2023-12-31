import cron from "node-cron"
import ScheduleRideSchema from "../../adapters/data-access/models/scheduledRide-model";
import nodeMailer from "../../adapters/external-services/email/nodeMailer";
import UserSchema from "../../adapters/data-access/models/user-model";


export async function startReminderCronJob() {
    cron.schedule('*/10 * * * *', async () => {

        const currentTime = new Date();


        const pickupTime = new Date(currentTime.getTime() + 10 * 60000);


        const rides = await ScheduleRideSchema.find({ pickUpDate: { $lte: pickupTime } })

        for (const data of rides) {
            const user = await UserSchema.findOne({ _id: data.user_id })
            const info = {
                to: user?.email,
                subject: "Pickup Reminder",
                message: "Your pickup time is in 10 minutes. Please be ready!",
            };

            await nodeMailer.rideRemainderEmail(info);
        }
    });
}
