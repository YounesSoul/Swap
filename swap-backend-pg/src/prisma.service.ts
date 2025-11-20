
import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static connectionInitialized = false;

  async onModuleInit() {
    // Only connect once, even if multiple instances are created
    if (PrismaService.connectionInitialized) {
      console.log('⏭️  Database already connected (skipping)');
      return;
    }
    
    try {
      await this.$connect();
      PrismaService.connectionInitialized = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to connect to database:', errorMessage);
      throw error;
    }
  }
  
  async onModuleDestroy() {
    await this.$disconnect();
  }
  
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }
}
