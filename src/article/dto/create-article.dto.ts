import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;
  description: string;
  body: string;
  tagList: string[];
}
