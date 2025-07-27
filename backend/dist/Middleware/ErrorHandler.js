"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../Errors/AppError");
const Logger_1 = require("../Utils/Logger");
function errorHandler(err, req, res, next) {
    // Log the error with context
    (0, Logger_1.logError)(err, {
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
        return;
    }
    // Unknown error fallback
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
}
exports.errorHandler = errorHandler;
