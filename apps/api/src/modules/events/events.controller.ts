import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventInput } from '@pairup/validation';

@ApiTags('Social Discovery Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Browse all upcoming discovery events' })
  getAllEvents(
    @Query('city') city?: string,
    @Query('category') category?: string
  ) {
    return this.eventsService.getAllEvents(undefined, city, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of an event' })
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a social discovery event with venue & capacity' })
  createEvent(
    @CurrentUser('id') userId: string,
    @Body() body: CreateEventInput
  ) {
    return this.eventsService.createEvent(userId, body);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register for event with atomic capacity check' })
  register(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.eventsService.registerForEvent(userId, id);
  }

  @Delete(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel registration for an event' })
  cancelRegistration(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.eventsService.cancelRegistration(userId, id);
  }
}
