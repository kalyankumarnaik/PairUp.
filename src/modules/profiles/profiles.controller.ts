import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { PreferencesService } from './preferences.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/create-profile.dto';
import {
  AddPhotoDto,
  ReorderPhotosDto,
  SetPromptsDto,
  SetInterestsDto,
} from './dto/profile-photo.dto';
import { UpdatePreferencesDto, UpdatePrivacyDto } from './dto/update-preferences.dto';
import {
  ProfileResponseDto,
  PublicProfileResponseDto,
  InterestResponseDto,
  DatingPreferenceResponseDto,
  PrivacySettingResponseDto,
} from './dto/profile-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Profiles & Preferences')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly preferencesService: PreferencesService,
  ) {}

  @Get('profiles/me')
  @ApiOperation({ summary: 'Get current user full private profile and completion score' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getMyProfile(@CurrentUser() user: AuthenticatedUser): Promise<ProfileResponseDto> {
    return this.profilesService.getOwnProfile(user.userId);
  }

  @Post('profiles/me')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initial setup of user profile (enforces 18+)' })
  @ApiResponse({ status: 201, type: ProfileResponseDto })
  async createProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.createProfile(user.userId, dto);
  }

  @Patch('profiles/me')
  @ApiOperation({ summary: 'Update profile details' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.updateProfile(user.userId, dto);
  }

  @Get('profiles/interests')
  @ApiOperation({ summary: 'List all interest tags in the platform taxonomy' })
  @ApiResponse({ status: 200, type: [InterestResponseDto] })
  async listInterests(): Promise<InterestResponseDto[]> {
    return this.profilesService.getAllInterests();
  }

  @Put('profiles/me/interests')
  @ApiOperation({ summary: 'Set interests for current user' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async setInterests(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetInterestsDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.setInterests(user.userId, dto);
  }

  @Put('profiles/me/prompts')
  @ApiOperation({ summary: 'Set or update profile prompts (max 3)' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async setPrompts(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetPromptsDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.setPrompts(user.userId, dto);
  }

  @Post('profiles/me/photos')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new photo to profile (max 6)' })
  @ApiResponse({ status: 201, type: ProfileResponseDto })
  async addPhoto(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddPhotoDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.addPhoto(user.userId, dto);
  }

  @Delete('profiles/me/photos/:photoId')
  @ApiOperation({ summary: 'Delete a photo from profile' })
  @ApiParam({ name: 'photoId', description: 'Photo UUID' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async deletePhoto(
    @CurrentUser() user: AuthenticatedUser,
    @Param('photoId') photoId: string,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.deletePhoto(user.userId, photoId);
  }

  @Patch('profiles/me/photos/order')
  @ApiOperation({ summary: 'Reorder profile photos gallery' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async reorderPhotos(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReorderPhotosDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.reorderPhotos(user.userId, dto);
  }

  @Patch('profiles/me/photos/:photoId/primary')
  @ApiOperation({ summary: 'Set a photo as primary display avatar' })
  @ApiParam({ name: 'photoId', description: 'Photo UUID' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async setPrimaryPhoto(
    @CurrentUser() user: AuthenticatedUser,
    @Param('photoId') photoId: string,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.setPrimaryPhoto(user.userId, photoId);
  }

  @Get('profiles/:userId')
  @ApiOperation({ summary: 'View another user public discovery profile with privacy enforcement' })
  @ApiParam({ name: 'userId', description: 'Target user UUID' })
  @ApiResponse({ status: 200, type: PublicProfileResponseDto })
  async getPublicProfile(
    @Param('userId') targetUserId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PublicProfileResponseDto> {
    return this.profilesService.getPublicProfile(targetUserId, user.userId);
  }

  // --------------------------------------------------------------------------
  // Preferences & Privacy Settings Endpoints
  // --------------------------------------------------------------------------

  @Get('preferences')
  @ApiOperation({ summary: 'Get dating search filters and preferences' })
  @ApiResponse({ status: 200, type: DatingPreferenceResponseDto })
  async getDatingPreferences(@CurrentUser() user: AuthenticatedUser): Promise<DatingPreferenceResponseDto> {
    return this.preferencesService.getDatingPreferences(user.userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update dating search filters and preferences' })
  @ApiResponse({ status: 200, type: DatingPreferenceResponseDto })
  async updateDatingPreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePreferencesDto,
  ): Promise<DatingPreferenceResponseDto> {
    return this.preferencesService.updateDatingPreferences(user.userId, dto);
  }

  @Get('preferences/privacy')
  @ApiOperation({ summary: 'Get user privacy and visibility settings' })
  @ApiResponse({ status: 200, type: PrivacySettingResponseDto })
  async getPrivacySettings(@CurrentUser() user: AuthenticatedUser): Promise<PrivacySettingResponseDto> {
    return this.preferencesService.getPrivacySettings(user.userId);
  }

  @Patch('preferences/privacy')
  @ApiOperation({ summary: 'Update privacy and visibility settings' })
  @ApiResponse({ status: 200, type: PrivacySettingResponseDto })
  async updatePrivacySettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePrivacyDto,
  ): Promise<PrivacySettingResponseDto> {
    return this.preferencesService.updatePrivacySettings(user.userId, dto);
  }
}
