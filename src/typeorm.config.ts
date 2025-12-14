import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Album } from './albums/entities/album.entity';
import { Artist } from './artists/entities/artist.entity';
import { Favorite } from './favorites/entities/favorite.entity';
import { Track } from './tracks/entities/track.entity';
import { User } from './users/entities/user.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';

dotenv.config();

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'library',
  synchronize: process.env.DB_SYNCHRONIZE === 'false',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [User, Artist, Album, Track, Favorite, RefreshToken],
};
