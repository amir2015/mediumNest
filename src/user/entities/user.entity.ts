import { hash } from 'bcrypt';
import { Article } from 'src/article/entities/article.entity';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column({ default: '' })
  image: string;
  @Column({ select: false })
  password: string;
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
  @Column({ default: '' })
  bio: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
