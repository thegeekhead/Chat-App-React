import { Box, Button, Card } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookies';
import React, { useEffect, useState } from 'react'

export default function Header({socket, userId, setuserId}) {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([])

    function createNewRoom() {
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
        socket.emit("new-room-created", { roomId, userId });
        // setRooms([...rooms, {roomId, name: "Test", _Id: "testId"}]);
    }

    useEffect(() => {
      if(!socket) return;

      socket.on("new-room-created", ({room}) => {
        setRooms([...rooms, room]);
      })

      socket.on("room-created", ({roomId}) => {
        setRooms(rooms.filter(room => room.roomId !== roomId));
      })
    }, [socket]);

    useEffect(() => {
        async function fetchRooms() {
            const res = await fetch('http://localhost:4000/rooms');
            const {rooms} = await res.json();
            setRooms(rooms);
        }
        fetchRooms();
      }, [socket]);

      function logIn() {
        const userId = uuidv4();
        setuserId(userId);
        Cookies.setItem("userId",userId);
        navigate('/')
      }

      function logOut() {
        setuserId(null);
        Cookies.removeItem("userId");
        navigate('/')
      }
    
    
    return (
        <Card sx={{marginTop: 5, backgroundColor: "gray"}} raised>
            <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                <Box>
                    <Link style={{textDecoration: "none"}} to="/">
                        <Button sx={{ color: "white"}} variant="text">
                            Home
                        </Button>
                    </Link>
                
                {
                    rooms.map((room) => (
                        <Link key={room._Id} style={{textDecoration: "none"}} to={`/room/${room.roomId}`}>
                            <Button sx={{ color: "white"}} variant="text">
                                {room.name}
                            </Button>
                        </Link>
                    ))
                }
                </Box>
                <Box>
                {
                    userId && 
                    <>
                        <Button sx={{ color: "white"}} variant="text" onClick={logOut}>
                            Logout
                        </Button>
                        <Button sx={{ color: "white"}} variant="text" onClick={createNewRoom}>
                            New Room
                        </Button>
                    </>

                }
                {
                    !userId && 
                    (<Button sx={{ color: "white"}} variant="text" onClick={logIn}>
                        Login
                    </Button>)
                }
                </Box>
            </Box>
        </Card>
    )
    }
