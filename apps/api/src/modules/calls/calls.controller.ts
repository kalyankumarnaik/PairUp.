import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CallsService } from './calls.service';
import { CallType } from '@pairup/domain-types';

@ApiTags('Voice & Video Calls')
@Controller('calls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a 1-on-1 audio or video call with token generation' })
  initiateCall(
    @CurrentUser('id') userId: string,
    @Body('receiverId') receiverId: string,
    @Body('type') type: CallType
  ) {
    return this.callsService.initiateCall(userId, receiverId, type);
  }

  @Post(':id/respond')
  @ApiOperation({ summary: 'Accept or decline incoming call invitation' })
  respondCall(
    @CurrentUser('id') userId: string,
    @Param('id') callId: string,
    @Body('accept') accept: boolean
  ) {
    return this.callsService.respondCall(callId, userId, accept);
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End an active call' })
  endCall(@Param('id') callId: string) {
    return this.callsService.endCall(callId);
  }
}
