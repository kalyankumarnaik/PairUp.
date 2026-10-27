import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocationService } from './location.service';
import { LocationUpdateInput, ManualLocationInput } from '@pairup/validation';

@ApiTags('Location & Nearby')
@Controller('location')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('update')
  @ApiOperation({ summary: 'Update real GPS location with coordinate sanitization' })
  updateLocation(
    @CurrentUser('id') userId: string,
    @Body() body: LocationUpdateInput
  ) {
    return this.locationService.updateLocation(
      userId,
      body.latitude,
      body.longitude,
      body.city || undefined,
      body.state || undefined
    );
  }

  @Post('city')
  @ApiOperation({ summary: 'Fallback manual city selection when GPS is disabled' })
  setManualCity(
    @CurrentUser('id') userId: string,
    @Body() body: ManualLocationInput
  ) {
    return this.locationService.updateLocation(
      userId,
      body.latitude,
      body.longitude,
      body.city,
      body.state || undefined
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user stored location and pause status' })
  getMyLocation(@CurrentUser('id') userId: string) {
    return this.locationService.getCurrentLocation(userId);
  }

  @Post('pause')
  @ApiOperation({ summary: 'Toggle location sharing pause' })
  setPaused(
    @CurrentUser('id') userId: string,
    @Body('isPaused') isPaused: boolean
  ) {
    return this.locationService.setPaused(userId, isPaused);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Discover nearby eligible profiles within radius (1km - 50km)' })
  getNearby(
    @CurrentUser('id') userId: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('city') city?: string
  ) {
    const rad = radiusKm ? parseInt(radiusKm, 10) : 25;
    return this.locationService.findNearbyProfiles(userId, rad, city);
  }
}
