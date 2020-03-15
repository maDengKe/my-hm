"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa2_cors_1 = __importDefault(require("koa2-cors"));
const connection_1 = __importDefault(require("./config/database/connection"));
const request_1 = require("./middleware/request");
const constant_1 = require("./config/constant");
const app = new koa_1.default();
const db = connection_1.default();
Promise.resolve().then(() => __importStar(require("./api/user/controllers/user"))).then(Factor => { new Factor.default(); });
Promise.resolve().then(() => __importStar(require("./api/user/controllers/authorization"))).then(Factor => { new Factor.default(); });
Promise.resolve().then(() => __importStar(require("./api/user/controllers/role"))).then(Factor => { new Factor.default(); });
Promise.resolve().then(() => __importStar(require("./api/upload/controllers/upload"))).then(Factor => { new Factor.default(); });
Promise.resolve().then(() => __importStar(require("./api/post/controllers/post"))).then(Factor => { new Factor.default(); });
Promise.resolve().then(() => __importStar(require("./api/category/controllers/category"))).then(Factor => { new Factor.default(); });
app.use(koa_static_1.default(constant_1.PUBLIC_PATCH));
app.use(koa_body_1.default({ multipart: true }));
app.use(koa2_cors_1.default());
app.use(request_1.router.routes());
exports.default = app;
//# sourceMappingURL=app.js.map