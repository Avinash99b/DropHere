"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBConfig_1 = __importDefault(require("../config/DBConfig"));
class TransferController {
    static createTransferRecord(type, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            let code = this.generateRandomSixDigitNumber();
            for (let i = 0; i < this.MAX_CODE_GEN_RETRIES; i++) {
                if (yield this.transferCodeExists(code)) {
                    code = this.generateRandomSixDigitNumber();
                }
                else {
                    break;
                }
                if (i == this.MAX_CODE_GEN_RETRIES - 1)
                    throw new Error("Code Generation Failed for tries: " + this.MAX_CODE_GEN_RETRIES);
            }
            yield conn.query("Insert into transfers(code,type) values (?,?)", [code, type]);
            return code;
        });
    }
    static transferCodeExists(receivingCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield DBConfig_1.default.query("Select count(*) from transfers where code = ?", [receivingCode]);
            return result.rowCount != 0;
        });
    }
    static getTransferRecord(receivingCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield DBConfig_1.default.query("Select * from transfers where code = ?", [receivingCode]);
            return result.rows[0];
        });
    }
    static generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}
TransferController.MAX_CODE_GEN_RETRIES = 5;
exports.default = TransferController;
