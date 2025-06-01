import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { User } from '@prisma/client';
import Redis from 'ioredis';
import { Request } from 'express'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); 
    if (!token) {
      throw new UnauthorizedException('No token found in request.');
    }

    // CHECK IF TOKEN IS BLACKLISTED
    const isBlacklisted = await this.redisClient.get(`blacklisted_jwt:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted.');
    }

    const { userId } = payload;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found.');
    }
    return user;
  }
}