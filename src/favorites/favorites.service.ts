import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';
import { LoggingService } from 'src/commom/logger/logging.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private readonly loggingService: LoggingService,
  ) {}

  private async getOrCreateFavorites(): Promise<Favorite> {
    let favorites = await this.favoritesRepository.findOne({
      where: {},
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

  async findAll(): Promise<Favorite> {
    this.loggingService.debug('Getting all favorites', 'FavoritesService');
    return await this.getOrCreateFavorites();
  }

  async addTrack(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for track id: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) {
      this.loggingService.error(
        `Track not found for favorites: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new UnprocessableEntityException('Track not found');
    }

    this.loggingService.info(
      `Adding track to favorites: ${id} (${track.name})`,
      'FavoritesService',
    );

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.tracks.some((t) => t.id === id)) {
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
      this.loggingService.info(
        `Track added to favorites: ${id}`,
        'FavoritesService',
      );
    } else {
      this.loggingService.debug(
        `Track already in favorites: ${id}`,
        'FavoritesService',
      );
    }
  }

  async removeTrack(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for track id: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new BadRequestException('Track id is not a valid uuid');
    }

    this.loggingService.info(
      `Removing track from favorites: ${id}`,
      'FavoritesService',
    );

    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.tracks.length;

    favorites.tracks = favorites.tracks.filter((track) => track.id !== id);

    if (favorites.tracks.length === initialLength) {
      this.loggingService.error(
        `Track not in favorites: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new NotFoundException('Track is not in favorites');
    }

    await this.favoritesRepository.save(favorites);
    this.loggingService.info(
      `Track removed from favorites: ${id}`,
      'FavoritesService',
    );
  }

  async addAlbum(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for album id: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new BadRequestException('Album id is not a valid uuid');
    }

    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) {
      this.loggingService.error(
        `Album not found for favorites: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new UnprocessableEntityException('Album not found');
    }

    this.loggingService.info(
      `Adding album to favorites: ${id} (${album.name})`,
      'FavoritesService',
    );

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.albums.some((a) => a.id === id)) {
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
      this.loggingService.info(
        `Album added to favorites: ${id}`,
        'FavoritesService',
      );
    } else {
      this.loggingService.debug(
        `Album already in favorites: ${id}`,
        'FavoritesService',
      );
    }
  }

  async removeAlbum(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for album id: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new BadRequestException('Album id is not a valid uuid');
    }

    this.loggingService.info(
      `Removing album from favorites: ${id}`,
      'FavoritesService',
    );

    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.albums.length;

    favorites.albums = favorites.albums.filter((album) => album.id !== id);

    if (favorites.albums.length === initialLength) {
      this.loggingService.error(
        `Album not in favorites: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new NotFoundException('Album is not in favorites');
    }

    await this.favoritesRepository.save(favorites);
    this.loggingService.info(
      `Album removed from favorites: ${id}`,
      'FavoritesService',
    );
  }

  async addArtist(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for artist id: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      this.loggingService.error(
        `Artist not found for favorites: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new UnprocessableEntityException('Artist not found');
    }

    this.loggingService.info(
      `Adding artist to favorites: ${id} (${artist.name})`,
      'FavoritesService',
    );

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.artists.some((a) => a.id === id)) {
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
      this.loggingService.info(
        `Artist added to favorites: ${id}`,
        'FavoritesService',
      );
    } else {
      this.loggingService.debug(
        `Artist already in favorites: ${id}`,
        'FavoritesService',
      );
    }
  }

  async removeArtist(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for artist id: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    this.loggingService.info(
      `Removing artist from favorites: ${id}`,
      'FavoritesService',
    );

    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.artists.length;

    favorites.artists = favorites.artists.filter((artist) => artist.id !== id);

    if (favorites.artists.length === initialLength) {
      this.loggingService.error(
        `Artist not in favorites: ${id}`,
        undefined,
        'FavoritesService',
      );
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.favoritesRepository.save(favorites);
    this.loggingService.info(
      `Artist removed from favorites: ${id}`,
      'FavoritesService',
    );
  }
}
