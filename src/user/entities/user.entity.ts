import { hash } from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column()
  password: string;
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
  @Column({ default: '' })
  bio: string;
}
