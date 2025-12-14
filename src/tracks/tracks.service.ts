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
import { LoggingService } from 'src/commom/logger/logging.service';
@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private readonly loggingService: LoggingService,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    this.loggingService.info(
      `Creating track with name: ${createTrackDto.name}`,
      'TracksService',
    );
    const track = this.tracksRepository.create(createTrackDto);
    return await this.tracksRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return await this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for track id: ${id}`,
        undefined,
        'TracksService',
      );
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const track = await this.tracksRepository.findOne({ where: { id } });

    if (!track) {
      this.loggingService.error(
        `Track not found with id: ${id}`,
        undefined,
        'TracksService',
      );
      throw new NotFoundException('Track not found');
    }

    this.loggingService.debug(
      `Found track with id: ${id}, name: ${track.name}`,
      'TracksService',
    );
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    this.loggingService.info(`Updating track with id: ${id}`, 'TracksService');

    const track = await this.findOne(id);

    Object.assign(track, updateTrackDto);

    return await this.tracksRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    if (id.length !== 36) {
      this.loggingService.error(
        `Invalid UUID format for track id: ${id}`,
        undefined,
        'TracksService',
      );
      throw new BadRequestException('Track id is not a valid uuid');
    }

    this.loggingService.info(`Removing track with id: ${id}`, 'TracksService');

    const result = await this.tracksRepository.delete(id);

    if (result.affected === 0) {
      this.loggingService.error(
        `Track not found for deletion: ${id}`,
        undefined,
        'TracksService',
      );
      throw new NotFoundException('Track not found');
    }

    this.loggingService.info(
      `Track removed successfully: ${id}`,
      'TracksService',
    );
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    await this.tracksRepository.update({ artistId }, { artistId: null });
  }

  async removeAlbumReferences(albumId: string): Promise<void> {
    await this.tracksRepository.update({ albumId }, { albumId: null });
  }
}
