import express, {Request, Response} from "express";
import {ReceivingCodeValidator} from "../../ValidatorTypes/Transfer";
import {validationResult} from "express-validator";
import TransferController from "../../Controllers/TransferController";
import {TransferError, TransferErrorType} from "../../Errors/TransferError";
import TextRoute from "./textRoute";
import FileRoute from "./fileRoute";

const app = express.Router();

app.use('/text', TextRoute);

app.use('/file', FileRoute);

app.get('/:receivingCode', (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }

    const {receivingCode} = req.params;

    TransferController.getTransferRecord(receivingCode)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err: TransferError) => {
        if (err.TYPE === TransferErrorType.TRANSFER_RECORD_NOT_FOUND) {
            res.status(404).json({error: "Transfer record not found"});
        } else {
            res.status(500).json({error: "Internal server error"});
        }
    });
})

export default app;