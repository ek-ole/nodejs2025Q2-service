import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.tracksRepository.create(createTrackDto);
    return await this.tracksRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return await this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const track = await this.tracksRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);

    Object.assign(track, updateTrackDto);

    return await this.tracksRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const result = await this.tracksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Track not found');
    }
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    await this.tracksRepository.update({ artistId }, { artistId: null });
  }

  async removeAlbumReferences(albumId: string): Promise<void> {
    await this.tracksRepository.update({ albumId }, { albumId: null });
  }
}
