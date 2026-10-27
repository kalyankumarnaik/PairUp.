import { Module } from '@nestjs/common';
import { MatchesModule } from '../matches/matches.module';
import { SafetyModule } from '../safety/safety.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MatchesModule, SafetyModule, DiscoveryModule, AuthModule],
  exports: [MatchesModule, SafetyModule, DiscoveryModule, AuthModule],
})
export class IntegrationsModule {}
