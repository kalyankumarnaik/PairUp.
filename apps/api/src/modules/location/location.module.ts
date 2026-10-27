import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { AuthModule } from '../auth/auth.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Module({
  imports: [AuthModule],
  controllers: [LocationController],
  providers: [LocationService, MemoryStoreService],
  exports: [LocationService]
})
export class LocationModule {}
