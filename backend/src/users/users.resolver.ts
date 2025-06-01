import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User as PrismaUser } from '@prisma/client';
import { User as GqlUser } from './dto/user.type'; 
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UseGuards, NotFoundException, UnauthorizedException } from '@nestjs/common'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => GqlUser) 
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard) 
  @Query(() => GqlUser, { name: 'me', description: 'Get the currently authenticated user profile' })
  async getMe(@CurrentUser() currentUser: PrismaUser): Promise<GqlUser> { 
    const user = await this.usersService.findById(currentUser.id);

    if (!user) {
      throw new NotFoundException('Authenticated user profile not found.');
    }
    return user as GqlUser;
  }
}