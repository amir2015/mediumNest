import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'mediumnest',
  entities: [__dirname + '/**/*.entity{ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{ts,.js}'],
});
