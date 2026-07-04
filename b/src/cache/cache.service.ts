import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface MemoryEntry {
  value: string;
  expiresAt: number | null;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly client: Redis | null;
  private readonly memory = new Map<string, MemoryEntry>();
  private readonly useRedis: boolean;
  private readonly logger = new Logger(CacheService.name);

  constructor(private configService: ConfigService) {
    this.useRedis = this.configService.get<boolean>('redis.enabled') ?? false;
    let client: Redis | null = null;

    if (this.useRedis) {
      client = new Redis({
        host: this.configService.get<string>('redis.host'),
        port: this.configService.get<number>('redis.port'),
        password: this.configService.get<string>('redis.password'),
        lazyConnect: true,
        maxRetriesPerRequest: 3,
      });

      client.on('error', (err) => {
        this.logger.error(`Redis error: ${err.message}`);
      });
    } else {
      this.logger.log('Using in-memory cache (Redis disabled)');
    }

    this.client = client;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.client) {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    }

    const entry = this.memory.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.memory.delete(key);
      return null;
    }

    return JSON.parse(entry.value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    if (this.client) {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    }

    this.memory.set(key, {
      value: JSON.stringify(value),
      expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async del(key: string): Promise<void> {
    if (this.client) {
      await this.client.del(key);
      return;
    }

    this.memory.delete(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    if (this.client) {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return;
    }

    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    for (const key of this.memory.keys()) {
      if (regex.test(key)) {
        this.memory.delete(key);
      }
    }
  }
}
