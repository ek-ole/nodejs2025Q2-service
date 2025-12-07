import { Album } from '../../albums/entities/album.entity';
import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../tracks/entities/track.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist)
  @JoinTable({
    name: 'favorite_artists',
    joinColumn: { name: 'favoriteId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artistId', referencedColumnName: 'id' },
  })
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'favorite_albums',
    joinColumn: { name: 'favoriteId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'albumId', referencedColumnName: 'id' },
  })
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'favorite_tracks',
    joinColumn: { name: 'favoriteId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trackId', referencedColumnName: 'id' },
  })
  tracks: Track[];
}
