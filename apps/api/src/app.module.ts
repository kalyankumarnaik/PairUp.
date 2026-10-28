import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
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
import { SafetyModule } from './modules/safety/safety.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CommunitiesModule } from './modules/communities/communities.module';
import { SurgeModule } from './modules/surge/surge.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    DatabaseModule,
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
    HealthModule,
    SafetyModule,
    SubscriptionsModule,
    CommunitiesModule,
    SurgeModule,
    NotificationsModule
  ]
})
export class AppModule {}
