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
require("dotenv/config");
const Logger_1 = require("./Utils/Logger");
const DBConfig_1 = require("./config/DBConfig");
const PORT = process.env.PORT || 3000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DBConfig_1.initDB)();
        Logger_1.logger.info("DB connection started");
        startWebServerSetup();
    }
    catch (err) {
        Logger_1.logger.error("DB connection error:", err);
        throw err;
    }
}))();
function startWebServerSetup() {
    const app = require("app");
    app.listen(PORT, () => {
        Logger_1.logger.info(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}`);
    });
}
