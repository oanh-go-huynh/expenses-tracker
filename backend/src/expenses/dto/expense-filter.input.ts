import { InputType, Field, Float } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { Category, Currency } from '@prisma/client';

@InputType()
export class ExpenseFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Category, { nullable: true })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @Field(() => Currency, { nullable: true })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;
  
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}