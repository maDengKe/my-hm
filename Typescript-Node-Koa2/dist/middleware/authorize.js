"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const exception_1 = __importDefault(require("../utils/exception"));
const constant_1 = require("../config/constant");
const authorize = (params = {}) => {
    const { required, isAdmin } = params;
    return (context, key, desc) => {
        context[key].authorize = (ctx, next) => {
            try {
                const token = ctx.request.headers['authorization'];
                if (required === false) {
                    if (token) {
                        ctx.state.user = jsonwebtoken_1.verify(token.replace('Bearer ', ''), constant_1.TOKEN_SECRET);
                    }
                    return next();
                }
                // default
                if (required !== false) {
                    if (token) {
                        ctx.state.user = jsonwebtoken_1.verify(token.replace('Bearer ', ''), constant_1.TOKEN_SECRET);
                        // 是否是管理员
                        if (isAdmin === true && ctx.state.user.role.type !== 'admin') {
                            return ctx.body = new exception_1.default(401, "用户不是管理员").toObject();
                        }
                        return next();
                    }
                }
                return ctx.body = new exception_1.default(401, "用户信息验证失败").toObject();
            }
            catch (err) {
                console.log(err);
                return ctx.body = new exception_1.default(401, "用户信息验证失败").toObject();
            }
        };
    };
};
exports.default = authorize;
//# sourceMappingURL=authorize.js.map