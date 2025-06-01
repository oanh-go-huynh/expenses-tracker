import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

export enum ExpenseSortField {
  DATE = 'date',
  AMOUNT = 'amount',
  NAME = 'name',
  CREATED_AT = 'createdAt',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(ExpenseSortField, {
  name: 'ExpenseSortField',
  description: 'Fields to sort expenses by',
});

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Sort direction (ascending or descending)',
});

@InputType()
export class ExpenseSortInput {
  @Field(() => ExpenseSortField, { nullable: true }) 
  @IsOptional() 
  @IsEnum(ExpenseSortField)
  field?: ExpenseSortField; 

  @Field(() => SortDirection, { nullable: true }) 
  @IsOptional() 
  @IsEnum(SortDirection)
  direction?: SortDirection;
}