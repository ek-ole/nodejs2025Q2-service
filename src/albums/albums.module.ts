import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track])],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
