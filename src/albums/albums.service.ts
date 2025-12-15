import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../tracks/entities/track.entity';
import { LoggingService } from 'src/commom/logger/logging.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private readonly loggingService: LoggingService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    this.loggingService.info(
      `Creating album with name: ${createAlbumDto.name}`,
      'AlbumsService',
    );
    const album = this.albumsRepository.create(createAlbumDto);
    return await this.albumsRepository.save(album);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumsRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for album id: ${id}`,
        undefined,
        'AlbumsService',
      );
      throw new BadRequestException('Album id is not valid uuid');
    }
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) {
      this.loggingService.error(
        `Album not found with id: ${id}`,
        undefined,
        'AlbumsService',
      );
      throw new NotFoundException('Album not found');
    }
    this.loggingService.debug(
      `Found album with id: ${id}, name: ${album.name}`,
      'AlbumsService',
    );
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);

    Object.assign(album, updateAlbumDto);

    return await this.albumsRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for album id: ${id}`,
        undefined,
        'AlbumsService',
      );
      throw new BadRequestException('Album id is not valid uuid');
    }

    this.loggingService.info(`Removing album with id: ${id}`, 'AlbumsService');

    await this.tracksRepository.update({ albumId: id }, { albumId: null });

    const result = await this.albumsRepository.delete(id);

    if (result.affected === 0) {
      this.loggingService.error(
        `Album not found for deletion: ${id}`,
        undefined,
        'AlbumsService',
      );
      throw new NotFoundException('Album not found');
    }

    this.loggingService.info(
      `Album removed successfully: ${id}`,
      'AlbumsService',
    );
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    await this.albumsRepository.update({ artistId }, { artistId: null });
  }
}
