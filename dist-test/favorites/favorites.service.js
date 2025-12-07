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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const favorite_entity_1 = require("./entities/favorite.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const artist_entity_1 = require("../artists/entities/artist.entity");
const album_entity_1 = require("../albums/entities/album.entity");
const track_entity_1 = require("../tracks/entities/track.entity");
let FavoritesService = class FavoritesService {
    constructor(favoritesRepository, artistsRepository, albumsRepository, tracksRepository) {
        this.favoritesRepository = favoritesRepository;
        this.artistsRepository = artistsRepository;
        this.albumsRepository = albumsRepository;
        this.tracksRepository = tracksRepository;
    }
    async getOrCreateFavorites() {
        let favorites = await this.favoritesRepository.findOne({
            relations: ['artists', 'albums', 'tracks'],
        });
        if (!favorites) {
            favorites = this.favoritesRepository.create({
                artists: [],
                albums: [],
                tracks: [],
            });
            favorites = await this.favoritesRepository.save(favorites);
        }
        return favorites;
    }
    async findAll() {
        return await this.getOrCreateFavorites();
    }
    async addTrack(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Track id is not a valid uuid');
        }
        const track = await this.tracksRepository.findOne({ where: { id } });
        if (!track) {
            throw new common_1.UnprocessableEntityException('Track not found');
        }
        const favorites = await this.getOrCreateFavorites();
        if (!favorites.tracks.some((t) => t.id === id)) {
            favorites.tracks.push(track);
            await this.favoritesRepository.save(favorites);
        }
    }
    async removeTrack(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Track id is not a valid uuid');
        }
        const favorites = await this.getOrCreateFavorites();
        const initialLength = favorites.tracks.length;
        favorites.tracks = favorites.tracks.filter((track) => track.id !== id);
        if (favorites.tracks.length === initialLength) {
            throw new common_1.NotFoundException('Track is not in favorites');
        }
        await this.favoritesRepository.save(favorites);
    }
    async addAlbum(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Album id is not a valid uuid');
        }
        const album = await this.albumsRepository.findOne({ where: { id } });
        if (!album) {
            throw new common_1.UnprocessableEntityException('Album not found');
        }
        const favorites = await this.getOrCreateFavorites();
        if (!favorites.albums.some((a) => a.id === id)) {
            favorites.albums.push(album);
            await this.favoritesRepository.save(favorites);
        }
    }
    async removeAlbum(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Album id is not a valid uuid');
        }
        const favorites = await this.getOrCreateFavorites();
        const initialLength = favorites.albums.length;
        favorites.albums = favorites.albums.filter((album) => album.id !== id);
        if (favorites.albums.length === initialLength) {
            throw new common_1.NotFoundException('Album is not in favorites');
        }
        await this.favoritesRepository.save(favorites);
    }
    async addArtist(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Artist id is not a valid uuid');
        }
        const artist = await this.artistsRepository.findOne({ where: { id } });
        if (!artist) {
            throw new common_1.UnprocessableEntityException('Artist not found');
        }
        const favorites = await this.getOrCreateFavorites();
        if (!favorites.artists.some((a) => a.id === id)) {
            favorites.artists.push(artist);
            await this.favoritesRepository.save(favorites);
        }
    }
    async removeArtist(id) {
        if (id.length !== 36) {
            throw new common_1.BadRequestException('Artist id is not a valid uuid');
        }
        const favorites = await this.getOrCreateFavorites();
        const initialLength = favorites.artists.length;
        favorites.artists = favorites.artists.filter((artist) => artist.id !== id);
        if (favorites.artists.length === initialLength) {
            throw new common_1.NotFoundException('Artist is not in favorites');
        }
        await this.favoritesRepository.save(favorites);
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(favorite_entity_1.Favorite)),
    __param(1, (0, typeorm_2.InjectRepository)(artist_entity_1.Artist)),
    __param(2, (0, typeorm_2.InjectRepository)(album_entity_1.Album)),
    __param(3, (0, typeorm_2.InjectRepository)(track_entity_1.Track)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], FavoritesService);
