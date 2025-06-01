import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PasswordUtils } from './utils/password.utils'; 

@Module({
  providers: [UsersService, UsersResolver, PasswordUtils], 
  exports: [UsersService, PasswordUtils], 
})
export class UsersModule {}