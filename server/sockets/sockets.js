import Room from "./Room.js";
import fs from "fs";


const sockets = (socket) => {
    socket.on('send-message', ({message, roomId}) => {
        let skt = socket.broadcast;
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("message-from-server", {message});
        // console.log("Message Recieved.", data);
    })
    socket.on('typing-started', ({roomId}) => {
        let skt = socket.broadcast;
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("typing-started-from-server", {roomId});
        // console.log("Message Recieved.", data);
    })
    socket.on('typing-stopped', ({roomId}) => {
        let skt = socket.broadcast;
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("typing-stopped-from-server", {roomId});
        // console.log("Message Recieved.", data);
    })
    socket.on('join-room', ({roomId}) => {
        console.log("Joining room");
        socket.join(roomId);
        // console.log("Message Recieved.", data);
    })
    socket.on('new-room-created', ({roomId, userId}) => {
        const room = new Room({
            name: 'test',
            roomId,
            userId,
        })
        room.save();
        socket.broadcast.emit('new-room-created', {room});
        // console.log("Message Recieved.", data);
    })
    socket.on('room-removed', async ({roomId}) => {
        await Room.deleteOne({roomId: roomId});
        socket.broadcast.emit('room-removed', {roomId});
        // console.log("Message Recieved.", data);
    })
    socket.on('upload', ({data, roomId}) => {
        fs.writeFile("upload/" + "test.png", data, {encoding: "base64"}, () => {});
        socket.to(roomId).emit("uploaded", {buffer: data.toString("base64")});
    })
    socket.on('disconnect', (socket) => {
        console.log("User left");
    })
}

export default sockets;