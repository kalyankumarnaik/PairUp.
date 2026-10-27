import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { AddReactionInput, SendMessageInput } from '@pairup/validation';

@ApiTags('Chat & Messaging')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List all conversations for current user' })
  getConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation details and verify membership' })
  getConversation(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string
  ) {
    return this.chatService.getConversation(userId, conversationId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get paginated messages for a conversation' })
  getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Query('limit') limit?: string
  ) {
    const l = limit ? parseInt(limit, 10) : 50;
    return this.chatService.getMessages(userId, conversationId, l);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a persistent chat message (text, voice note, photo)' })
  sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() body: SendMessageInput
  ) {
    return this.chatService.sendMessage(
      userId,
      conversationId,
      body.content,
      body.type as any,
      body.attachmentUrls,
      body.voiceDurationSeconds,
      body.waveform
    );
  }

  @Post('conversations/:id/messages/:msgId/reactions')
  @ApiOperation({ summary: 'Toggle emoji reaction on a message' })
  addReaction(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Param('msgId') messageId: string,
    @Body('emoji') emoji: string
  ) {
    return this.chatService.addReaction(userId, conversationId, messageId, emoji);
  }
}
