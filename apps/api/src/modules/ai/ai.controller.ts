import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('AI Services')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('compatibility-reasons')
  @ApiOperation({ summary: 'Get explainable compatibility score & reasons between profiles' })
  getCompatibility(
    @CurrentUser('id') userId: string,
    @Query('targetUserId') targetUserId: string
  ) {
    return this.aiService.generateCompatibilityReasons(userId, targetUserId);
  }

  @Get('icebreakers')
  @ApiOperation({ summary: 'Get tailored conversation icebreakers for a match' })
  getIcebreakers(
    @CurrentUser('id') userId: string,
    @Query('targetUserId') targetUserId: string
  ) {
    return this.aiService.generateIcebreakers(userId, targetUserId);
  }

  @Post('profile-assist')
  @ApiOperation({ summary: 'Generate improved bio suggestions' })
  improveBio(
    @Body('bio') bio: string,
    @Body('intention') intention: string
  ) {
    return this.aiService.improveBio(bio, intention);
  }
}
