import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string; 
}