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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PostComment_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("../../user/entity/user"));
const post_1 = __importDefault(require("./post"));
let PostComment = PostComment_1 = class PostComment {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PostComment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PostComment.prototype, "content", void 0);
__decorate([
    typeorm_1.ManyToOne(type => PostComment_1),
    __metadata("design:type", PostComment)
], PostComment.prototype, "parent", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.default, user => user.post_comments),
    __metadata("design:type", user_1.default)
], PostComment.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => post_1.default, post => post.comments),
    __metadata("design:type", post_1.default)
], PostComment.prototype, "post", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], PostComment.prototype, "create_date", void 0);
PostComment = PostComment_1 = __decorate([
    typeorm_1.Entity()
], PostComment);
exports.default = PostComment;
//# sourceMappingURL=comment.js.map