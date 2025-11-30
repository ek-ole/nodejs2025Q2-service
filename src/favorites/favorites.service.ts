import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './entities/favorite.entity';
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

  findAll(): FavoritesResponse {
    return {
      artists: this.favorites.artists
        .map((id) => {
          try {
            return this.artistsService.findOne(id);
          } catch (error) {
            if (error instanceof NotFoundException) {
              return null;
            }
            throw error;
          }
        })
        .filter((artist) => artist !== null),
      albums: this.favorites.albums
        .map((id) => {
          try {
            return this.albumsService.findOne(id);
          } catch (error) {
            if (error instanceof NotFoundException) {
              return null;
            }
            throw error;
          }
        })
        .filter((album) => album !== null),
      tracks: this.favorites.tracks
        .map((id) => {
          try {
            return this.tracksService.findOne(id);
          } catch (error) {
            if (error instanceof NotFoundException) {
              return null;
            }
            throw error;
          }
        })
        .filter((track) => track !== null),
    };
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
    if (id.length !== 36) {
      throw new BadRequestException('Album id is not a valid uuid');
    }

    try {
      this.albumsService.findOne(id);

      if (!this.favorites.albums.includes(id)) {
        this.favorites.albums.push(id);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Album not found');
      }
      throw error;
    }
  }

  removeAlbum(id: string) {
    if (id.length !== 36) {
      throw new BadRequestException('Album id is not a valid uuid');
    }

    const albumIndex = this.favorites.albums.indexOf(id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album is not in favorites');
    }

    this.favorites.albums.splice(albumIndex, 1);
  }

  addArtist(id: string) {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    try {
      this.artistsService.findOne(id);

      if (!this.favorites.artists.includes(id)) {
        this.favorites.artists.push(id);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Artist not found');
      }
      throw error;
    }
  }

  removeArtist(id: string) {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    const artistIndex = this.favorites.artists.indexOf(id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }

    this.favorites.artists.splice(artistIndex, 1);
  }

  getDebugInfo() {
    return {
      storedArtistIds: this.favorites.artists,
      existingArtists: this.artistsService.findAll().map((a) => a.id),
    };
  }
}
