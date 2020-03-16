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
const request_1 = require("../../../middleware/request");
const authorize_1 = __importDefault(require("../../../middleware/authorize"));
const exception_1 = __importDefault(require("../../../utils/exception"));
const user_1 = __importDefault(require("../entity/user"));
const comment_1 = __importDefault(require("../../post/entity/comment"));
class UserController {
    // can use this.userDB instead of getRepository(User) without static property
    // https://auth0.com/blog/building-and-securing-a-koa-and-angular2-app-with-jwt/
    //  private userDB;
    static findUser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const id = +ctx.params.id;
            if (id !== ctx.state.user.id) {
                ctx.body = new exception_1.default(401, "用户信息验证失败!").toObject();
                return;
            }
            try {
                const user = yield userRepository.findOne({ id }, {
                    relations: ['post_comments', 'post_star', 'role']
                });
                const { post_comments, post_star } = user, props = __rest(user, ["post_comments", "post_star"]);
                const data = Object.assign(Object.assign({}, props), { post_comments: post_comments.length, post_star: post_star.length });
                ctx.body = {
                    statusCode: 200,
                    message: "获取成功",
                    data
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(401, "获取用户信息失败").toObject();
            }
        });
    }
    static userFollows(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const user = ctx.state.user;
            const id = +ctx.params.id;
            try {
                const self = yield userRepository.findOne({ id: user.id }, { relations: ['follows'] });
                const follow = yield userRepository.findOne({ id });
                if (!user) {
                    return ctx.body = new exception_1.default(401, "关注失败，用户不存在").toObject();
                }
                const isExist = self.follows.some((v) => {
                    return v.id === id;
                });
                if (isExist) {
                    return ctx.body = {
                        statusCode: 200,
                        message: "已关注"
                    };
                }
                const userToSaved = Object.assign(Object.assign({}, user), { follows: [...self.follows, follow] });
                yield userRepository.save(userToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: "关注成功"
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(401, "关注失败").toObject();
            }
        });
    }
    static userUnfollow(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const user = ctx.state.user;
            const id = +ctx.params.id;
            try {
                const self = yield userRepository.findOne({ id: user.id }, { relations: ['follows'] });
                const follow = yield userRepository.findOne({ id });
                if (!user) {
                    return ctx.body = new exception_1.default(401, "关注失败，用户不存在").toObject();
                }
                const restFollows = self.follows.filter((v) => {
                    return v.id !== id;
                });
                if (restFollows.length === self.follows.length) {
                    return ctx.body = {
                        statusCode: 200,
                        message: "未关注该用户"
                    };
                }
                const userToSaved = Object.assign(Object.assign({}, user), { follows: restFollows });
                yield userRepository.save(userToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: "取消关注成功"
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(401, "取消关注失败").toObject();
            }
        });
    }
    static findUserFollows(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const { id } = ctx.state.user;
            try {
                const user = yield userRepository.findOne({ id }, { relations: ['follows'] });
                const data = user.follows;
                ctx.body = {
                    statusCode: 200,
                    data
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(401, "查询错误").toObject();
            }
        });
    }
    static findUserComments(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmtRepository = typeorm_1.getRepository(comment_1.default);
            const { id } = ctx.state.user;
            let { pageIndex, pageSize } = ctx.request.query;
            pageIndex = pageIndex || 1;
            pageSize = pageSize || 10;
            const start = (pageIndex - 1) * pageSize;
            // const limit = pageIndex * pageSize;
            try {
                const data = yield cmtRepository.find({
                    relations: ['post', 'parent', 'parent.user'],
                    where: { user: id },
                    skip: start,
                    take: pageSize
                });
                ctx.body = {
                    statusCode: 200,
                    message: "",
                    data
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(401, "查询错误").toObject();
            }
        });
    }
    static findUserStars(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const { id } = ctx.state.user;
            try {
                const user = yield userRepository.findOne({ id }, {
                    relations: ['post_star', 'post_star.cover', 'post_star.user', 'post_star.comments']
                });
                const { post_star } = user;
                ctx.body = {
                    statusCode: 200,
                    message: "",
                    data: post_star
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(401, "获取用户信息失败").toObject();
            }
        });
    }
    static updateUser(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(user_1.default);
            const id = +ctx.params.id;
            if (id !== ctx.state.user.id) {
                ctx.body = new exception_1.default(401, "用户信息验证失败!").toObject();
                return;
            }
            try {
                const userUpdate = ctx.request.body;
                const userBefore = yield userRepository.findOne({ id });
                const userAfter = yield userRepository.save(Object.assign({ id }, userUpdate));
                const _a = Object.assign(Object.assign({}, userBefore), userAfter), { password } = _a, user = __rest(_a, ["password"]);
                ctx.body = {
                    statusCode: 200,
                    message: "修改成功",
                    data: user
                };
            }
            catch (err) {
                ctx.body = new exception_1.default(401, "修改失败，请检查参数名称!").toObject();
            }
        });
    }
}
__decorate([
    authorize_1.default(),
    request_1.Get("/user/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "findUser", null);
__decorate([
    authorize_1.default(),
    request_1.Get("/user_follows/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "userFollows", null);
__decorate([
    authorize_1.default(),
    request_1.Get("/user_unfollow/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "userUnfollow", null);
__decorate([
    authorize_1.default(),
    request_1.Get("/user_follows"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "findUserFollows", null);
__decorate([
    authorize_1.default(),
    request_1.Get("/user_comments"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "findUserComments", null);
__decorate([
    authorize_1.default(),
    request_1.Get("/user_star"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "findUserStars", null);
__decorate([
    authorize_1.default(),
    request_1.Post("/user_update/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController, "updateUser", null);
exports.default = UserController;
//# sourceMappingURL=user.js.map