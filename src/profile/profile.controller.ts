import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/user/decorators/user.decorators';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { AuthGuard } from 'src/user/dto/guards/auth.guard';

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
  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') userId: number,
    @Param('username') profileUsername: string,
  ) {
    return this.profileService.followProfile(userId, profileUsername);
  }
  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unFollowProfile(
    @User('id') userId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(
      userId,
      profileUsername,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
