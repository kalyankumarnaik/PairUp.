import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DiscoveryService } from './discovery.service';
import {
  DiscoveryQueryDto,
  LikeActionDto,
  PassActionDto,
  LikeResultDto,
  PassResultDto,
} from './dto/discovery-query.dto';
import { PublicProfileResponseDto } from '../profiles/dto/profile-response.dto';
import { PaginatedResultDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccountStatusGuard } from '../../common/guards/account-status.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Discovery & Matching')
@Controller('discovery')
@UseGuards(JwtAuthGuard, AccountStatusGuard)
@ApiBearerAuth()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get()
  @ApiOperation({ summary: 'Get discovery candidates matching user dating preferences' })
  @ApiResponse({ status: 200, description: 'List of ranked candidate profiles' })
  async getDiscoveryFeed(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: DiscoveryQueryDto,
  ): Promise<PaginatedResultDto<PublicProfileResponseDto>> {
    return this.discoveryService.getDiscoveryFeed(user.userId, query);
  }

  @Post('like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like or Superlike a candidate profile. Atomically creates a match on mutual likes.' })
  @ApiResponse({ status: 200, type: LikeResultDto })
  async like(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LikeActionDto,
  ): Promise<LikeResultDto> {
    return this.discoveryService.likeUser(user.userId, dto);
  }

  @Post('pass')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pass on a candidate profile so they are excluded from future feeds' })
  @ApiResponse({ status: 200, type: PassResultDto })
  async pass(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PassActionDto,
  ): Promise<PassResultDto> {
    return this.discoveryService.passUser(user.userId, dto);
  }
}
