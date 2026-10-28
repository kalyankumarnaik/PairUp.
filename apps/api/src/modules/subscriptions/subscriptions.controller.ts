import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionTier } from '@pairup/domain-types';

@ApiTags('Subscriptions & Billing')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly subService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'List all subscription tiers and feature matrices' })
  getPlans() {
    return this.subService.getAvailablePlans();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user active subscription and limits' })
  getMySubscription(@CurrentUser('id') userId: string) {
    return this.subService.getCurrentSubscription(userId);
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade to PairUp Plus or Gold with simulated UPI / Card checkout' })
  upgrade(
    @CurrentUser('id') userId: string,
    @Body('tier') tier: SubscriptionTier,
    @Body('paymentMethod') paymentMethod?: string,
    @Body('promoCode') promoCode?: string
  ) {
    return this.subService.upgradeSubscription(userId, tier, paymentMethod, promoCode);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get billing invoice receipts' })
  getInvoices(@CurrentUser('id') userId: string) {
    return this.subService.getUserInvoices(userId);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel automatic renewal of paid plan' })
  cancelSubscription(@CurrentUser('id') userId: string) {
    return this.subService.cancelSubscription(userId);
  }
}
