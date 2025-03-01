import { DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Article } from './article/entities/article.entity';

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'mediumnest',
  entities: [User, Article],
  synchronize: true,
};

export default ormConfig;
