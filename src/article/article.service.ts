import { HttpException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponse } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
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

    console.log('article ======>', article.author.id);

    if (!article) {
      throw new HttpException('Article not found', 404);
    }
    if (article.author.id !== userId) {
      throw new HttpException('You are not the author', 403);
    }

    if (updateArticleDto.title && article.title !== updateArticleDto.title) {
      article.slug = this.generateSlug(updateArticleDto.title);
    }
    Object.assign(article, updateArticleDto);

    return this.articleRepository.save(article);
  }
  async findAll(userId: number, query: any): Promise<ArticlesResponse> {
    const queryBuilder = this.dataSource
      .getRepository(Article)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');
    if (query.tag) {
      queryBuilder.andWhere('article.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }
    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('article.authorId = :id', { id: author.id });
    }
    if (query.favorited) {
      const user = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = user.favorites.map((favorite) => favorite.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('article.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }
    queryBuilder.orderBy('article.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();
    return { articles, articlesCount };
  }
  async favoriteArticle(slug: string, userId: number): Promise<Article> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isNotFavorited = user.favorites.every(
      (favorite) => favorite.id !== article.id,
    );
    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }
  async unFavouriteArticle(slug: string, userId: number): Promise<Article> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(
      (favourite) => favourite.id === article.id,
    );
    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
}
