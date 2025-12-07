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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favorite = void 0;
const album_entity_1 = require("../../albums/entities/album.entity");
const artist_entity_1 = require("../../artists/entities/artist.entity");
const track_entity_1 = require("../../tracks/entities/track.entity");
const typeorm_1 = require("typeorm");
let Favorite = class Favorite {
};
exports.Favorite = Favorite;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Favorite.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => artist_entity_1.Artist),
    (0, typeorm_1.JoinTable)({
        name: 'favorite_artists',
        joinColumn: { name: 'favoriteId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'artistId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Favorite.prototype, "artists", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => album_entity_1.Album),
    (0, typeorm_1.JoinTable)({
        name: 'favorite_albums',
        joinColumn: { name: 'favoriteId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'albumId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Favorite.prototype, "albums", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => track_entity_1.Track),
    (0, typeorm_1.JoinTable)({
        name: 'favorite_tracks',
        joinColumn: { name: 'favoriteId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'trackId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Favorite.prototype, "tracks", void 0);
exports.Favorite = Favorite = __decorate([
    (0, typeorm_1.Entity)('favorites')
], Favorite);
