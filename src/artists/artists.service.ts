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
import { LoggingService } from 'src/commom/logger/logging.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private readonly loggingService: LoggingService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    this.loggingService.info(
      `Creating artist with name: ${createArtistDto.name}`,
      'ArtistsService',
    );
    const artist = this.artistsRepository.create(createArtistDto);
    return await this.artistsRepository.save(artist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for artist id: ${id}`,
        undefined,
        'ArtistsService',
      );
      throw new BadRequestException('Artist id is not a valid uuid');
    }
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      this.loggingService.error(
        `Artist not found with id: ${id}`,
        undefined,
        'ArtistsService',
      );
      throw new NotFoundException('Artist not found');
    }
    this.loggingService.debug(
      `Found artist with id: ${id}, name: ${artist.name}`,
      'ArtistsService',
    );
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);

    Object.assign(artist, updateArtistDto);

    return await this.artistsRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for artist id: ${id}`,
        undefined,
        'ArtistsService',
      );
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    this.loggingService.info(
      `Removing artist with id: ${id}`,
      'ArtistsService',
    );

    await this.tracksRepository.update({ artistId: id }, { artistId: null });
    await this.albumsRepository.update({ artistId: id }, { artistId: null });

    const result = await this.artistsRepository.delete(id);
    if (result.affected === 0) {
      this.loggingService.error(
        `Artist not found for deletion: ${id}`,
        undefined,
        'ArtistsService',
      );
      throw new NotFoundException('Artist not found');
    }

    this.loggingService.info(
      `Artist removed successfully: ${id}`,
      'ArtistsService',
    );
  }
}
