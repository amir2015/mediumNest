import { HttpException, Injectable } from '@nestjs/common';
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
  async deleteArticle(slug: string, userId: number) {
    const article = await this.getArticleBySlug(slug);
    if (!article) {
      throw new HttpException('Article not found', 404);
    }
    if (article.author.id !== userId) {
      throw new HttpException('You are not the author', 403);
    }
    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    userId: number,
  ): Promise<Article> {
    const article = await this.getArticleBySlug(slug);

    console.log('article ======>',article.author.id);

    if (!article) {
      throw new HttpException('Article not found', 404);
    }
    if (article.author.id !== userId) {
      throw new HttpException('You are not the author', 403);
    }

    Object.assign(article, updateArticleDto);
    article.slug = this.generateSlug(article.title);

    return this.articleRepository.save(article);

  }
}
