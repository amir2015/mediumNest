import {
  Controller,
  Get,
  
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/user/decorators/user.decorators';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User('id') userId: number,
    @User('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(userId, username);
    return this.profileService.buildProfileResponse(profile);
  }
}
