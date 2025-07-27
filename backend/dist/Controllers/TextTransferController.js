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
const TransferController_1 = __importDefault(require("./TransferController"));
const TransferError_1 = require("../Errors/TransferError");
const Transfer_1 = require("../Types/Transfer");
const Logger_1 = require("../Utils/Logger");
class TextTransferController {
    static storeText(text) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield DBConfig_1.default.connect();
            yield conn.query("BEGIN");
            try {
                const code = TransferController_1.default.createTransferRecord(Transfer_1.TransferType.TEXT, conn);
                yield DBConfig_1.default.query("Insert into texts(code,text) values (?,?)", [code, text]);
                yield conn.query("COMMIT");
                resolve(code);
            }
            catch (e) {
                yield conn.query("ROLLBACK");
                reject(new TransferError_1.TransferError(TransferError_1.TransferErrorType.CREATE_TRANSFER_FAILED));
                Logger_1.logger.error(e, "Failed to create transfer");
            }
            finally {
                conn.release();
            }
        }));
    }
    /**
     * Fetches the text associated with the given receiving code.
     * @throws TransferError if the transfer record is not found or if the type does not match TEXT.
     * @param receivingCode
     */
    static fetchText(receivingCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferRecord = yield TransferController_1.default.getTransferRecord(receivingCode);
            if (transferRecord == null)
                throw new TransferError_1.TransferError(TransferError_1.TransferErrorType.TRANSFER_RECORD_NOT_FOUND);
            if (transferRecord.type != Transfer_1.TransferType.TEXT)
                throw new TransferError_1.TransferError(TransferError_1.TransferErrorType.MISMATCHED_RECORD_TYPE);
            const result = yield DBConfig_1.default.query("Select text from texts where code = ?", [receivingCode]);
            return result.rows[0].text;
        });
    }
}
exports.default = TextTransferController;
