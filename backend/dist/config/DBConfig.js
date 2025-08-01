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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const pg_1 = require("pg");
require("dotenv/config");
const Logger_1 = require("../Utils/Logger");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    min: 4,
    max: 10,
    keepAlive: true,
});
pool.on("connect", (client) => {
    Logger_1.logger.info("Database Connected");
});
pool.on("error", (err) => {
    Logger_1.logger.error("DB connection error:", err);
    console.error(err);
});
function initDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield pool.query("Select 1");
        }
        catch (err) {
            throw err;
        }
    });
}
exports.initDB = initDB;
exports.default = pool;
