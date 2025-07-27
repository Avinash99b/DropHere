"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextStoreValidator = exports.TextReceivingValidator = void 0;
const express_validator_1 = require("express-validator");
exports.TextReceivingValidator = [
    (0, express_validator_1.param)("receivingCode").isNumeric().isLength({ min: 6, max: 6 }).withMessage("Invalid Receiving Code")
];
exports.TextStoreValidator = [
    (0, express_validator_1.body)('text')
        .custom(value => {
        if (typeof value !== 'string') {
            throw new Error("Text must be a string");
        }
        if (value.length < 1) {
            throw new Error("Text must not be empty");
        }
        if (value.length > 1000) {
            throw new Error("Text must not exceed 1000 characters");
        }
        // Reject stringified objects/arrays
        if (value.trim().startsWith('{') ||
            value.trim().startsWith('[')) {
            throw new Error("Text must not be a serialized object or array");
        }
        // Optional: Basic base64 pattern if needed
        const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        if (!base64Regex.test(value)) {
            throw new Error("Text must be valid base64");
        }
        try {
            Buffer.from(value, 'base64').toString('utf8');
        }
        catch (_a) {
            throw new Error("Invalid base64 encoding");
        }
        return true;
    })
];
