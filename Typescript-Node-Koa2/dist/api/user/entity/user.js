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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const comment_1 = __importDefault(require("../../post/entity/comment"));
const post_1 = __importDefault(require("../../post/entity/post"));
const role_1 = __importDefault(require("./role"));
let User = User_1 = class User {
    constructor() {
        this.head_img = "/uploads/image/IMG1568705287936.jpeg";
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true, length: 11 }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ length: 18 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ length: 10 }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], User.prototype, "head_img", void 0);
__decorate([
    typeorm_1.Column({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], User.prototype, "gender", void 0);
__decorate([
    typeorm_1.ManyToOne(type => role_1.default, role => role.users),
    __metadata("design:type", role_1.default)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.ManyToMany(type => User_1),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "follows", void 0);
__decorate([
    typeorm_1.OneToMany(type => comment_1.default, comment => comment.user),
    __metadata("design:type", Array)
], User.prototype, "post_comments", void 0);
__decorate([
    typeorm_1.OneToMany(type => post_1.default, post => post.user),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    typeorm_1.OneToMany(type => post_1.default, post => post.like_users),
    __metadata("design:type", Array)
], User.prototype, "like_posts", void 0);
__decorate([
    typeorm_1.ManyToMany(type => post_1.default),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "post_star", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "create_date", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [])
], User);
exports.default = User;
//# sourceMappingURL=user.js.map