"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default.Router();
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Health check passed",
    });
});
module.exports = app;
