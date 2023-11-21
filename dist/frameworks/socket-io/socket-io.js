"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocketIO = void 0;
const socket_io_1 = require("socket.io");
const socket_ioHelper_1 = require("./socket-ioHelper");
const driverRideUseCase_1 = __importDefault(require("../../business/useCase/driverUseCase/driverRideUseCase"));
const chat_useCase_1 = __importDefault(require("../../business/useCase/chat-useCase/chat-useCase"));
// / / / / /USER / / / / /
let userLat;
let userLon;
let userVehicleType;
let userId;
let userFromLocation;
let userToLocation;
let amount;
let rideDistance;
let rideDuration;
let fromLocationLat;
let fromLocationLong;
let toLocationLat;
let toLocationLong;
// / / / / /DRIVER / / / / / 
let driverLatitude;
let driverLongitude;
let driverId;
let driverVehicleType;
const setUpSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            credentials: true
        },
    });
    io.on('connect', (socket) => {
        console.log('connected:', socket.id);
        socket.on("confirmRide", (data) => {
            console.log("ride confirm", data);
            userLat = data.userLat;
            userLon = data.userLon;
            userVehicleType = data.userVehicleType;
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
            io.emit("driverlocationUpdate");
        });
        let nearbyDriver = [];
        const processedDriverIds = new Set();
        socket.on('getdriverlocationUpdate', async (data) => {
            console.log(`Location update from driver (${socket.id}):`, data);
            driverLatitude = data.latitude;
            driverLongitude = data.longitude;
            driverId = data.driverId;
            driverVehicleType = data.vehicleType;
            const distance = (0, socket_ioHelper_1.calculateDistance)(parseFloat(userLat), parseFloat(userLon), userVehicleType, parseFloat(driverLatitude), parseFloat(driverLongitude), driverVehicleType);
            console.log("distance user and driver vehicle type :", distance, userVehicleType, driverVehicleType);
            // if (distance != false) {
            if (distance >= -2 && !processedDriverIds.has(driverId)) {
                const data = { distance, driverId, userId, rideDistance, userFromLocation, userToLocation, amount };
                // console.log("driver push data :", data)
                const available = await driverRideUseCase_1.default.checkAvailableDrivers(driverId, parseInt(rideDuration));
                console.log("available for ride", available);
                if (available) {
                    nearbyDriver.push(data);
                    processedDriverIds.add(driverId);
                }
            }
        });
        // Emit nearby drivers one by one at regular intervals
        const emitNearbyDrivers = () => {
            if (nearbyDriver.length > 0) {
                const driverData = nearbyDriver.shift();
                // console.log("driver data", driverData)
                console.log("send Requist to driver");
                io.emit('getDriverConfirmation', driverData);
                processedDriverIds.delete(driverData?.driverId);
            }
        };
        socket.on("rejectedRide", (data) => {
            console.log("Driver Rejected Ride");
            emitNearbyDrivers();
        });
        socket.on("approveRide", async (data) => {
            console.log("Driver approved the ride", data);
            nearbyDriver = [];
            processedDriverIds.clear();
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
            };
            const rideId = await driverRideUseCase_1.default.saveNewRide(value);
            console.log("ride save id", rideId);
            const values = {
                driverId,
                userId,
                rideId,
            };
            io.emit("sendRideDetails", values);
        });
        socket.on("userCancelRide", (data) => {
            console.log("user Cancelled the ride");
            processedDriverIds.clear();
            nearbyDriver = [];
        });
        const interval = setInterval(emitNearbyDrivers, 15000);
        socket.on("updateDriverLocationToUser", (data) => {
            console.log("Update Driver Location To User", data);
            io.emit("driverUpdatedLocationToUser", data);
        });
        socket.on("startRide", (data) => {
            console.log("startRide", data);
            io.emit("startRideNotifyUser", data);
        });
        socket.on("endRide", (data) => {
            console.log("End Ride", data);
            io.emit("endRideNotifyUser", data);
        });
        socket.on("getDriverLocation", (data) => {
            console.log("getDriverLocation data", data);
            io.emit("getDriverLocation", data);
        });
        socket.on("locationUpdateFromDriver", (data) => {
            console.log("locationUpdateFromDriver data", data);
            io.emit("driverLoacationUpdateToUser", data);
        });
        // CHAT
        socket.on("join-chat", async (rideId) => {
            console.log("join-chat", rideId);
            const result = await chat_useCase_1.default.getChatByRideId(rideId);
            io.emit("chat-message", result, rideId);
        });
        socket.on("update-chat-message", async (data) => {
            console.log("update-chat-message", data);
            const result = await chat_useCase_1.default.saveChat(data);
        });
    });
    io.on('error', (error) => {
        console.error('Socket.IO error:', error);
    });
};
exports.setUpSocketIO = setUpSocketIO;
