import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'; 
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { AuthResponse } from './dto/auth-response.type';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { description: 'Register a new user' })
  async signup(@Args('signUpInput') signUpInput: SignUpInput): Promise<AuthResponse> {
    return this.authService.signup(signUpInput);
  }

  @Mutation(() => AuthResponse, { description: 'Sign in an existing user' })
  async signin(@Args('signInInput') signInInput: SignInInput): Promise<AuthResponse> {
    return this.authService.signin(signInInput);
  }

  @Mutation(() => Boolean, { description: 'Logout the current user by blacklisting their access token' })
  @UseGuards(JwtAuthGuard) 
  async logout(@Context() context: any): Promise<boolean> {
    const authHeader = context.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided.');
    }
    const token = authHeader.split(' ')[1]; 

    return this.authService.logout(token);
  }
}