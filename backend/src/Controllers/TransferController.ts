import pool from "../config/DBConfig";
import {TransferRow, TransferType} from "../Types/Transfer";
import {PoolClient} from "pg";
import {logger} from "../Utils/Logger";
import {TransferError, TransferErrorType} from "../Errors/TransferError";

class TransferController {
    static MAX_CODE_GEN_RETRIES = 5;

    static {
        logger.info("TransferController initialized");


        //Keeps fetching transfers of type file every 2 mins and expires them if they are older than 5 mins
        setInterval(async () => {
            try {
                const conn = await pool.connect();
                await conn.query("BEGIN");
                await conn.query("DELETE FROM transfers where expires_at < NOW()");
                await conn.query("COMMIT");
                conn.release();
                logger.info("Expired old file transfers");
            } catch (e: any) {
                logger.error(e, "Failed to expire old file transfers");
            }
        }, 2 * 60 * 1000); // 2 minutes
    }

    /**
     * Creates a transfer record in the database.
     * @param type The type of transfer (e.g., FILE, TEXT).
     * @param conn The database connection to use.
     * @param expires_at The expiration time for the transfer record. Defaults to 6 minutes from now.
     * @returns A promise that resolves to the generated transfer code.
     * @throws Error if code generation fails after maximum retries.
     */
    public static async createTransferRecord(type: TransferType, conn: PoolClient, expires_at: string = new Date(Date.now() + 6 * 60 * 1000).toISOString()): Promise<number> {

        let code = this.generateRandomSixDigitNumber()

        for (let i = 0; i < this.MAX_CODE_GEN_RETRIES; i++) {
            if (await this.transferCodeExists(code)) {
                code = this.generateRandomSixDigitNumber()
            } else {
                break;
            }
            if (i == this.MAX_CODE_GEN_RETRIES - 1) throw new Error("Code Generation Failed for tries: " + this.MAX_CODE_GEN_RETRIES);
        }

        logger.info("Creating transfer record with code:", code, "and type:", type)
        await conn.query("Insert into transfers(code,type,expires_at) values ($1,$2,$3)", [code, type, expires_at])

        return code
    }


    public static async transferCodeExists(receivingCode: string | number): Promise<boolean> {
        const result = await pool.query("Select count(*) from transfers where code = $1", [receivingCode]);
        return parseInt(result.rows[0].count) > 0;
    }

    public static async getTransferRecord(receivingCode: string): Promise<TransferRow> {
        const result = await pool.query<TransferRow>("Select * from transfers where code = $1", [receivingCode]);
        if (result.rows.length === 0) {
            throw new TransferError(TransferErrorType.TRANSFER_RECORD_NOT_FOUND)
        }
        return result.rows[0];
    }

    public static generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}

export default TransferController;