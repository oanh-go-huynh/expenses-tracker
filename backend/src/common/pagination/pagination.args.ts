import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 0, description: 'Offset for pagination' })
  @Min(0)
  offset = 0;

  @Field(() => Int, { defaultValue: 10, description: 'Limit for pagination' })
  @Min(1)
  @Max(50) 
  limit = 10;
}