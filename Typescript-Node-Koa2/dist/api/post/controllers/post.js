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
const authorize_1 = __importDefault(require("../../../middleware/authorize"));
const request_1 = require("../../../middleware/request");
const exception_1 = __importDefault(require("../../../utils/exception"));
const post_1 = __importDefault(require("../entity/post"));
const comment_1 = __importDefault(require("../entity/comment"));
const user_1 = __importDefault(require("../../user/entity/user"));
const createCommentsParent = function () {
    const cmtRepository = typeorm_1.getRepository(comment_1.default);
    return function _loop(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = item.parent;
            if (p) {
                const parent = yield cmtRepository.findOne({ id: p.id }, { relations: ["parent", "user"] });
                item.parent = parent;
                yield _loop(item.parent);
            }
            return item;
        });
    };
};
class PostController {
    static findPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            let { pageIndex, pageSize, category, keyword } = ctx.request.query;
            const cid = +category;
            pageIndex = pageIndex || 1;
            pageSize = pageSize || 10;
            const start = (pageIndex - 1) * pageSize;
            const limit = pageIndex * pageSize;
            try {
                let data = [];
                let total = 0;
                // 如果cid为0，表示获取关注的文章
                if (cid === 0 && ctx.state.user) {
                    const uid = ctx.state.user.id;
                    const userRepository = typeorm_1.getRepository(user_1.default);
                    const user = yield userRepository.findOne({ id: uid }, { relations: ['follows'] });
                    for (let i = 0, item; item = user.follows[i++];) {
                        const res = yield postRepository
                            .createQueryBuilder('post')
                            .where("post.open = :open", { open: 1 })
                            .innerJoinAndSelect('post.user', 'user', 'user.id = :follow', { follow: item.id })
                            .leftJoinAndSelect('post.categories', 'category')
                            .leftJoinAndSelect('post.comments', 'comment')
                            .leftJoinAndSelect('post.cover', 'upload')
                            .orderBy("post.id", "DESC")
                            .getMany();
                        data = data.concat(res);
                    }
                    total = data.length;
                    data = data.slice(start, limit);
                }
                else {
                    const last_arg = cid && cid !== 999 ? { categoryId: cid } : '';
                    const three_arg = cid && cid !== 999 ? 'category.id = :categoryId' : '';
                    if (!ctx.state.postTotal || cid !== ctx.state.cid) {
                        // 是否有获取count的方法 ， typeorm?
                        const firstData = yield postRepository
                            .createQueryBuilder('post')
                            .where("post.open = :open", { open: 1 })
                            .innerJoinAndSelect('post.categories', 'category', three_arg, last_arg)
                            .leftJoinAndSelect('post.user', 'user')
                            .leftJoinAndSelect('post.comments', 'comment')
                            .leftJoinAndSelect('post.cover', 'upload').getMany();
                        ctx.state.postTotal = firstData.length;
                        ctx.state.cid = cid;
                    }
                    data = yield postRepository
                        .createQueryBuilder('post')
                        .where("post.open = :open", { open: 1 })
                        .innerJoinAndSelect('post.categories', 'category', three_arg, last_arg)
                        .leftJoinAndSelect('post.user', 'user')
                        .leftJoinAndSelect('post.comments', 'comment')
                        .leftJoinAndSelect('post.cover', 'upload')
                        .orderBy("post.id", "DESC")
                        .skip(start)
                        .take(pageSize)
                        .getMany();
                }
                data = data.map((v) => {
                    const { comments } = v, props = __rest(v, ["comments"]);
                    props.comment_length = comments.length;
                    return props;
                });
                ctx.body = {
                    statusCode: 200,
                    data,
                    total: total || ctx.state.postTotal
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, "文章列表获取失败").toObject();
            }
        });
    }
    static findPostByKeyword(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            let { keyword, pageIndex, pageSize } = ctx.request.query;
            pageIndex = pageIndex || 1;
            pageSize = pageSize || 10;
            const start = (pageIndex - 1) * pageSize;
            try {
                // 未分页，可能存在无效的文章
                // const data = await postRepository.find({
                //     title: Like(`%${keyword}%`),
                // });
                // 获取所有，加上关联条件确保都是有效的文章,是否有count方法？
                let totalData = yield postRepository
                    .createQueryBuilder("post")
                    .where("post.title like :keyword", { keyword: '%' + keyword + '%' })
                    .andWhere("post.open = :open", { open: 1 })
                    .leftJoinAndSelect('post.user', 'user')
                    .leftJoinAndSelect('post.comments', 'comment')
                    .leftJoinAndSelect('post.cover', 'upload')
                    .getMany();
                // 分页访问。当然可以优化
                let data = yield postRepository
                    .createQueryBuilder("post")
                    .where("post.title like :keyword", { keyword: '%' + keyword + '%' })
                    .andWhere("post.open = :open", { open: 1 })
                    .leftJoinAndSelect('post.user', 'user')
                    .leftJoinAndSelect('post.comments', 'comment')
                    .leftJoinAndSelect('post.cover', 'upload')
                    .skip(start)
                    .take(pageSize)
                    .getMany();
                data = data.map((v) => {
                    const { comments } = v, props = __rest(v, ["comments"]);
                    props.comment_length = comments.length;
                    return props;
                });
                ctx.body = {
                    statusCode: 200,
                    data,
                    total: totalData.length
                };
            }
            catch (err) {
                ctx.body = new exception_1.default(400, "文章列表获取失败").toObject();
            }
        });
    }
    static findPostRecommend(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            let { keyword } = ctx.request.query;
            try {
                // 未分页
                const data = yield postRepository.find({
                    title: typeorm_1.Like(`%${keyword}%`),
                });
                ctx.body = {
                    statusCode: 200,
                    data
                };
            }
            catch (err) {
                ctx.body = new exception_1.default(400, "文章列表获取失败").toObject();
            }
        });
    }
    static findPostById(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            const userRepository = typeorm_1.getRepository(user_1.default);
            const id = +ctx.params.id;
            try {
                const post = yield postRepository.findOne({ id }, {
                    relations: ["like_users", "user", "comments", "cover", "categories"]
                });
                const { comments, like_users } = post, props = __rest(post, ["comments", "like_users"]);
                const data = Object.assign(Object.assign({}, props), { has_follow: false, has_star: false, has_like: false });
                // 转换成评论条数
                if (Array.isArray(comments)) {
                    data.comment_length = comments.length;
                }
                // 判断当前用户是否关注该作者
                const user = ctx.state.user;
                if (user) {
                    const uid = user.id;
                    if (Array.isArray(like_users)) {
                        data.has_like = like_users.some(v => {
                            return v.id === uid;
                        });
                        data.like_length = like_users.length;
                    }
                    const self = yield userRepository.findOne({ id: uid }, {
                        relations: ["follows", "post_star"]
                    });
                    data.has_star = self.post_star.some(v => {
                        return v.id === id;
                    });
                    data.has_follow = self.follows.some(v => {
                        return v.id === post.user.id;
                    });
                }
                ctx.body = {
                    statusCode: 200,
                    message: !post ? "文章不存在" : "",
                    data
                };
            }
            catch (err) {
                ctx.body = new exception_1.default(400, "文章不存在").toObject();
            }
        });
    }
    static getComment(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            const cmtRepository = typeorm_1.getRepository(comment_1.default);
            const id = +ctx.params.id;
            let { pageIndex, pageSize } = ctx.request.query;
            pageIndex = pageIndex || 1;
            pageSize = pageSize || 10;
            const start = (pageIndex - 1) * pageSize;
            //const limit = pageIndex * pageSize;
            try {
                const post = yield postRepository.findOne({ id });
                const comments = yield cmtRepository.find({
                    relations: ["parent", "user"],
                    where: { post },
                    skip: start,
                    take: pageSize,
                    order: {
                        id: "DESC"
                    }
                });
                const commentsParent = createCommentsParent();
                const data = [];
                for (let i = 0, item; item = comments[i++];) {
                    // 楼层数据
                    const floor = yield commentsParent(item);
                    data.push(floor);
                }
                ctx.body = {
                    statusCode: 200,
                    data
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, "获取评论失败").toObject();
            }
        });
    }
    static postComment(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            const cmtRepository = typeorm_1.getRepository(comment_1.default);
            const id = +ctx.params.id;
            const params = ctx.request.body;
            try {
                const post = yield postRepository.findOne({ id });
                if (!post) {
                    ctx.body = new exception_1.default(400, "评论失败，文章不存在").toObject();
                    return;
                }
                const cmtToSaved = Object.assign(Object.assign({}, params), { post_id: id, post_title: post.title, user: ctx.state.user, post });
                // 回复
                const pid = +params.parent_id;
                if (pid) {
                    const reply = yield cmtRepository.findOne({ id: pid });
                    if (reply) {
                        cmtToSaved.parent = reply;
                    }
                }
                const data = yield cmtRepository.save(cmtToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: "评论发布成功"
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, "评论失败").toObject();
            }
        });
    }
    static postStar(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            const userRepository = typeorm_1.getRepository(user_1.default);
            const user = ctx.state.user;
            const id = +ctx.params.id;
            try {
                const post = yield postRepository.findOne({ id });
                const self = yield userRepository.findOne({ id: user.id }, { relations: ['post_star'] });
                if (!post) {
                    ctx.body = new exception_1.default(400, "收藏失败，文章不存在").toObject();
                    return;
                }
                const restPost = self.post_star.filter(v => {
                    return v.id !== post.id;
                });
                const isStar = restPost.length === self.post_star.length;
                // if(self.post_star.some(v => {
                //     return v.id === id;
                // })){
                //     return ctx.body = {
                //         message: "已收藏"
                //     };
                // }
                const userToSaved = Object.assign(Object.assign({}, self), { post_star: isStar ? [...self.post_star, post] : restPost });
                const data = yield userRepository.save(userToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: isStar ? "收藏成功" : "取消成功",
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, "收藏失败，文章不存在").toObject();
            }
        });
    }
    static postLike(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            const user = ctx.state.user;
            const id = +ctx.params.id;
            try {
                const post = yield postRepository.findOne({ id }, { relations: ['like_users'] });
                if (!post) {
                    ctx.body = new exception_1.default(400, "点赞失败，文章不存在").toObject();
                    return;
                }
                const restUsers = post.like_users.filter(v => {
                    return v.id !== user.id;
                });
                const isLike = restUsers.length === post.like_users.length;
                // if(post.like_users.some(v => {
                //     return v.id === user.id;
                // })){
                //     return ctx.body = {
                //         message: "已经点赞"
                //     };
                // }
                const postToSaved = Object.assign(Object.assign({}, post), { like_users: isLike ? [...post.like_users, user] : restUsers });
                yield postRepository.save(postToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: isLike ? "点赞成功" : "取消成功",
                };
            }
            catch (err) {
                ctx.body = new exception_1.default(400, "点赞失败").toObject();
            }
        });
    }
    static createPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            const params = ctx.request.body;
            const postToSaved = Object.assign(Object.assign({}, params), { user: ctx.state.user, comments: [], like_users: [] });
            try {
                const data = yield postRepository.save(postToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: "文章发布成功",
                    data,
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, "文章发布失败，请检查参数").toObject();
            }
        });
    }
    static updatePost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(post_1.default);
            // const cateRepository = getRepository(Category);
            const params = ctx.request.body;
            const id = +ctx.params.id;
            try {
                const post = yield postRepository.findOne({ id }, { relations: ['like_users'] });
                if (!post) {
                    ctx.body = new exception_1.default(400, "编辑文章失败，文章不存在").toObject();
                    return;
                }
                // categories是栏目id的集合
                //const {categories, ...props} = params;
                // if(categories && Array.isArray(categories)){
                //     props.categories = [];
                //     for(let i = 0, cid; cid = categories[i++];){
                //         const c = await cateRepository.findOne({id: cid});
                //         props.categories.push(c);
                //     }
                // }
                const postToSaved = Object.assign({ id }, params);
                yield postRepository.save(postToSaved);
                ctx.body = {
                    statusCode: 200,
                    message: "文章编辑成功"
                };
            }
            catch (err) {
                console.log(err);
                ctx.body = new exception_1.default(400, "编辑文章失败，请检查参数").toObject();
            }
        });
    }
}
__decorate([
    authorize_1.default({ required: false }),
    request_1.Get('/post'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "findPost", null);
__decorate([
    request_1.Get("/post_search"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "findPostByKeyword", null);
__decorate([
    request_1.Get("/post_search_recommend"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "findPostRecommend", null);
__decorate([
    authorize_1.default({ required: false }),
    request_1.Get('/post/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "findPostById", null);
__decorate([
    request_1.Get("/post_comment/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "getComment", null);
__decorate([
    authorize_1.default(),
    request_1.Post('/post_comment/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "postComment", null);
__decorate([
    authorize_1.default(),
    request_1.Get('/post_star/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "postStar", null);
__decorate([
    authorize_1.default(),
    request_1.Get('/post_like/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "postLike", null);
__decorate([
    authorize_1.default({ isAdmin: true }),
    request_1.Post('/post'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "createPost", null);
__decorate([
    authorize_1.default({ isAdmin: true }),
    request_1.Post("/post_update/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController, "updatePost", null);
exports.default = PostController;
//# sourceMappingURL=post.js.map