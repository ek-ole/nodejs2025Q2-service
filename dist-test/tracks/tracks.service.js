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
exports.TracksService = void 0;
const common_1 = require("@nestjs/common");
const track_entity_1 = require("./entities/track.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TracksService = class TracksService {
    constructor(tracksRepository) {
        this.tracksRepository = tracksRepository;
    }
    async create(createTrackDto) {
        const track = this.tracksRepository.create(createTrackDto);
        return await this.tracksRepository.save(track);
    }
    async findAll() {
        return await this.tracksRepository.find();
    }
    async findOne(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Track id is not a valid uuid');
        }
        const track = await this.tracksRepository.findOne({ where: { id } });
        if (!track) {
            throw new common_1.NotFoundException('Track not found');
        }
        return track;
    }
    async update(id, updateTrackDto) {
        const track = await this.findOne(id);
        Object.assign(track, updateTrackDto);
        return await this.tracksRepository.save(track);
    }
    async remove(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Track id is not a valid uuid');
        }
        const result = await this.tracksRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Track not found');
        }
    }
    async removeArtistReferences(artistId) {
        await this.tracksRepository.update({ artistId }, { artistId: null });
    }
    async removeAlbumReferences(albumId) {
        await this.tracksRepository.update({ albumId }, { albumId: null });
    }
};
exports.TracksService = TracksService;
exports.TracksService = TracksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(track_entity_1.Track)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TracksService);
