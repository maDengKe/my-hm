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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const authorize_1 = __importDefault(require("../../../middleware/authorize"));
const request_1 = require("../../../middleware/request");
const exception_1 = __importDefault(require("../../../utils/exception"));
const category_1 = __importDefault(require("../entity/category"));
class CategoryController {
    static findCategories(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const cateRepository = typeorm_1.getRepository(category_1.default);
            const data = yield cateRepository.find();
            const user = ctx.state.user;
            data.unshift({
                id: 999,
                name: "头条",
                is_top: 1
            });
            if (user) {
                data.unshift({
                    id: 0,
                    name: "关注",
                    is_top: 1
                });
            }
            ctx.body = {
                statusCode: 200,
                data
            };
        });
    }
    static createCategory(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            //  const postRepository = getRepository(PostEntity);
            const cateRepository = typeorm_1.getRepository(category_1.default);
            const params = ctx.request.body;
            try {
                const cateToSaved = Object.assign({}, params);
                yield cateRepository.save(cateToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: "栏目添加成功"
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, "栏目添加失败，请检查参数").toObject();
            }
        });
    }
}
__decorate([
    authorize_1.default({ required: false }),
    request_1.Get("/category"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController, "findCategories", null);
__decorate([
    authorize_1.default(),
    request_1.Post("/category"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController, "createCategory", null);
exports.default = CategoryController;
//# sourceMappingURL=category.js.map