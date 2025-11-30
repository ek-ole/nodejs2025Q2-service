import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TracksService {
  private tracks: Track[] = [];
  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track();
    newTrack.id = uuidv4();
    newTrack.name = createTrackDto.name;
    newTrack.artistId = createTrackDto.artistId || null;
    newTrack.albumId = createTrackDto.albumId || null;
    newTrack.duration = createTrackDto.duration;

    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.findOne(id);

    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId || null;
    track.albumId = updateTrackDto.albumId || null;
    track.duration = updateTrackDto.duration;

    return track;
  }

  remove(id: string) {
    if (id.length !== 36) {
      throw new BadRequestException('Track id is not a valid uuid');
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(trackIndex, 1);
  }
}
