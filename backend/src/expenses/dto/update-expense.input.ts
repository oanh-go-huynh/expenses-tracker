import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { Category, Currency } from '@prisma/client';

@InputType()
export class UpdateExpenseInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  date?: string;

  @Field(() => Category, { nullable: true })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @Field(() => Currency, { nullable: true })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}