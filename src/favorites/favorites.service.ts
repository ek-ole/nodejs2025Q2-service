import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './entities/favorite.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class FavoritesService {
  constructor(
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {}

  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  findAll(): Favorites {
    return this.favorites;
  }

  addTrack(id: string) {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    try {
      this.tracksService.findOne(id);

      if (!this.favorites.tracks.includes(id)) {
        this.favorites.tracks.push(id);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Track not found');
      }
      throw error;
    }
  }

  removeTrack(id: string) {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const trackIndex = this.favorites.tracks.indexOf(id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track is not in favorites');
    }

    this.favorites.tracks.splice(trackIndex, 1);
  }

  addAlbum(id: string) {
    return `This action returns a #${id} favorite`;
  }

  removeAlbum(id: string) {
    return `This action removes a #${id} favorite`;
  }

  addArtist(id: string) {
    return `This action returns a #${id} favorite`;
  }

  removeArtist(id: string) {
    return `This action removes a #${id} favorite`;
  }
}
