import express, {Request, Response} from "express";
import {ReceivingCodeValidator, TextStoreValidator} from "../../ValidatorTypes/Transfer";
import TextTransferController from "../../Controllers/TextTransferController";

import {validationResult} from "express-validator";
import {TransferError, TransferErrorType} from "../../Errors/TransferError";

const app = express.Router();
app.use(express.json())

app.get("/:receivingCode", ReceivingCodeValidator, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }
    const {receivingCode} = req.params

    TextTransferController.fetchText(receivingCode).then((text) => {
        res.status(200).json({text: text});
    }).catch((err: TransferError) => {
        if (err.TYPE === TransferErrorType.TRANSFER_RECORD_NOT_FOUND) {
            res.status(404).json({error: "Transfer record not found"});
        } else if (err.TYPE === TransferErrorType.MISMATCHED_RECORD_TYPE) {
            res.status(400).json({error: "Mismatched record type"});
        } else {
            res.status(500).json({error: "Internal server error"});
        }
    })

});

app.post("/", TextStoreValidator, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }
    const {text} = req.body;
    TextTransferController.storeText(text).then((code) => {
        res.status(201).json({receivingCode: code});
    }).catch((err: TransferError) => {
        if (err.TYPE === TransferErrorType.CREATE_TRANSFER_FAILED) {
            res.status(500).json({error: "Failed to create transfer"});
        } else {
            res.status(500).json({error: "Internal server error"});
        }
    });
});

export default app;