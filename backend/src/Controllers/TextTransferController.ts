import pool from "../config/DBConfig";
import {TextTransferRow} from "../Types/TextTransfer";

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

        await pool.query("Insert into text_transfer_codes(code,text) values (?,?)", [code, text])

        return code
    }

    public static async fetchText(receivingCode: string): Promise<string> {
        const result = await pool.query<TextTransferRow>("Select * from text_transfer_codes where code = ?", [receivingCode])
        if (result.rows.length > 0) return result.rows[0][0].value
        else throw new Error("Receiving Code Not Found")
    }

    public static async textCodeExists(receivingCode: string): Promise<boolean> {
        const result = await pool.query("Select count(*) from text_transfer_codes where code = ?", [receivingCode]);

        return result.rowCount != 0;

    }

    public static generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }

}