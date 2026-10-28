import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications & Alerts')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications and unread counter' })
  getMyNotifications(@CurrentUser('id') userId: string) {
    return this.service.getNotifications(userId);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark specific notification as read' })
  markAsRead(@CurrentUser('id') userId: string, @Param('id') notificationId: string) {
    return this.service.markAsRead(userId, notificationId);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all unread notifications as read' })
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.service.markAllAsRead(userId);
  }
}
