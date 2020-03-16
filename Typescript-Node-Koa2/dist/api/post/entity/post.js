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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("../../user/entity/user"));
const category_1 = __importDefault(require("../../category/entity/category"));
const upload_1 = __importDefault(require("../../upload/entity/upload"));
const comment_1 = __importDefault(require("./comment"));
let Post = class Post {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Post.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Post.prototype, "open", void 0);
__decorate([
    typeorm_1.ManyToMany(type => upload_1.default),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Post.prototype, "cover", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.default, user => user.posts),
    __metadata("design:type", user_1.default)
], Post.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(type => comment_1.default, comment => comment.post),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    typeorm_1.ManyToMany(type => user_1.default, user => user.like_posts),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Post.prototype, "like_users", void 0);
__decorate([
    typeorm_1.ManyToMany(type => category_1.default, category => category.posts),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Post.prototype, "categories", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "create_date", void 0);
Post = __decorate([
    typeorm_1.Entity()
], Post);
exports.default = Post;
//# sourceMappingURL=post.js.map