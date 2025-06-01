import { BadRequestException, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordUtils } from '../users/utils/password.utils';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthResponse } from './dto/auth-response.type';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { User } from '@prisma/client';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordUtils: PasswordUtils,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

  async signup(signUpInput: SignUpInput): Promise<AuthResponse> {
    const { email, password, name } = signUpInput;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Hash password
    const hashedPassword = await this.passwordUtils.hashPassword(password);

    // Create new user
    const user = await this.usersService.create(email, hashedPassword, name);

    // Generate JWT token
    const accessToken = this.generateAccessToken(user);

    return { user, accessToken };
  }

  async signin(signInInput: SignInInput): Promise<AuthResponse> {
    const { email, password } = signInInput;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Compare password
    const isPasswordValid = await this.passwordUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate JWT token
    const accessToken = this.generateAccessToken(user);

    return { user, accessToken };
  }

    async logout(token: string): Promise<boolean> {
    try {
      const decodedToken = this.jwtService.decode(token) as JwtPayload & { exp: number }; 
      if (!decodedToken || !decodedToken.exp) {
        throw new BadRequestException('Invalid token for logout.');
      }

      // Calculate remaining time until token expiration in seconds
      const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000); 

      if (expiresIn > 0) {
        // Blacklist the token by storing it in Redis
        // The key is 'blacklisted_jwt:YOUR_TOKEN_HASH' and value is 'true'
        await this.redisClient.setex(`blacklisted_jwt:${token}`, expiresIn, 'true');
        return true;
      }
      return false; 
    } catch (error) {
      console.error('Error during logout:', error);
      throw new BadRequestException('Could not process logout.');
    }
  }

  private generateAccessToken(user: User): string {
    const payload: JwtPayload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }
}