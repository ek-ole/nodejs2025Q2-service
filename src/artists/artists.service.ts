import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistsRepository.create(createArtistDto);
    return await this.artistsRepository.save(artist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);

    Object.assign(artist, updateArtistDto);

    return await this.artistsRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    await this.tracksRepository.update({ artistId: id }, { artistId: null });
    await this.albumsRepository.update({ artistId: id }, { artistId: null });

    const result = await this.artistsRepository.delete(id);
    if ((await result).affected === 0) {
      throw new NotFoundException('Artist not found');
    }
  }
}
