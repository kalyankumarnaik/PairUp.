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
import { SafetyService, UserSafetyPreferences } from './safety.service';
import { CreateReportInput } from '@pairup/validation';

@ApiTags('Safety & Moderation')
@Controller('safety')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post('report')
  @ApiOperation({ summary: 'Submit user safety report with evidence' })
  reportUser(
    @CurrentUser('id') userId: string,
    @Body() body: CreateReportInput
  ) {
    return this.safetyService.reportUser(
      userId,
      body.reportedUserId,
      body.category as any,
      body.reason,
      body.evidenceUrls
    );
  }

  @Post('block')
  @ApiOperation({ summary: 'Block user from discovery, messaging, and calls' })
  blockUser(
    @CurrentUser('id') userId: string,
    @Body('targetUserId') targetUserId: string
  ) {
    return this.safetyService.blockUser(userId, targetUserId);
  }

  @Delete('block/:targetUserId')
  @ApiOperation({ summary: 'Unblock previously blocked user' })
  unblockUser(
    @CurrentUser('id') userId: string,
    @Param('targetUserId') targetUserId: string
  ) {
    return this.safetyService.unblockUser(userId, targetUserId);
  }

  @Get('blocked-users')
  @ApiOperation({ summary: 'List all blocked user IDs' })
  getBlockedUsers(@CurrentUser('id') userId: string) {
    return this.safetyService.getBlockedUsers(userId);
  }

  // ---------------------------------------------------------------------------
  // DATE SAFETY GUARD & CHECK-IN
  // ---------------------------------------------------------------------------
  @Post('date-guard')
  @ApiOperation({ summary: 'Activate a scheduled date check-in guard timer' })
  createDateCheckInGuard(
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      partnerName: string;
      venue: string;
      emergencyContact: string;
      durationMinutes: number;
    }
  ) {
    return this.safetyService.createDateCheckInGuard(userId, body);
  }

  @Post('date-guard/:guardId/check-in')
  @ApiOperation({ summary: 'Confirm safe check-in or extend active date timer' })
  confirmDateCheckIn(
    @CurrentUser('id') userId: string,
    @Param('guardId') guardId: string,
    @Body('extendMinutes') extendMinutes?: number
  ) {
    return this.safetyService.confirmDateCheckIn(userId, guardId, extendMinutes);
  }

  @Post('date-guard/:guardId/sos')
  @ApiOperation({ summary: 'Trigger Emergency SOS distress signal to emergency contacts' })
  triggerEmergencySos(
    @CurrentUser('id') userId: string,
    @Param('guardId') guardId: string,
    @Body('coordinates') coordinates?: { latitude: number; longitude: number }
  ) {
    return this.safetyService.triggerEmergencySos(userId, guardId, coordinates);
  }

  // ---------------------------------------------------------------------------
  // PRIVACY PREFERENCES
  // ---------------------------------------------------------------------------
  @Get('preferences')
  @ApiOperation({ summary: 'Get current user privacy and safety preferences' })
  getSafetyPreferences(@CurrentUser('id') userId: string) {
    return this.safetyService.getSafetyPreferences(userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user location masking, incognito, and blur settings' })
  updateSafetyPreferences(
    @CurrentUser('id') userId: string,
    @Body() updates: Partial<UserSafetyPreferences>
  ) {
    return this.safetyService.updateSafetyPreferences(userId, updates);
  }
}
