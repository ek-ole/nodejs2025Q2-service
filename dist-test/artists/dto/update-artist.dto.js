"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArtistDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_artist_dto_1 = require("./create-artist.dto");
class UpdateArtistDto extends (0, swagger_1.PartialType)(create_artist_dto_1.CreateArtistDto) {
}
exports.UpdateArtistDto = UpdateArtistDto;
