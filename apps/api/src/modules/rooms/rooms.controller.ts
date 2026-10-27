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
import { RoomsService } from './rooms.service';
import { CreateVoiceRoomInput } from '@pairup/validation';

@ApiTags('Voice Rooms & Audio Communities')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active voice rooms' })
  getAllRooms() {
    return this.roomsService.getAllRooms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a voice room' })
  getRoomById(@Param('id') id: string) {
    return this.roomsService.getRoomById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new live audio room' })
  createRoom(
    @CurrentUser('id') userId: string,
    @Body() body: CreateVoiceRoomInput
  ) {
    return this.roomsService.createRoom(
      userId,
      body.title,
      body.category,
      body.emoji,
      body.isPrivate,
      body.capacity
    );
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join voice room as listener' })
  joinRoom(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.roomsService.joinRoom(userId, id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave voice room' })
  leaveRoom(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.roomsService.leaveRoom(userId, id);
  }

  @Post(':id/raise-hand')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Raise or lower hand in voice room' })
  raiseHand(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.roomsService.raiseHand(userId, id);
  }
}
