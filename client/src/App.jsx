import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Outlet
} from "react-router-dom";
import Header from "./components/Header";
import {io} from 'socket.io-client'
import Cookies from 'js-cookies';


function App() {

  
  const [socket, setSocket] = useState(null);
  const [userId, setuserId] = useState(null);
  useEffect(() => {
    setSocket(io('http://localhost:4000/'));
    const _userId = Cookies.getItem('userId')
    if(_userId) setuserId(_userId)
}, []);
  

  return (
    <Container>
      {/* <ChatWindow/> */}
      <Header socket={socket} userId={userId} setuserId={setuserId} />
      <Box sx={{ display: "flex", justifyContent: "center"}}>
        
        <Outlet context={{socket, userId}}/>
      </Box>
      
    </Container>
  );
}

export default App;
