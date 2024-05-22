import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: ConnectionOptions = {
   type: 'mysql',
   host: 'localhost',
   port: parseInt(process.env.MYSQL_PORT, 10),
   username: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database: process.env.MYSQL_DATABASE,
   entities: ['src/domain/model/*.ts'],
   migrations: ['src/migration/**/*.ts'],
   synchronize: true,
   logging: true,
};

export default config;