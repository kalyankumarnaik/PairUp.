import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { MemoryStoreService } from '../../common/database/memory-store.service';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, MemoryStoreService, RolesGuard],
  exports: [AdminService]
})
export class AdminModule {}
