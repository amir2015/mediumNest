import { DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity';

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'mediumnest',
  entities: [ User],
  synchronize: true,
  migrations: ['src/migrations/*.ts'],
  logging: true,

};

export default ormConfig;
