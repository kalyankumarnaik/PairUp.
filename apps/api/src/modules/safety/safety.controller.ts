import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SafetyService } from './safety.service';
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
}
