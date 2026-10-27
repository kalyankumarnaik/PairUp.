import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { MATCH_PERMISSION_SERVICE_TOKEN } from './contracts/match-permission.interface';

@Module({
  imports: [ProfilesModule],
  controllers: [MatchesController],
  providers: [
    MatchesService,
    {
      provide: MATCH_PERMISSION_SERVICE_TOKEN,
      useExisting: MatchesService,
    },
  ],
  exports: [MatchesService, MATCH_PERMISSION_SERVICE_TOKEN],
})
export class MatchesModule {}
