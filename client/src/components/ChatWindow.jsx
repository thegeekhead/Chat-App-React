import React, { useRef } from 'react'
import {  Button, Card, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from "react-router-dom";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';


export default function ChatWindow() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(false);
    const { socket } = useOutletContext();
    const {roomId} = useParams();
    const fileRef = useRef();

    function selectFile() {
        fileRef.current.click()
    }

    function fileSelected(e) {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const data = reader.result;
            socket.emit("upload", {data, roomId});
            setChat((prev) => [...prev, {message: reader.result, recieved: false, type: "image"}]);
        };
    }

    useEffect(() => {
        if(!socket) return;
        socket.on("message-from-server", (data) => {
        // console.log("Message Recieved", data);
            setChat((prev) => [...prev, {message: data.message, recieved: true}]);
        })

        socket.on("uploaded", (data) => {
            // console.log("Message Recieved", data);
                // setChat((prev) => [...prev, {message: data.message, recieved: true}]);
                console.log(data);
                setChat((prev) => [...prev, {message: data.buffer, recieved: true, type: "image"}]);
            })

        socket.on("typing-started-from-server", () => {
            // console.log("Message Recieved", data);
            // setChat((prev) => [...prev, {message: data.message, recieved: true}]);
            // console.log("typing...");
            setTyping(true);
        })

        socket.on("typing-stopped-from-server", () => {
            setTyping(false);
        })
    }, [socket])

    function handleForm(e) {
        e.preventDefault();
        // console.log(message);
        socket.emit('send-message',{message, roomId});
        setChat((prev) => [...prev, {message, recieved: false}]);
        setMessage("");
    }

    const [typingTimeout, settypingTimeout] = useState(null);

    function handleInput(e) {
        setMessage(e.target.value);
        socket.emit('typing-started', {roomId});
        if(typingTimeout) clearTimeout(typingTimeout);
        settypingTimeout(setTimeout(() => {
            socket.emit("typing-stopped", {roomId});
            // console.log("stopped");
        }, 1000));
    }

    async function removeRoom() {
        // await fetch(`http://localhost:4000/rooms/${roomId}`, {
        //     method: "DELETE",
        // });
        socket.emit("room-removed", {roomId});
    }
  return (
    <Box sx={{display: "flex", justifyContent: "center"}}>
        <Card sx={{padding: 2, marginTop: 10, width: "60%", backgroundColor: "gray", color: "white"}}>
            <Box sx={{display:"flex", justifyContent:"space-between"}}>
                {
                    roomId && <Typography>Room: {roomId}</Typography>
                }
                {
                    roomId && <Button size='small' variant='text' color='secondary' onClick={removeRoom}>Delete Room</Button>
                }
            </Box>
            <Box sx={{marginBottom: 5}}>
            {chat.map((data) => (
                data.type === "image" ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img style={{ float: data.recieved ? 'left' : 'right'}} src={data.message} alt="image" width={200}/> 
                ) :
            (<Typography sx={{ textAlign: data.recieved ? 'left' : 'right'}} key={data.message}>{data.message}</Typography>)
            ))}
        </Box>
        <div>
            <Box component='form' onSubmit={handleForm}>
            { typing && 
            <InputLabel sx={{color: "white"}} shrink htmlFor="message-input">
                Typing...
            </InputLabel>
            }
            <OutlinedInput
            id='message-input'
            sx={{ backgroundColor: "white"}}
            placeholder='Write your message'
            fullWidth
            size='small'
                value={message}
                onChange={handleInput}
                endAdornment={
                    <InputAdornment position="end">
                        <input onChange={fileSelected} ref={fileRef} type="file" style={{display: "none"}}/>
                        <IconButton
                        edge="end"
                        type='button'
                        onClick={selectFile}
                    >
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton
                        edge="end"
                        type='submit'
                    >
                        <SendIcon/>
                    </IconButton>
                    </InputAdornment>
                }
            />
            </Box>
        </div>
        </Card>
    </Box>
  )
}
