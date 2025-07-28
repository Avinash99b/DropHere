import {param, body, check, validationResult} from 'express-validator';

export const ReceivingCodeValidator = [
    param("receivingCode").isNumeric().isLength({min: 6, max: 6}).withMessage("Invalid Receiving Code")
]

export const TextStoreValidator = [
    body('text')
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
            if (
                value.trim().startsWith('{') ||
                value.trim().startsWith('[')
            ) {
                throw new Error("Text must not be a serialized object or array");
            }

            // Optional: Basic base64 pattern if needed
            const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
            if (!base64Regex.test(value)) {
                throw new Error("Text must be valid base64");
            }

            try {
                Buffer.from(value, 'base64').toString('utf8');
            } catch {
                throw new Error("Invalid base64 encoding");
            }

            return true;
        })
]

export const PeerJsIdValidator = [
    body('sender_peer_id')
        .isString().withMessage("sender_peer_id must be a string")
        .isLength({min: 1, max: 100}).withMessage("sender_peer_id must not be empty")
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage("sender_peer_id must be alphanumeric with optional underscores or hyphens")
]