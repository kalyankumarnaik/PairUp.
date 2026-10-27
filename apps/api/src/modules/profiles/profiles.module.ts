import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AuthModule } from '../auth/auth.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Module({
  imports: [AuthModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, MemoryStoreService],
  exports: [ProfilesService]
})
export class ProfilesModule {}
