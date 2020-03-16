"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const colors_1 = __importDefault(require("colors"));
const constant_1 = require("./config/constant");
const server = app_1.default.listen(constant_1.PORT || 3000, () => {
    console.log();
    console.log(colors_1.default.cyan(`服务器启动成功`));
    console.log(colors_1.default.cyan(`服务器本地地址：http://127.0.0.1:${constant_1.PORT}`));
    console.log();
});
exports.default = server;
//# sourceMappingURL=server.js.map