import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AuthModule } from '../auth/auth.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Module({
  imports: [AuthModule],
  controllers: [RoomsController],
  providers: [RoomsService, MemoryStoreService],
  exports: [RoomsService]
})
export class RoomsModule {}
