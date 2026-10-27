import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
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
import { Request } from 'express';
import { SafetyService } from './safety.service';
import {
  BlockUserDto,
  BlockedUserResponseDto,
  SubmitReportDto,
  AuditQueryDto,
  AuditLogResponseDto,
} from './dto/safety.dto';
import { PaginatedResultDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Safety, Moderation & Account Controls')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post('users/:id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Block a user. Dissolves any active match and removes pending likes.' })
  @ApiParam({ name: 'id', description: 'User UUID to block' })
  @ApiResponse({ status: 200, description: 'User blocked successfully' })
  async blockUser(
    @Param('id') targetUserId: string,
    @Body() dto: BlockUserDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.safetyService.blockUser(user.userId, targetUserId, dto, ip, userAgent);
  }

  @Delete('users/:id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unblock a previously blocked user' })
  @ApiParam({ name: 'id', description: 'User UUID to unblock' })
  @ApiResponse({ status: 200, description: 'User unblocked successfully' })
  async unblockUser(
    @Param('id') targetUserId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.safetyService.unblockUser(user.userId, targetUserId, ip, userAgent);
  }

  @Get('users/me/blocks')
  @ApiOperation({ summary: 'List all users currently blocked by the authenticated user' })
  @ApiResponse({ status: 200, type: [BlockedUserResponseDto] })
  async getBlockedUsers(@CurrentUser() user: AuthenticatedUser): Promise<BlockedUserResponseDto[]> {
    return this.safetyService.getBlockedUsers(user.userId);
  }

  @Post('safety/reports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit safety or moderation report against a user' })
  @ApiResponse({ status: 201, description: 'Report logged for moderation pipeline' })
  async submitReport(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitReportDto,
  ) {
    return this.safetyService.processReport({
      ...dto,
      reporterUserId: user.userId,
    });
  }

  @Get('safety/audit-logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin only: Query security and administrative audit logs' })
  @ApiResponse({ status: 200, description: 'Paginated audit logs' })
  async getAuditLogs(
    @Query() query: AuditQueryDto,
  ): Promise<PaginatedResultDto<AuditLogResponseDto>> {
    return this.safetyService.getAuditLogs(query);
  }
}
