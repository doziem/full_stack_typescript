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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], UsernamePasswordInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => FieldError, { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    register(options, { emFork }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield argon2_1.default.hash(options.password);
            const user = emFork.create(User_1.User, {
                username: options.username,
                createdAt: '',
                updatedAt: '',
                password: hashedPassword,
            });
            yield emFork.persistAndFlush(user);
            return user;
        });
    }
    login(options, { emFork }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield emFork.findOne(User_1.User, { username: options.username });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: "Username doesn't exist",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, options.password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'Incorrect Credencials',
                        },
                    ],
                };
            }
            return { user };
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map