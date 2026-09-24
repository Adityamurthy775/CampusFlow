import exp from "express";
import { roommodel } from "../modules/room.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";

export const roomapp = exp.Router();

roomapp.get(
  "/all",
  verifyToken(...ALL_ROLES),
  async (req, res) => {
    const rooms = await roommodel.find({ isActive: { $ne: false } }).sort({ code: 1 });
    res.status(200).json({ message: "Rooms fetched successfully", payload: rooms });
  },
);

roomapp.get(
  "/info/:id",
  verifyToken(...ALL_ROLES),
  async (req, res) => {
    const room = await roommodel.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room fetched successfully", payload: room });
  },
);
