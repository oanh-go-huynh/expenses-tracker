import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesResolver } from './expenses.resolver';
import { PrismaModule } from '../../prisma/prisma.module'; 
import { RedisModule } from 'redis/redis.module';
import { DateTimeScalar } from '../common/scalars/date-time.scalar';

@Module({
  imports: [PrismaModule, RedisModule], 
  providers: [ExpensesService, ExpensesResolver, DateTimeScalar],
  exports: [ExpensesService], 
})
export class ExpensesModule {}