import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DiscoveryService } from './discovery.service';
import { SwipeDecisionInput } from '@pairup/validation';

@ApiTags('Discovery & Matching')
@Controller('discovery')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Get personalized card deck for swiping discovery' })
  getFeed(
    @CurrentUser('id') userId: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('maxDistanceKm') maxDistanceKm?: string,
    @Query('connectionMode') connectionMode?: string
  ) {
    return this.discoveryService.getDiscoveryFeed(userId, {
      minAge: minAge ? parseInt(minAge, 10) : undefined,
      maxAge: maxAge ? parseInt(maxAge, 10) : undefined,
      maxDistanceKm: maxDistanceKm ? parseInt(maxDistanceKm, 10) : undefined,
      connectionMode: connectionMode as any
    });
  }

  @Post('swipe')
  @ApiOperation({ summary: 'Process swipe action (LIKE, PASS, SUPER_LIKE) with mutual match transaction' })
  swipe(
    @CurrentUser('id') userId: string,
    @Body() body: SwipeDecisionInput
  ) {
    return this.discoveryService.processSwipe(
      userId,
      body.targetUserId,
      body.action as any,
      body.connectionMode
    );
  }

  @Post('rewind')
  @ApiOperation({ summary: 'Undo and rewind the previous swipe decision' })
  rewind(@CurrentUser('id') userId: string) {
    return this.discoveryService.rewindLastDecision(userId);
  }

  @Get('matches')
  @ApiOperation({ summary: 'List all mutual matches with last conversation previews' })
  getMatches(@CurrentUser('id') userId: string) {
    return this.discoveryService.getMatches(userId);
  }

  @Delete('matches/:matchId')
  @ApiOperation({ summary: 'Unmatch a user and archive conversation' })
  unmatch(
    @CurrentUser('id') userId: string,
    @Param('matchId') matchId: string
  ) {
    return this.discoveryService.unmatch(userId, matchId);
  }
}
