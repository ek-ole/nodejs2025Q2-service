import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist = new Artist();
    newArtist.id = uuidv4();
    newArtist.name = createArtistDto.name;
    newArtist.grammy = createArtistDto.grammy;

    this.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.findOne(id);

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  remove(id: string): void {
    if (id.length !== 36) {
      throw new BadRequestException('Artist id is not a valid uuid');
    }

    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }
    this.artists.splice(artistIndex, 1);
  }
}
