import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ExpensesService } from './expenses.service';
import { Expense } from './dto/expense.type';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client'; 
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ExpenseFilterInput } from './dto/expense-filter.input';
import { ExpenseSortInput } from './dto/expense-sort.input';
import { PaginatedExpenses } from './dto/paginated-expenses.type';


@Resolver(() => Expense)
@UseGuards(JwtAuthGuard) 
export class ExpensesResolver {
  constructor(private readonly expensesService: ExpensesService) {}

  @Mutation(() => Expense, { description: 'Create a new expense' })
  async createExpense(
    @CurrentUser() user: PrismaUser,
    @Args('createExpenseInput') createExpenseInput: CreateExpenseInput,
  ): Promise<Expense> {
    return this.expensesService.create(user.id, createExpenseInput);
  }

  @Mutation(() => Expense, { description: 'Update an existing expense' })
  async updateExpense(
    @CurrentUser() user: PrismaUser,
    @Args('updateExpenseInput') updateExpenseInput: UpdateExpenseInput,
  ): Promise<Expense> {
    return this.expensesService.update(user.id, updateExpenseInput);
  }

  @Mutation(() => Boolean, { description: 'Delete an expense by ID' })
  async deleteExpense(
    @CurrentUser() user: PrismaUser,
    @Args('id', { type: () => String }) id: string, 
  ): Promise<boolean> {
    return this.expensesService.delete(user.id, id);
  }

  @Query(() => PaginatedExpenses, { name: 'expenses', description: 'Get a list of expenses with pagination, filtering, and sorting' })
  async getExpenses(
    @CurrentUser() user: PrismaUser,
    @Args() paginationArgs: PaginationArgs,
    @Args('filter', { type: () => ExpenseFilterInput, nullable: true }) filter?: ExpenseFilterInput,
    @Args('sort', { type: () => ExpenseSortInput, nullable: true }) sort?: ExpenseSortInput,
  ) {
    return this.expensesService.findAll(user.id, paginationArgs, filter, sort);
  }

  @Query(() => Expense, { name: 'expense', description: 'Get a single expense by ID' })
  async getExpense(
    @CurrentUser() user: PrismaUser,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Expense> {
    return this.expensesService.findOne(user.id, id);
  }
}