import {QueryResultRow} from "pg";

interface TextTransfer {
    text: string;
    code: number;
}

export interface TextTransferRow extends QueryResultRow{}