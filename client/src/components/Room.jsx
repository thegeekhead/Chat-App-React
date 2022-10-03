import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import ChatWindow from './ChatWindow';

export default function Room() {
    const params = useParams();
    const {socket} = useOutletContext();
    // const socket = io();
    useEffect(() => {
        if (!socket) return;
        socket.emit("join-room", {roomId: params.roomId});
        console.log(params);
    }, [socket])
    return <ChatWindow />
}
