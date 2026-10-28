import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CallsService, CallQualityReport, WebRtcSignalingMessage } from './calls.service';
import { CallType } from '@pairup/domain-types';

@ApiTags('Voice & Video Calls')
@Controller('calls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a 1-on-1 audio or video call with WebRTC token & TURN credentials' })
  initiateCall(
    @CurrentUser('id') userId: string,
    @Body('receiverId') receiverId: string,
    @Body('type') type: CallType = CallType.VOICE,
    @Body('sdpOffer') sdpOffer?: string
  ) {
    return this.callsService.initiateCall(userId, receiverId, type, sdpOffer);
  }

  @Get('turn-credentials')
  @ApiOperation({ summary: 'Obtain ephemeral RFC 5766 TURN server credentials for NAT traversal' })
  getTurnCredentials(@CurrentUser('id') userId: string) {
    return this.callsService.generateTurnCredentials(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get current call session details' })
  getCallSession(@Param('id') callId: string) {
    return this.callsService.getCallSession(callId);
  }

  @Post(':id/respond')
  @ApiOperation({ summary: 'Accept or decline incoming call invitation with SDP answer' })
  respondCall(
    @CurrentUser('id') userId: string,
    @Param('id') callId: string,
    @Body('accept') accept: boolean,
    @Body('sdpAnswer') sdpAnswer?: string
  ) {
    return this.callsService.respondCall(callId, userId, accept, sdpAnswer);
  }

  @Post(':id/signal')
  @ApiOperation({ summary: 'Relay WebRTC SDP offers, answers, or ICE candidate packets' })
  sendSignal(
    @CurrentUser('id') userId: string,
    @Param('id') callId: string,
    @Body() payload: { type: 'offer' | 'answer' | 'ice-candidate' | 'heartbeat'; sdp?: string; candidate?: any }
  ) {
    const message: WebRtcSignalingMessage = {
      callId,
      senderId: userId,
      type: payload.type,
      sdp: payload.sdp,
      candidate: payload.candidate,
      timestamp: new Date().toISOString()
    };
    return this.callsService.processSignalingMessage(message);
  }

  @Get(':id/signals')
  @ApiOperation({ summary: 'Poll pending WebRTC signaling packets for current participant' })
  getSignals(
    @CurrentUser('id') userId: string,
    @Param('id') callId: string,
    @Query('since') sinceIso?: string
  ) {
    return this.callsService.getSignalingMessages(callId, userId, sinceIso);
  }

  @Post(':id/quality')
  @ApiOperation({ summary: 'Submit call quality metrics (packet loss, MOS score, jitter)' })
  recordQualityMetric(
    @CurrentUser('id') userId: string,
    @Param('id') callId: string,
    @Body() metric: Omit<CallQualityReport, 'callId' | 'userId'>
  ) {
    this.callsService.recordQualityMetric({
      callId,
      userId,
      ...metric
    });
    return { recorded: true };
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End an active call session' })
  endCall(@Param('id') callId: string, @Body('reason') reason?: string) {
    return this.callsService.endCall(callId, reason);
  }
}
