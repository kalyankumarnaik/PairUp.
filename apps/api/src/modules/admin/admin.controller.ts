import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { AccountStatus, ModerationActionType, UserRole } from '@pairup/domain-types';

@ApiTags('Admin & Moderation Platform')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get overview dashboard metrics (users, matches, revenue, health)' })
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all accounts for management and auditing' })
  getUsers() {
    return this.adminService.getUsersList();
  }

  @Post('users/:id/status')
  @ApiOperation({ summary: 'Suspend, restore, or pause user account' })
  updateUserStatus(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Body('status') status: AccountStatus,
    @Body('reason') reason: string
  ) {
    return this.adminService.updateUserStatus(adminId, targetUserId, status, reason);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get moderation reports queue' })
  getReports() {
    return this.adminService.getReports();
  }

  @Post('reports/:id/resolve')
  @ApiOperation({ summary: 'Resolve a moderation report with disciplinary action' })
  resolveReport(
    @CurrentUser('id') adminId: string,
    @Param('id') reportId: string,
    @Body('action') action: ModerationActionType,
    @Body('notes') notes: string
  ) {
    return this.adminService.resolveReport(adminId, reportId, action, notes);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'View immutable administrative audit trail' })
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
