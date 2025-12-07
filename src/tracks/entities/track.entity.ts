import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @Column({ type: 'int' })
  duration: number;

  @ManyToOne(() => Artist, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;

  @ManyToOne(() => Album, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'albumId' })
  album: Album | null;
}
