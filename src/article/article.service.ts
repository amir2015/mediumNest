import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    const article = new Article();
    Object.assign(article, createArticleDto);
    article.author = user;
    article.slug = this.generateSlug(article.title);
    if (!article.tagList) {
      article.tagList = [];
    }
    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: Article): ArticleResponse {
    return { article };
  }

  private generateSlug(title: string) {
    const uniqueId = Math.random().toString(36).substring(2);

    return slugify(title, { lower: true }) + '-' + uniqueId;
  }
  async getArticleBySlug(slug: string) {
    return await this.articleRepository.findOne({ where: { slug } });
  }
}
