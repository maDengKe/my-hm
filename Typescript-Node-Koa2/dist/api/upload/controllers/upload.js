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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const typeorm_1 = require("typeorm");
const upload_1 = __importDefault(require("../entity/upload"));
const request_1 = require("../../../middleware/request");
const authorize_1 = __importDefault(require("../../../middleware/authorize"));
const exception_1 = __importDefault(require("../../../utils/exception"));
const constant_1 = require("../../../config/constant");
class UploadController {
    static uploadFile(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadRepository = typeorm_1.getRepository(upload_1.default);
            try {
                const file = ctx.request.files.file;
                const fileType = file.type.split("\/")[1] || "";
                let filePath = "";
                if (['jpg', 'jpeg', 'jiff', 'png', 'gif'].indexOf(fileType) > -1) {
                    fs_extra_1.default.ensureDirSync(path_1.default.join(constant_1.PUBLIC_PATCH, `/uploads/image`));
                    filePath = `/uploads/image/IMG${Date.now()}.${fileType}`;
                }
                else if (['mp4', 'mp3', 'avi', 'rmvb'].indexOf(fileType) > -1) {
                    fs_extra_1.default.ensureDirSync(path_1.default.join(constant_1.PUBLIC_PATCH, `/uploads/media`));
                    filePath = `/uploads/media/MEDIA${Date.now()}.${fileType}`;
                }
                else {
                    return ctx.body = new exception_1.default(400, '未知的文件格式').toObject();
                }
                const reader = fs_1.default.createReadStream(file.path);
                const stream = fs_1.default.createWriteStream(path_1.default.join(constant_1.PUBLIC_PATCH, filePath));
                reader.pipe(stream);
                const fileToSaved = {
                    url: filePath,
                    uid: ctx.state.user.id
                };
                const data = yield uploadRepository.save(fileToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: "文件上传成功",
                    data
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, '文件上传失败').toObject();
            }
        });
    }
}
__decorate([
    authorize_1.default(),
    request_1.Post('/upload'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController, "uploadFile", null);
exports.default = UploadController;
//# sourceMappingURL=upload.js.map