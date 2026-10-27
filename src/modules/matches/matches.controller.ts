import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  Body,
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
import { MatchesService } from './matches.service';
import { MatchQueryDto, UnmatchDto, MatchResponseDto } from './dto/match-response.dto';
import { PaginatedResultDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccountStatusGuard } from '../../common/guards/account-status.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Discovery & Matching')
@Controller('matches')
@UseGuards(JwtAuthGuard, AccountStatusGuard)
@ApiBearerAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiOperation({ summary: 'List all active matches for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Paginated list of matches' })
  async getMatches(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: MatchQueryDto,
  ): Promise<PaginatedResultDto<MatchResponseDto>> {
    return this.matchesService.getMatches(user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific match' })
  @ApiParam({ name: 'id', description: 'Match UUID' })
  @ApiResponse({ status: 200, type: MatchResponseDto })
  async getMatch(
    @Param('id') matchId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MatchResponseDto> {
    return this.matchesService.getMatchById(matchId, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unmatch a user with reason tracking' })
  @ApiParam({ name: 'id', description: 'Match UUID' })
  @ApiResponse({ status: 200, description: 'Successfully unmatched' })
  async unmatch(
    @Param('id') matchId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UnmatchDto,
  ): Promise<{ message: string }> {
    return this.matchesService.unmatch(matchId, user.userId, dto);
  }
}
