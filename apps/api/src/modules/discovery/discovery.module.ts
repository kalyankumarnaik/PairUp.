import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { AuthModule } from '../auth/auth.module';
import { LocationModule } from '../location/location.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Module({
  imports: [AuthModule, LocationModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService, MemoryStoreService],
  exports: [DiscoveryService]
})
export class DiscoveryModule {}
