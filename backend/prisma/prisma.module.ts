// expenses-app/backend/src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Make this module global so PrismaService can be used anywhere without re-importing
@Module({
  providers: [PrismaService], // Provide the PrismaService
  exports: [PrismaService], // Export PrismaService so other modules can inject it
})
export class PrismaModule {}