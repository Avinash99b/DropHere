"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ErrorHandler_1 = require("./Middleware/ErrorHandler");
const app = (0, express_1.default)();
//Using Cors to allow cross-origin requests
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(require("./routes/router"));
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});
app.use(ErrorHandler_1.errorHandler);
module.exports = app;
