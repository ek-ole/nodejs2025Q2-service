"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.typeormConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'library',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
};
