import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SurgeService } from './surge.service';

@ApiTags('Activity Surges & Neighborhood Boost')
@Controller('surge')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SurgeController {
  constructor(private readonly surgeService: SurgeService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active activity surges and multiplier zones' })
  getActiveSurges(@Query('city') city?: string) {
    return this.surgeService.getAllActiveSurges(city);
  }

  @Get('current-location')
  @ApiOperation({ summary: 'Check if current GPS coordinates fall inside an active surge zone' })
  checkSurgeLocation(@Query('lat') lat: number, @Query('lng') lng: number) {
    return this.surgeService.getSurgeForCoordinates(lat, lng);
  }

  @Post('boost')
  @ApiOperation({ summary: 'Activate profile boost / surge multiplier for current user' })
  activateBoost(@CurrentUser('id') userId: string) {
    return this.surgeService.activateBoost(userId);
  }
}
