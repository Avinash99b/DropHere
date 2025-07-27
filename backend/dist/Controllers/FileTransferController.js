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
const Logger_1 = require("../Utils/Logger");
const Transfer_1 = require("../Types/Transfer");
class FileTransferController {
    static createFileTransfer(senderPeerId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield DBConfig_1.default.connect();
            yield conn.query("BEGIN");
            try {
                const code = TransferController_1.default.createTransferRecord(Transfer_1.TransferType.FILE, conn);
                yield conn.query("Insert into files(code, sender_peer_id) values (?,?)", [code, senderPeerId]);
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
    static getSenderPeerId(receivingCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferRow = yield TransferController_1.default.getTransferRecord(receivingCode);
            if (transferRow == null)
                throw new TransferError_1.TransferError(TransferError_1.TransferErrorType.TRANSFER_RECORD_NOT_FOUND);
            if (transferRow.type != Transfer_1.TransferType.FILE)
                throw new TransferError_1.TransferError(TransferError_1.TransferErrorType.MISMATCHED_RECORD_TYPE);
            const result = yield DBConfig_1.default.query("Select sender_peer_id from files where code = ?", [receivingCode]);
            return result.rows[0].sender_peer_id;
        });
    }
}
