import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Expense } from '@prisma/client';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { ExpenseFilterInput } from './dto/expense-filter.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ExpenseSortInput } from './dto/expense-sort.input';
import Redis from 'ioredis';

@Injectable()
export class ExpensesService {
  private readonly CACHE_TTL_SECONDS = 60;

  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  private generateCacheKey(userId: string, paginationArgs: PaginationArgs, filter?: ExpenseFilterInput, sort?: ExpenseSortInput): string {
    const filterString = filter ? JSON.stringify(filter, Object.keys(filter).sort()) : '';
    const sortString = sort && sort.field && sort.direction ? JSON.stringify(sort, Object.keys(sort).sort()) : '';
    return `expenses:${userId}:offset=${paginationArgs.offset}:limit=${paginationArgs.limit}:filter=${filterString}:sort=${sortString}`;
  }

  private async invalidateUserExpenseCaches(userId: string): Promise<void> {
    const keys = await this.redisClient.keys(`expenses:${userId}:*`);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
      console.log(`Invalidated ${keys.length} expense cache keys for user ${userId}.`);
    }
  }

  async create(userId: string, createExpenseInput: CreateExpenseInput): Promise<Expense> {
    const { date, ...rest } = createExpenseInput;
    const newExpense = await this.prisma.expense.create({
      data: {
        ...rest,
        date: date ? new Date(date) : new Date(),
        userId,
      },
    });
    await this.invalidateUserExpenseCaches(userId);
    return newExpense;
  }

  async update(userId: string, updateExpenseInput: UpdateExpenseInput): Promise<Expense> {
    const { id, date, ...rest } = updateExpenseInput;
    const existingExpense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense || existingExpense.userId !== userId) {
      throw new NotFoundException(`Expense with ID "${id}" not found or unauthorized.`);
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id },
      data: {
        ...rest,
        date: date ? new Date(date) : existingExpense.date,
      },
    });
    await this.invalidateUserExpenseCaches(userId);
    return updatedExpense;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const existingExpense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense || existingExpense.userId !== userId) {
      throw new NotFoundException(`Expense with ID "${id}" not found or unauthorized.`);
    }

    await this.prisma.expense.delete({
      where: { id },
    });
    await this.invalidateUserExpenseCaches(userId);
    return true;
  }

  async findOne(userId: string, id: string): Promise<Expense> {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      throw new NotFoundException(`Expense with ID "${id}" not found or unauthorized.`);
    }
    return expense;
  }

  async findAll(
    userId: string,
    paginationArgs: PaginationArgs,
    filter?: ExpenseFilterInput,
    sort?: ExpenseSortInput,
  ): Promise<{ items: Expense[]; totalCount: number; limit: number; offset: number }> {
    const cacheKey = this.generateCacheKey(userId, paginationArgs, filter, sort);
    const cachedResult = await this.redisClient.get(cacheKey);

    const { offset, limit } = paginationArgs;

    if (cachedResult) {
      console.log('Serving expenses from cache:', cacheKey);
      const parsedResult = JSON.parse(cachedResult);
      
      parsedResult.items = parsedResult.items.map((item: Expense) => ({
        ...item,
        date: new Date(item.date),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return parsedResult;
    }

    const where: Prisma.ExpenseWhereInput = { userId };

    if (filter) {
      if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
      if (filter.category) where.category = { equals: filter.category };
      if (filter.currency) where.currency = { equals: filter.currency };
      if (filter.minAmount) where.amount = { gte: filter.minAmount };
      if (filter.maxAmount) where.amount = { ...where.amount as any, lte: filter.maxAmount };
      if (filter.startDate) where.date = { gte: new Date(filter.startDate) };
      if (filter.endDate) where.date = { ...where.date as any, lte: new Date(filter.endDate) };
    }

    const orderBy: Prisma.ExpenseOrderByWithRelationInput = {};
    if (sort && sort.field && sort.direction) {
      orderBy[sort.field] = sort.direction;
    } else {
      orderBy.date = 'desc';
    }

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.expense.findMany({ where, skip: offset, take: limit, orderBy }),
      this.prisma.expense.count({ where }),
    ]);

    const result = { items, totalCount, limit, offset };
    
    await this.redisClient.setex(cacheKey, this.CACHE_TTL_SECONDS, JSON.stringify(result));
    console.log('Cached expenses:', cacheKey);

    return result;
  }
}