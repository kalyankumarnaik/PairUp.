import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { LocationModule } from './modules/location/location.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { ChatModule } from './modules/chat/chat.module';
import { CallsModule } from './modules/calls/calls.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { EventsModule } from './modules/events/events.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    AuthModule,
    ProfilesModule,
    LocationModule,
    DiscoveryModule,
    ChatModule,
    CallsModule,
    RoomsModule,
    EventsModule,
    AiModule,
    AdminModule,
    HealthModule
  ]
})
export class AppModule {}
