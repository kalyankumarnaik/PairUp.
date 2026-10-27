import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MemoryStoreService } from '../../common/database/memory-store.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'pairup_dev_jwt_access_secret_change_in_production_min32chars',
      signOptions: { expiresIn: '15m' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MemoryStoreService, JwtAuthGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard, MemoryStoreService]
})
export class AuthModule {}
