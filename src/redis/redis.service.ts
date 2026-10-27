import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private readonly memoryStore = new Map<string, { value: string; expiresAt?: number }>();
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('redis.host', 'localhost');
    const port = this.configService.get<number>('redis.port', 6379);
    const password = this.configService.get<string>('redis.password');
    const db = this.configService.get<number>('redis.db', 0);

    try {
      this.client = new Redis({
        host,
        port,
        password: password || undefined,
        db,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis reconnection failed 3 times. Falling back to internal memory cache.');
            return null; // Stop retrying
          }
          return Math.min(times * 100, 1000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`Connected to Redis at ${host}:${port}`);
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error: ${err.message}. Operating in in-memory fallback mode.`);
      });
    } catch (e: any) {
      this.logger.warn(`Could not initialize Redis client (${e.message}). Using memory fallback.`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch {
        // Fallback to memory
      }
    }

    const item = this.memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch {
        // Fallback to memory
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.memoryStore.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch {
        // Fallback to memory
      }
    }
    this.memoryStore.delete(key);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const val = await this.get(`blacklist:${token}`);
    return val !== null;
  }

  async blacklistToken(token: string, ttlSeconds: number): Promise<void> {
    await this.set(`blacklist:${token}`, '1', ttlSeconds);
  }
}
