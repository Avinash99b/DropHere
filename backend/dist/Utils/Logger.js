"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logInfo = exports.logger = void 0;
// src/utils/logger.ts
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, errors, json } = winston_1.format;
exports.logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(timestamp(), errors({ stack: true }), // Include error stack if available
    json() // Output logs in JSON format
    ),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d",
            format: combine(timestamp(), errors({ stack: true }), json()),
        }),
    ],
});
// Shortcut functions
const logInfo = (msg, meta) => exports.logger.info(msg, meta);
exports.logInfo = logInfo;
const logError = (err, meta) => exports.logger.error(Object.assign({ message: err.message, stack: err.stack }, meta));
exports.logError = logError;
