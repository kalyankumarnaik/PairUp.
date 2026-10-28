import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PreferencesService } from './preferences.service';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, PreferencesService],
  exports: [ProfilesService, PreferencesService],
})
export class ProfilesModule {}
