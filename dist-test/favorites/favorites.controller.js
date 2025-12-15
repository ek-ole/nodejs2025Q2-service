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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const favorites_service_1 = require("./favorites.service");
let FavoritesController = class FavoritesController {
    constructor(favoritesService) {
        this.favoritesService = favoritesService;
    }
    findAll() {
        return this.favoritesService.findAll();
    }
    addTrack(id) {
        return this.favoritesService.addTrack(id);
    }
    removeTrack(id) {
        return this.favoritesService.removeTrack(id);
    }
    addAlbum(id) {
        return this.favoritesService.addAlbum(id);
    }
    removeAlbum(id) {
        return this.favoritesService.removeAlbum(id);
    }
    addArtist(id) {
        return this.favoritesService.addArtist(id);
    }
    removeArtist(id) {
        return this.favoritesService.removeArtist(id);
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('track/:id'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "addTrack", null);
__decorate([
    (0, common_1.Delete)('track/:id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "removeTrack", null);
__decorate([
    (0, common_1.Post)('album/:id'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "addAlbum", null);
__decorate([
    (0, common_1.Delete)('album/:id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "removeAlbum", null);
__decorate([
    (0, common_1.Post)('artist/:id'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "addArtist", null);
__decorate([
    (0, common_1.Delete)('artist/:id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "removeArtist", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, common_1.Controller)('favs'),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], FavoritesController);
