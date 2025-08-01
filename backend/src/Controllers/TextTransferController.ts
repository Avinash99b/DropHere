import pool from "../config/DBConfig";
import TransferController from "./TransferController";
import {TransferError, TransferErrorType} from "../Errors/TransferError";
import {TransferType} from "../Types/Transfer";
import {logger} from "../Utils/Logger";
import {TextRow} from "../Types/Text";

class TextTransferController {

    static {
        logger.info("TextTransferController initialized");
    }

    /**
     * Stores the given text in the database and creates a transfer record.
     * @param text The text to be stored.
     * @param expires_at The expiration date for the transfer record.
     * @returns A promise that resolves to the receiving code of the transfer record.
     * @throws TransferError if the transfer record creation fails.
     */
    public static storeText(text: string,expires_at:string): Promise<number> {

        return new Promise(async (resolve, reject) => {
            const conn = await pool.connect();
            await conn.query("BEGIN")
            try{
                const code =await TransferController.createTransferRecord(TransferType.TEXT, conn,expires_at)
                await conn.query("Insert into texts(code,text) values ($1,$2)", [code, text])
                await conn.query("COMMIT")
                resolve(code)
            }catch (e:any){
                await conn.query("ROLLBACK")
                reject(new TransferError(TransferErrorType.CREATE_TRANSFER_FAILED))
                logger.error(e,"Failed to create transfer")
            }finally {
                conn.release()
            }
        })
    }

    /**
     * Fetches the text associated with the given receiving code.
     * @throws TransferError if the transfer record is not found or if the type does not match TEXT.
     * @param receivingCode
     */
    public static async fetchText(receivingCode: string): Promise<string> {
        const transferRecord =await TransferController.getTransferRecord(receivingCode);
        if(transferRecord == null) throw new TransferError(TransferErrorType.TRANSFER_RECORD_NOT_FOUND);

        if(transferRecord.type != TransferType.TEXT) throw new TransferError(TransferErrorType.MISMATCHED_RECORD_TYPE);

        const result = await pool.query<TextRow>("Select text from texts where code = $1", [receivingCode]);
        return result.rows[0].text
    }


}

export default TextTransferController;