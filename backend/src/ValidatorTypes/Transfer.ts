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
        }),
    body('expires_at').isString()
        .custom(value => {
            if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                throw new Error('Date must be in the format YYYY-MM-DDTHH:mm:ss.sssZ');
            }
            // Check if the date is in the future
            if (new Date(value).getTime() <= Date.now()) {
                throw new Error("expires_at must be a future date");
            }
            return value;
        })
]

export const PeerJsIdValidator = [
    body('sender_peer_id')
        .isString().withMessage("sender_peer_id must be a string")
        .isLength({min: 1, max: 100}).withMessage("sender_peer_id must not be empty")
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage("sender_peer_id must be alphanumeric with optional underscores or hyphens")
]