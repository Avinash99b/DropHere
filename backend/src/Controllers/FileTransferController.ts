import pool from "../config/DBConfig";
import TransferController from "./TransferController";
import {TransferError, TransferErrorType} from "../Errors/TransferError";
import {logger} from "../Utils/Logger";
import {TransferType} from "../Types/Transfer";
import {FileRow} from "../Types/File";

class FileTransferController {

    static {
        logger.info("FileTransferController initialized");

    }
    /**
     * Creates a file transfer record in the database.
     * @param senderPeerId The ID of the peer sending the file.
     * @returns A promise that resolves to the receiving code of the transfer record.
     * @throws TransferError if the transfer record creation fails.
     */
    public static createFileTransfer(senderPeerId:string):Promise<number> {
        return new Promise(async (resolve, reject) => {
            const conn = await pool.connect();
            await conn.query("BEGIN")
            try{
                const code = await TransferController.createTransferRecord(TransferType.FILE, conn)
                await conn.query("Insert into files(code, sender_peer_id) values ($1,$2)",[code,senderPeerId])
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
     * Retrieves the sender peer ID for a file transfer using the receiving code.
     * @param receivingCode The code used to identify the transfer.
     * @returns A promise that resolves to the sender peer ID.
     * @throws TransferError if the transfer record is not found or if the type does not match FILE.
     */
    public static async getSenderPeerId(receivingCode:string):Promise<string> {
        const transferRow = await TransferController.getTransferRecord(receivingCode)

        if(transferRow==null) throw new TransferError(TransferErrorType.TRANSFER_RECORD_NOT_FOUND)

        if(transferRow.type!=TransferType.FILE) throw new TransferError(TransferErrorType.MISMATCHED_RECORD_TYPE)

        const result = await pool.query<FileRow>("Select sender_peer_id from files where code = $1",[receivingCode])

        return result.rows[0].sender_peer_id;
    }
}

export default FileTransferController;