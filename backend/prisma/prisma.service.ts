import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], 
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma Client connected to database.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma Client disconnected from database.');
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      console.log('Application is gracefully shutting down...');
      await app.close(); 
      await this.$disconnect(); 
    });
  }
}