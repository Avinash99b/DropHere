export class TransferError extends Error {
    public readonly TYPE:TransferErrorType;
    constructor(type:TransferErrorType) {
        super(type.toString());
        this.TYPE = type;
    }
}

export enum TransferErrorType{
    TRANSFER_RECORD_NOT_FOUND,
    MISMATCHED_RECORD_TYPE,
    CREATE_TRANSFER_FAILED,
    INVALID_RECORD,
    UNKNOWN
}