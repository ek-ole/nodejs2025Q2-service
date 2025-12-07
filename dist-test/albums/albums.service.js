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
exports.AlbumsService = void 0;
const common_1 = require("@nestjs/common");
const album_entity_1 = require("./entities/album.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const track_entity_1 = require("../tracks/entities/track.entity");
let AlbumsService = class AlbumsService {
    constructor(albumsRepository, tracksRepository) {
        this.albumsRepository = albumsRepository;
        this.tracksRepository = tracksRepository;
    }
    async create(createAlbumDto) {
        const album = this.albumsRepository.create(createAlbumDto);
        return await this.albumsRepository.save(album);
    }
    async findAll() {
        return await this.albumsRepository.find();
    }
    async findOne(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Album id is not valid uuid');
        }
        const album = await this.albumsRepository.findOne({ where: { id } });
        if (!album) {
            throw new common_1.NotFoundException('Album not found');
        }
        return album;
    }
    async update(id, updateAlbumDto) {
        const album = await this.findOne(id);
        Object.assign(album, updateAlbumDto);
        return await this.albumsRepository.save(album);
    }
    async remove(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Album id is not valid uuid');
        }
        await this.tracksRepository.update({ albumId: id }, { albumId: null });
        const result = await this.albumsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Album not found');
        }
    }
    async removeArtistReferences(artistId) {
        await this.albumsRepository.update({ artistId }, { artistId: null });
    }
};
exports.AlbumsService = AlbumsService;
exports.AlbumsService = AlbumsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(album_entity_1.Album)),
    __param(1, (0, typeorm_1.InjectRepository)(track_entity_1.Track)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AlbumsService);
