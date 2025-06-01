import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module'; 
import { JwtStrategy } from './jwt.strategy'; 
import { JwtAuthGuard } from './guards/jwt-auth.guard'; 
import { RedisModule } from 'redis/redis.module';

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService], 
    }),
    RedisModule
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy, 
    JwtAuthGuard, 
  ],
  exports: [AuthService, JwtAuthGuard], 
})
export class AuthModule {}