export enum TransferType {
    TEXT="text",
    FILE="file"
}
interface Transfer {
    type: TransferType;
    code: number;
}

export interface TransferRow extends Transfer {}