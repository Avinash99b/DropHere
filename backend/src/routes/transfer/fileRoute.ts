import express, {Request, Response} from "express";
import {PeerJsIdValidator, ReceivingCodeValidator, TextStoreValidator} from "../../ValidatorTypes/Transfer";
import TextTransferController from "../../Controllers/TextTransferController";

import {validationResult} from "express-validator";
import {TransferError, TransferErrorType} from "../../Errors/TransferError";
import FileTransferController from "../../Controllers/FileTransferController";

const app = express.Router();
app.use(express.json())

/**
 * Route to get the sender peer ID for a file transfer using the receiving code.
 * @param receivingCode The code used to identify the transfer.
 * @returns A JSON response containing the sender peer ID or an error message.
 * @throws 400 if the receiving code is invalid or does not match the expected format.
 * @throws 404 if the transfer record is not found.
 * @throws 500 for internal server errors.
 */
app.get("/:receivingCode", ReceivingCodeValidator, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }
    const {receivingCode} = req.params

    FileTransferController.getSenderPeerId(receivingCode).then((sender_peer_id) => {
        res.status(200).json({sender_peer_id});
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

app.post("/", PeerJsIdValidator, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }
    const {sender_peer_id} = req.body;
    FileTransferController.createFileTransfer(sender_peer_id).then((code) => {
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