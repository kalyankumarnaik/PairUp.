import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { ProfileUpdateRequest, User } from '@pairup/domain-types';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('interests')
  @ApiOperation({ summary: 'List all available interest tags by category' })
  getInterests() {
    return this.profilesService.getAllInterests();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user complete profile' })
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.profilesService.getMyProfile(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get public sanitized profile of another user' })
  getPublicProfile(@Param('id') id: string) {
    return this.profilesService.getPublicProfile(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile bio, prompts, intentions, details' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updates: ProfileUpdateRequest
  ) {
    return this.profilesService.updateProfile(userId, updates);
  }

  @Post('me/photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new photo to user profile' })
  uploadPhoto(
    @CurrentUser('id') userId: string,
    @Body('url') photoUrl: string
  ) {
    // In local mode, accepts URL directly or uploaded URL
    const url = photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';
    return this.profilesService.addPhoto(userId, url);
  }

  @Delete('me/photos/:photoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a profile photo' })
  deletePhoto(
    @CurrentUser('id') userId: string,
    @Param('photoId') photoId: string
  ) {
    return this.profilesService.deletePhoto(userId, photoId);
  }

  @Post('me/photos/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder profile photos' })
  reorderPhotos(
    @CurrentUser('id') userId: string,
    @Body('photoIds') photoIds: string[]
  ) {
    return this.profilesService.reorderPhotos(userId, photoIds);
  }
}
