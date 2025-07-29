import express from "express";
import TransferRouter from "./transfer"
const router = express.Router();

router.use("/transfer", TransferRouter);


export default router;