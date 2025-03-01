import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProfileType } from './types/profile.type';
import { Follow } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}
  async getProfile(
    userId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return { ...user, following: false };
  }

  async followProfile(
    userId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const profileUser = await this.userRepository.findOne({
      where: { username: profileUsername },
    });
    if (!profileUser) {
      throw new HttpException('Profile not found', 404);
    }
    if (userId === profileUser.id) {
      throw new HttpException(
        'Follower and followed user cannot be the same',
        400,
      );
    }
    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: profileUser.id,
      },
    });
    if (!follow) {
      const newFollow = new Follow();
      newFollow.followerId = userId;
      newFollow.followingId = profileUser.id;
      await this.followRepository.save(newFollow);
    }
    return { ...profileUser, following: true };
  }
  async buildProfileResponse(profile: any) {
    return {
      profile,
    };
  }
}
