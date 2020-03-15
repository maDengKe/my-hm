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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
function connectionDatabse() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield typeorm_1.createConnection({
            type: "sqlite",
            database: "./temp/sqlite.db",
            synchronize: true,
            entities: ["dist/api/**/entity/*.js"],
            logging: ["query", "error"],
            logger: "file",
            migrationsTableName: "migration_table",
            migrations: [
                __dirname + "/migrations/*{.js,.ts}"
            ],
            cli: {
                "migrationsDir": "migration"
            }
        });
        //await connection.runMigrations();
        return connection;
    });
}
exports.default = connectionDatabse;
//# sourceMappingURL=connection.js.map