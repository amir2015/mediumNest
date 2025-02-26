import { Article } from '../entities/article.entity';

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}
