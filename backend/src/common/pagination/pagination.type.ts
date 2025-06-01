import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function Paginated<T>(ItemType: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [ItemType], { nullable: 'items' })
    items: T[];

    @Field(() => Int)
    totalCount: number;

    @Field(() => Int)
    offset: number;

    @Field(() => Int)
    limit: number;
  }
  return PaginatedType;
}