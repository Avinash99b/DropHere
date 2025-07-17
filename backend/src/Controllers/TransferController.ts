import pool from "../config/DBConfig";
import {TransferRow, TransferType} from "../Types/Transfer";
import {PoolClient} from "pg";

class TransferController{
    static MAX_CODE_GEN_RETRIES = 5;

    public static async createTransferRecord(type:TransferType,conn:PoolClient): Promise<number> {

        let code = this.generateRandomSixDigitNumber()

        for (let i = 0; i < this.MAX_CODE_GEN_RETRIES; i++) {
            if (await this.transferCodeExists(code)) {
                code = this.generateRandomSixDigitNumber()
            } else {
                break;
            }
            if (i == this.MAX_CODE_GEN_RETRIES - 1) throw new Error("Code Generation Failed for tries: " + this.MAX_CODE_GEN_RETRIES);
        }

        await conn.query("Insert into transfers(code,type) values (?,?)", [code, type])

        return code
    }


    public static async transferCodeExists(receivingCode: string|number): Promise<boolean> {
        const result = await pool.query("Select count(*) from transfers where code = ?", [receivingCode]);
        return result.rowCount != 0;
    }

    public static async getTransferRecord(receivingCode: string): Promise<TransferRow> {
        const result = await pool.query<TransferRow>("Select * from transfers where code = ?", [receivingCode]);
        return result.rows[0];
    }

    public static generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}

export default TransferController;