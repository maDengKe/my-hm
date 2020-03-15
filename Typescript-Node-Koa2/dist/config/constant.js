"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.APP_PATCH = process.cwd();
exports.PORT = 3000;
exports.TOKEN_SECRET = "GGGLHF";
exports.PUBLIC_PATCH = path_1.default.join(exports.APP_PATCH, "./public");
//# sourceMappingURL=constant.js.map