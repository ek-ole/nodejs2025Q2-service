import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1741462400000 implements MigrationInterface {
  name = 'InitialSchema1741462400000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создадим таблицы на основе твоих entity
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "version" integer NOT NULL DEFAULT '1',
        "createdAt" bigint NOT NULL,
        "updatedAt" bigint NOT NULL,
        CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      );
      
      CREATE TABLE "artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "grammy" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id")
      );
      
      CREATE TABLE "albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id")
      );
      
      CREATE TABLE "tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "duration" integer NOT NULL,
        CONSTRAINT "PK_242a37ffc7870380f0e41698617" PRIMARY KEY ("id")
      );
      
      CREATE TABLE "favorites" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id")
      );
      
      CREATE TABLE "favorite_artists" (
        "favoriteId" uuid NOT NULL,
        "artistId" uuid NOT NULL,
        CONSTRAINT "PK_0c7d5b5e5e5e5e5e5e5e5e5e5e5e" PRIMARY KEY ("favoriteId", "artistId")
      );
      
      CREATE TABLE "favorite_albums" (
        "favoriteId" uuid NOT NULL,
        "albumId" uuid NOT NULL,
        CONSTRAINT "PK_1c1c1c1c1c1c1c1c1c1c1c1c1c1c" PRIMARY KEY ("favoriteId", "albumId")
      );
      
      CREATE TABLE "favorite_tracks" (
        "favoriteId" uuid NOT NULL,
        "trackId" uuid NOT NULL,
        CONSTRAINT "PK_2d2d2d2d2d2d2d2d2d2d2d2d2d2d" PRIMARY KEY ("favoriteId", "trackId")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "favorite_tracks"`);
    await queryRunner.query(`DROP TABLE "favorite_albums"`);
    await queryRunner.query(`DROP TABLE "favorite_artists"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
