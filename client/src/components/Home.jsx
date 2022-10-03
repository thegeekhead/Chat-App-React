import { Typography } from '@mui/material'
import React from 'react'
import { useOutletContext } from "react-router-dom";

export default function Home() {
    const {socket} = useOutletContext();
  return (
    <Typography>Welcome to my chat app.</Typography>
  )
}
