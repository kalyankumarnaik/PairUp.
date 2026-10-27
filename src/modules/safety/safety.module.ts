import { Module } from '@nestjs/common';
import { SafetyController } from './safety.controller';
import { SafetyService } from './safety.service';
import { MODERATION_SERVICE_TOKEN } from './contracts/moderation.interface';

@Module({
  controllers: [SafetyController],
  providers: [
    SafetyService,
    {
      provide: MODERATION_SERVICE_TOKEN,
      useExisting: SafetyService,
    },
  ],
  exports: [SafetyService, MODERATION_SERVICE_TOKEN],
})
export class SafetyModule {}
