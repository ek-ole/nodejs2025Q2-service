import { PartialType } from '@nestjs/swagger';
import { CreateTrackDto } from './create-track.dto';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string | null;

  @IsString()
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  duration: number;
}
