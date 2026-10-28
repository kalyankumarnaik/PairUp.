import { Module } from '@nestjs/common';
import { SurgeController } from './surge.controller';
import { SurgeService } from './surge.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SurgeController],
  providers: [SurgeService],
  exports: [SurgeService]
})
export class SurgeModule {}
