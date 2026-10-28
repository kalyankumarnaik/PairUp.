import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('AI & Compatibility Services')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('compatibility-reasons')
  @ApiOperation({ summary: 'Compute multi-dimensional compatibility matrix and date ideas' })
  getCompatibility(
    @CurrentUser('id') currentUserId: string,
    @Query('targetUserId') targetUserId: string
  ) {
    return this.aiService.generateCompatibilityReasons(currentUserId, targetUserId);
  }

  @Get('icebreakers')
  @ApiOperation({ summary: 'Generate intelligent personalized conversation openers' })
  getIcebreakers(
    @CurrentUser('id') currentUserId: string,
    @Query('targetUserId') targetUserId: string,
    @Query('category') category?: string
  ) {
    return this.aiService.generateIcebreakers(currentUserId, targetUserId, category);
  }

  @Post('profile-assist')
  @ApiOperation({ summary: 'Generate creative bio suggestions tailored to intention and tone' })
  improveBio(
    @Body('currentBio') currentBio: string,
    @Body('intention') intention: string,
    @Body('tone') tone?: 'charismatic' | 'witty' | 'minimalist'
  ) {
    return this.aiService.improveBio(currentBio, intention, tone);
  }

  @Post('safety-check')
  @ApiOperation({ summary: 'Classify content toxicity and detect financial solicitations or abuse' })
  classifySafety(@Body('text') text: string) {
    return this.aiService.classifyContentSafety(text);
  }
}
