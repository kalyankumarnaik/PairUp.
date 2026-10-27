import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AuthModule } from '../auth/auth.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Module({
  imports: [AuthModule],
  controllers: [EventsController],
  providers: [EventsService, MemoryStoreService],
  exports: [EventsService]
})
export class EventsModule {}
