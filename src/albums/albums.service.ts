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

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.albumsRepository.create(createAlbumDto);
    return await this.albumsRepository.save(album);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumsRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    if (id.length !== 36) {
      throw new BadRequestException('Album id is not valid uuid');
    }
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);

    Object.assign(album, updateAlbumDto);

    return await this.albumsRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Album id is not valid uuid');
    }

    await this.tracksRepository.update({ albumId: id }, { albumId: null });

    const result = await this.albumsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Album not found');
    }
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    await this.albumsRepository.update({ artistId }, { artistId: null });
  }
}
