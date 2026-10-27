import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AuthModule } from '../auth/auth.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Module({
  imports: [AuthModule],
  controllers: [AiController],
  providers: [AiService, MemoryStoreService],
  exports: [AiService]
})
export class AiModule {}
