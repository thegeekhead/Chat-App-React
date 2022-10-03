import express from "express";
import http from 'http';
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import sockets from "./sockets/sockets.js";
import mongoose from 'mongoose';
import cors from 'cors';
import router from "./api/Router.js";

await mongoose.connect(
    'mongodb+srv://freak123:freak123@cluster0.arnx4ok.mongodb.net/?retryWrites=true&w=majority'
)

const app = express();
const PORT = 4000;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000'],
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.get('/',(req, res) => {
    // res.json({data: 'Hello from socket.'})
    res.sendFile(__dirname + '/index.html');
});

app.use("/", router);

io.on('connection', sockets)

httpServer.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})