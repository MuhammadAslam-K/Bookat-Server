import { Server as SocketIOServer, Socket } from "socket.io";
import { calculateDistance } from "./socket-ioHelper";
import driverRideUseCase from "../../business/useCase/driverUseCase/driverRideUseCase";
import { ObjectId } from "mongoose";
import chatUseCase from "../../business/useCase/chat-useCase/chat-useCase";
import { DriverData } from "../../business/interfaces/driver";
import { rideConfirm } from "../../business/interfaces/rides";


// / / / / /USER / / / / /
let userLat: string
let userLon: string
let userVehicleType: string
let userId: string
let userFromLocation: string
let userToLocation: string
let amount: string
let rideDistance: string
let rideDuration: string
let fromLocationLat: string
let fromLocationLong: string
let toLocationLat: string
let toLocationLong: string

// / / / / /DRIVER / / /
let driverLatitude: string
let driverLongitude: string
let driverId: ObjectId
let driverVehicleType: string

export const setUpSocketIO = (server: any): void => {
    const io: SocketIOServer = new SocketIOServer(server, {
        cors: {
            origin: "*",
            credentials: true
        },
    });




    io.on('connect', (socket: Socket) => {


        console.log('connected:', socket.id);

        socket.on("confirmRide", (data) => {
            console.log("ride confirm", data)

            userLat = data.latitude;
            userLon = data.longitude;
            userVehicleType = data.vehicle;
            userId = data.userId;
            userFromLocation = data.userFromLocation;
            userToLocation = data.userToLocation;
            amount = data.amount;
            rideDistance = data.rideDistance;
            rideDuration = data.rideDuration;
            fromLocationLat = data.fromLocationLat;
            fromLocationLong = data.fromLocationLong;
            toLocationLat = data.toLocationLat;
            toLocationLong = data.toLocationLong;

            io.emit("driverlocationUpdate")
        })


        let nearbyDriver: { distance: number; driverId: ObjectId; userId: string; rideDistance: string; userFromLocation: string; userToLocation: string; amount: string; }[] = []
        const processedDriverIds = new Set<string | undefined | ObjectId>();
        socket.on('getdriverlocationUpdate', async (data: DriverData) => {
            console.log(`Location update from driver (${socket.id}):`, data);
            driverLatitude = data.latitude
            driverLongitude = data.longitude
            driverId = data.driverId
            driverVehicleType = data.vehicleType

            const distance = calculateDistance(
                parseFloat(userLat),
                parseFloat(userLon),
                userVehicleType,
                parseFloat(driverLatitude),
                parseFloat(driverLongitude),
                driverVehicleType,
            );
            console.log("distance user and driver vehicle type :", distance, userVehicleType, driverVehicleType)
            // if (distance != false) {
            if (distance >= -2 && !processedDriverIds.has(driverId)) {
                const data = { distance, driverId, userId, rideDistance, userFromLocation, userToLocation, amount }
                // console.log("driver push data :", data)
                const available = await driverRideUseCase.checkAvailableDrivers(driverId, parseInt(rideDuration))
                console.log("available for ride", available)
                if (available) {
                    nearbyDriver.push(data)
                    processedDriverIds.add(driverId)
                }
            }
        });

        // Emit nearby drivers one by one at regular intervals
        const emitNearbyDrivers = () => {
            if (nearbyDriver.length > 0) {
                const driverData = nearbyDriver.shift();
                // console.log("driver data", driverData)
                console.log("send Requist to driver")
                io.emit('getDriverConfirmation', driverData);
                processedDriverIds.delete(driverData?.driverId);
            }
        };

        socket.on("rejectedRide", (data) => {
            console.log("Driver Rejected Ride")
            emitNearbyDrivers()
        })

        socket.on("approveRide", async (data) => {
            console.log("Driver approved the ride", data)
            nearbyDriver = []
            processedDriverIds.clear()

            const value = {
                toLocationLat,
                toLocationLong,
                fromLocationLat,
                fromLocationLong,
                userFromLocation,
                userToLocation,
                driverLatitude,
                driverLongitude,
                rideDistance,
                userVehicleType,
                amount,
                userId,
                driverId
            }
            const rideId = await driverRideUseCase.saveNewRide(value)
            console.log("ride save id", rideId)
            const values = {
                driverId,
                userId,
                rideId,
            }
            io.emit("sendRideDetails", values)
        })

        socket.on("userCancelRide", (data) => {
            console.log("user Cancelled the ride")
            processedDriverIds.clear()
            nearbyDriver = []
        })
        const interval = setInterval(emitNearbyDrivers, 15000);

        socket.on("updateDriverLocationToUser", (data) => {
            console.log("Update Driver Location To User", data)

            io.emit("driverUpdatedLocationToUser", data)
        })

        socket.on("startRide", (data) => {
            console.log("startRide", data)
            io.emit("startRideNotifyUser", data)
        })

        socket.on("endRide", (data) => {
            console.log("End Ride", data)
            io.emit("endRideNotifyUser", data)
        })

        socket.on("getDriverLocation", (data) => {
            console.log("getDriverLocation data", data)
            io.emit("getDriverLocation", data)
        })

        socket.on("locationUpdateFromDriver", (data) => {
            console.log("locationUpdateFromDriver data", data)
            io.emit("driverLoacationUpdateToUser", data)


        })

        // CHAT
        socket.on("join-chat", async (rideId) => {
            console.log("join-chat", rideId)
            const result = await chatUseCase.getChatByRideId(rideId)
            io.emit("chat-message", result, rideId)
        })

        socket.on("update-chat-message", async (data) => {
            console.log("update-chat-message", data)
            const result = await chatUseCase.saveChat(data)
        })



    });

    io.on('error', (error) => {
        console.error('Socket.IO error:', error);
    });
};
