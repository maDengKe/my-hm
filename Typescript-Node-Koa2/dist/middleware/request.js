"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
exports.router = new koa_router_1.default();
const authMiddleware = (controller) => {
    return (ctx, next) => {
        const authorize = controller.authorize;
        // need to be verify token
        if (authorize && typeof authorize === 'function') {
            return authorize.call(null, ctx, next);
        }
        return next();
    };
};
exports.Get = (path) => {
    return (context, key, desc) => {
        const controller = context[key];
        exports.router.get(path, authMiddleware(controller), controller);
    };
};
exports.Post = (path) => {
    return (context, key, desc) => {
        const controller = context[key];
        exports.router.post(path, authMiddleware(controller), controller);
    };
};
//# sourceMappingURL=request.js.map