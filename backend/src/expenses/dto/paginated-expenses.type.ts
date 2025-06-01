import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination/pagination.type'; 
import { Expense } from './expense.type';

@ObjectType()
export class PaginatedExpenses extends Paginated(Expense) {}