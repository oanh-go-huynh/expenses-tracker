import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Category, Currency } from '@prisma/client';

@InputType()
export class CreateExpenseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsDateString()
  date: string;

  @Field(() => Category, { nullable: true })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @Field(() => Currency, { nullable: true })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}