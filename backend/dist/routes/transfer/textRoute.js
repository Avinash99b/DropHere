"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Transfer_1 = require("../../ValidatorTypes/Transfer");
const TextTransferController_1 = __importDefault(require("../../Controllers/TextTransferController"));
const express_validator_1 = require("express-validator");
const TransferError_1 = require("../../Errors/TransferError");
const app = express_1.default.Router();
app.use(express_1.default.json());
app.get("/:receivingCode", Transfer_1.TextReceivingValidator, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { receivingCode } = req.params;
    TextTransferController_1.default.fetchText(receivingCode).then((text) => {
        res.status(200).json({ text: text });
    }).catch((err) => {
        if (err.TYPE === TransferError_1.TransferErrorType.TRANSFER_RECORD_NOT_FOUND) {
            res.status(404).json({ error: "Transfer record not found" });
        }
        else if (err.TYPE === TransferError_1.TransferErrorType.MISMATCHED_RECORD_TYPE) {
            res.status(400).json({ error: "Mismatched record type" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});
app.post("/", Transfer_1.TextStoreValidator, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { text } = req.body;
    TextTransferController_1.default.storeText(text).then((code) => {
        res.status(201).json({ receivingCode: code });
    }).catch((err) => {
        if (err.TYPE === TransferError_1.TransferErrorType.CREATE_TRANSFER_FAILED) {
            res.status(500).json({ error: "Failed to create transfer" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});
module.exports = app;
