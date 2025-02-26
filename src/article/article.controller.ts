import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/user/dto/guards/auth.guard';
import { User as UserDecorator } from 'src/user/decorators/user.decorators';
import { User } from 'src/user/entities/user.entity';
import { ArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async createArticle(
    @UserDecorator() user: User,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponse> {
    const article = await this.articleService.createArticle(
      createArticleDto,
      user,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponse> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @UserDecorator('id') userId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.deleteArticle(slug, userId);
  }
  @Patch(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @UserDecorator('id') userId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return await this.articleService.updateArticle(
      slug,
      updateArticleDto,
      userId,
    );
  }

  @Get()
  async findAll(@UserDecorator('id') userId: number, @Query() query: any) {
    return await this.articleService.findAll(userId, query);
  }
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async favoriteArticle(
    @UserDecorator('id') userId: number,
    @Param('slug') slug: string,
  ):Promise<ArticleResponse> {
    const article= await this.articleService.favoriteArticle(slug, userId);
    return this.articleService.buildArticleResponse(article);
  }
}
