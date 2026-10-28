import { Module } from '@nestjs/common';
import { SafetyController } from './safety.controller';
import { SafetyService } from './safety.service';
import { AuthModule } from '../auth/auth.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Module({
  imports: [AuthModule],
  controllers: [SafetyController],
  providers: [SafetyService],
  exports: [SafetyService]
})
export class SafetyModule {}
