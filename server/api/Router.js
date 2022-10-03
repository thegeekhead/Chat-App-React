import { Router } from "express";
import Room from "../sockets/Room.js";
const router = new Router();

router.get("/rooms",  async (req, res) => {
    const rooms = await Room.find();
    res.json({rooms})
});

router.delete("/rooms/:roomId",  async (req, res) => {
    await Room.deleteOne({roomId: req.params.roomId});
    res.json({data: { message: "deleted" }});
});

export default router;