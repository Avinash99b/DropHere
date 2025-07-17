import pool from "../config/DBConfig";
import {TransferRow} from "../Types/Transfer";

class TextTransferController {
    static MAX_CODE_GEN_RETRIES = 5;

    public static async storeText(text: string): Promise<number> {

        let code = this.generateRandomSixDigitNumber()

        for (let i = 0; i < this.MAX_CODE_GEN_RETRIES; i++) {
            if (await this.textCodeExists(text)) {
                code = this.generateRandomSixDigitNumber()
            } else {
                break;
            }
            if (i == this.MAX_CODE_GEN_RETRIES - 1) throw new Error("Code Generation Failed for tries: " + this.MAX_CODE_GEN_RETRIES);
        }

        await pool.query("Insert into transfers(code,type) values (?,?)", [code, 'text'])

        return code
    }

    public static async fetchText(receivingCode: string): Promise<string> {
        if(!await this.textCodeExists(receivingCode)) {
            throw new Error("Receiving Code Not Found")
        }

        const result = await pool.query("Select text from texts where code = ?", [receivingCode]);
        return result.rows[0].text
    }

    public static async textCodeExists(receivingCode: string): Promise<boolean> {
        const result = await pool.query("Select count(*) from transfers where code = ?", [receivingCode]);
        return result.rowCount != 0;
    }

    public static generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }

}