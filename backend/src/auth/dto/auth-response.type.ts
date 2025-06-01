import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/dto/user.type'; 

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}