"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const authorize_1 = __importDefault(require("../../../middleware/authorize"));
const request_1 = require("../../../middleware/request");
const exception_1 = __importDefault(require("../../../utils/exception"));
const user_1 = __importDefault(require("../entity/user"));
const role_1 = __importDefault(require("../entity/role"));
const constant_1 = require("../../../config/constant");
class Authorization {
    static login(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const { username, password } = ctx.request.body;
            const user = yield userRepository.findOne({ username }, {
                relations: ['role']
            });
            if (user && user.password === password) {
                const { password } = user, profile = __rest(user, ["password"]);
                ctx.body = {
                    message: "登录成功",
                    statusCode: 200,
                    data: {
                        token: jsonwebtoken_1.sign(Object.assign({}, profile), constant_1.TOKEN_SECRET),
                        user: profile
                    }
                };
            }
            else {
                ctx.body = new exception_1.default(401, "用户名或者密码错误").toObject();
            }
        });
    }
    static register(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const roleRepository = typeorm_1.getRepository(role_1.default);
            const params = ctx.request.body;
            const role = yield roleRepository.findOne({ permissions: 1 });
            // build up entity user to be saved
            const userInstance = new user_1.default();
            const userToSaved = Object.assign(Object.assign(Object.assign({}, userInstance), params), { role });
            const username = userToSaved.username;
            try {
                const isExsit = yield userRepository.findOne({ username });
                if (!isExsit) {
                    const user = yield userRepository.save(userToSaved);
                    delete user.password;
                    ctx.body = {
                        statusCode: 200,
                        message: "注册成功",
                        data: user
                    };
                }
                else {
                    ctx.body = new exception_1.default(401, '用户名已经存在').toObject();
                }
            }
            catch (err) {
                ctx.body = new exception_1.default(401, '注册失败，请检查参数').toObject();
            }
        });
    }
    static getUser(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = '123';
        });
    }
}
__decorate([
    request_1.Post("/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Authorization, "login", null);
__decorate([
    request_1.Post("/register"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Authorization, "register", null);
__decorate([
    authorize_1.default({ isAdmin: true }),
    request_1.Get("/_users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Authorization, "getUser", null);
exports.default = Authorization;
//# sourceMappingURL=authorization.js.map