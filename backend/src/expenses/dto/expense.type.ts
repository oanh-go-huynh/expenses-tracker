import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { Category, Currency } from '@prisma/client';

registerEnumType(Category, {
  name: 'Category',
  description: 'The categories for an expense',
});

registerEnumType(Currency, {
  name: 'Currency',
  description: 'The supported currencies for an expense',
});

@ObjectType()
export class Expense {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  amount: number;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => Category, { nullable: true })
  category: Category | null;

  @Field(() => Currency, { nullable: true })
  currency: Currency | null;

  @Field()
  createdAt: Date;
  
  @Field()
  updatedAt: Date;
}