import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SOCKET_EVENTS } from '@pairup/contracts';
import { ChatService } from './chat.service';
import { MessageType } from '@pairup/domain-types';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private activeUsers: Map<string, string> = new Map(); // socketId -> userId

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Authentication required' });
        socket.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      this.activeUsers.set(socket.id, userId);
      socket.data.userId = userId;

      this.logger.log(`Client connected: Socket ${socket.id} -> User ${userId}`);

      this.server.emit(SOCKET_EVENTS.USER_ONLINE, {
        userId,
        isOnline: true,
        lastSeenAt: new Date().toISOString()
      });
    } catch (err: any) {
      this.logger.warn(`Socket connection rejected: ${err.message}`);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = this.activeUsers.get(socket.id);
    if (userId) {
      this.activeUsers.delete(socket.id);
      this.logger.log(`Client disconnected: User ${userId}`);

      this.server.emit(SOCKET_EVENTS.USER_OFFLINE, {
        userId,
        isOnline: false,
        lastSeenAt: new Date().toISOString()
      });
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.JOIN_CONVERSATION)
  handleJoinConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody('conversationId') conversationId: string
  ) {
    socket.join(`conv_${conversationId}`);
    return { joined: true, conversationId };
  }

  @SubscribeMessage(SOCKET_EVENTS.LEAVE_CONVERSATION)
  handleLeaveConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody('conversationId') conversationId: string
  ) {
    socket.leave(`conv_${conversationId}`);
    return { left: true, conversationId };
  }

  @SubscribeMessage('chat:send')
  handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: {
      conversationId: string;
      content: string;
      type?: MessageType;
      attachmentUrls?: string[];
    }
  ) {
    const userId = socket.data.userId;
    if (!userId) return;

    const message = this.chatService.sendMessage(
      userId,
      payload.conversationId,
      payload.content,
      payload.type || MessageType.TEXT,
      payload.attachmentUrls
    );

    // Broadcast to the conversation room
    this.server.to(`conv_${payload.conversationId}`).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

    return message;
  }

  @SubscribeMessage(SOCKET_EVENTS.TYPING_START)
  handleTypingStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody('conversationId') conversationId: string
  ) {
    const userId = socket.data.userId;
    socket.to(`conv_${conversationId}`).emit(SOCKET_EVENTS.TYPING_START, {
      conversationId,
      userId,
      isTyping: true
    });
  }

  @SubscribeMessage(SOCKET_EVENTS.TYPING_STOP)
  handleTypingStop(
    @ConnectedSocket() socket: Socket,
    @MessageBody('conversationId') conversationId: string
  ) {
    const userId = socket.data.userId;
    socket.to(`conv_${conversationId}`).emit(SOCKET_EVENTS.TYPING_STOP, {
      conversationId,
      userId,
      isTyping: false
    });
  }
}
