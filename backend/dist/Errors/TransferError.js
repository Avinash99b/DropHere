"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferErrorType = exports.TransferError = void 0;
class TransferError extends Error {
    constructor(type) {
        super(type.toString());
        this.TYPE = type;
    }
}
exports.TransferError = TransferError;
var TransferErrorType;
(function (TransferErrorType) {
    TransferErrorType[TransferErrorType["TRANSFER_RECORD_NOT_FOUND"] = 0] = "TRANSFER_RECORD_NOT_FOUND";
    TransferErrorType[TransferErrorType["MISMATCHED_RECORD_TYPE"] = 1] = "MISMATCHED_RECORD_TYPE";
    TransferErrorType[TransferErrorType["CREATE_TRANSFER_FAILED"] = 2] = "CREATE_TRANSFER_FAILED";
    TransferErrorType[TransferErrorType["INVALID_RECORD"] = 3] = "INVALID_RECORD";
    TransferErrorType[TransferErrorType["UNKNOWN"] = 4] = "UNKNOWN";
})(TransferErrorType = exports.TransferErrorType || (exports.TransferErrorType = {}));
