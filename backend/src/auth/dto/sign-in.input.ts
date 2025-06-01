import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}