import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';

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
  ) {}

  private async getOrCreateFavorites(): Promise<Favorite> {
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

  async findAll(): Promise<Favorite> {
    return await this.getOrCreateFavorites();
  }

  async addTrack(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.tracks.some((t) => t.id === id)) {
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrack(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.tracks.length;

    favorites.tracks = favorites.tracks.filter((track) => track.id !== id);

    if (favorites.tracks.length === initialLength) {
      throw new NotFoundException('Track is not in favorites');
    }

    await this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Album id is not a valid uuid');
    }

    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    const favorites = await this.getOrCreateFavorites();

    if (!favorites.albums.some((a) => a.id === id)) {
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Album id is not a valid uuid');
    }

    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.albums.length;

    favorites.albums = favorites.albums.filter((album) => album.id !== id);

    if (favorites.albums.length === initialLength) {
      throw new NotFoundException('Album is not in favorites');
    }

    await this.favoritesRepository.save(favorites);
  }

  async addArtist(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    const favorites = await this.getOrCreateFavorites();

    if (!favorites.artists.some((a) => a.id === id)) {
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.artists.length;

    favorites.artists = favorites.artists.filter((artist) => artist.id !== id);

    if (favorites.artists.length === initialLength) {
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.favoritesRepository.save(favorites);
  }
}
