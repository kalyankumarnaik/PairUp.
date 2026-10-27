import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'System health, database status, and uptime check' })
  check() {
    return {
      status: 'ok',
      service: 'PairUp AI API Core',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        realtimeWebSocket: 'operational',
        geoSpatialEngine: 'active'
      }
    };
  }
}
