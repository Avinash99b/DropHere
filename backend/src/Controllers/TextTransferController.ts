import pool from "../config/DBConfig";
import TransferController from "./TransferController";
import {TransferError, TransferErrorType} from "../Errors/TransferError";
import {TransferType} from "../Types/Transfer";
import {logger} from "../Utils/Logger";
import {TextRow} from "../Types/Text";

class TextTransferController {

    public static storeText(text: string): Promise<number> {

        return new Promise(async (resolve, reject) => {
            const conn = await pool.connect();
            await conn.query("BEGIN")
            try{
                const code = TransferController.createTransferRecord(TransferType.TEXT, conn)
                await pool.query("Insert into texts(code,text) values (?,?)", [code, text])
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

    public static async fetchText(receivingCode: string): Promise<string> {
        const transferRecord =await TransferController.getTransferRecord(receivingCode);
        if(transferRecord == null) throw new TransferError(TransferErrorType.TRANSFER_RECORD_NOT_FOUND);

        if(transferRecord.type != TransferType.TEXT) throw new TransferError(TransferErrorType.MISMATCHED_RECORD_TYPE);

        const result = await pool.query<TextRow>("Select text from texts where code = ?", [receivingCode]);
        return result.rows[0].text
    }


}