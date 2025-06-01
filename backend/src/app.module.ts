import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { UsersModule } from './users/users.module'; 
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    PrismaModule,
    RedisModule,
    UsersModule, 
    AuthModule,
    ExpensesModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}