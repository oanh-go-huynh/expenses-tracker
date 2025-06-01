import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Expense as PrismaExpense, Category, Currency } from '@prisma/client'; 
import Redis from 'ioredis';
import { NotFoundException } from '@nestjs/common';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ExpenseSortField, SortDirection } from './dto/expense-sort.input'; 
import { ExpenseFilterInput } from './dto/expense-filter.input';


const mockUserId = 'user123';
const mockExpenseId = 'expense456';
const mockExpense: PrismaExpense = {
  id: mockExpenseId,
  userId: mockUserId,
  name: 'Groceries',
  amount: 50.00,
  description: 'Weekly grocery shopping',
  date: new Date('2024-05-20T10:00:00Z'),
  category: Category.FOOD, 
  currency: Currency.USD, 
  createdAt: new Date('2024-05-20T10:00:00Z'),
  updatedAt: new Date('2024-05-20T10:00:00Z'),
};
const mockExpenses: PrismaExpense[] = [
  mockExpense,
  { ...mockExpense, id: 'expense457', name: 'Dinner', amount: 75.00, date: new Date('2024-05-21T18:00:00Z'), category: Category.FOOD, currency: Currency.USD, createdAt: new Date(), updatedAt: new Date() },
  { ...mockExpense, id: 'expense458', name: 'Bus Fare', amount: 2.50, date: new Date('2024-05-19T08:00:00Z'), category: Category.TRANSPORTATION, currency: Currency.USD, createdAt: new Date(), updatedAt: new Date() },
];

const mockPrismaService = {
  expense: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn((promises: any[]) => Promise.all(promises)),
};

const mockRedisClient = {
  get: jest.fn<Promise<string | null>, [string]>(),
  setex: jest.fn<Promise<'OK'>, [string, number, string]>(),
  keys: jest.fn<Promise<string[]>, [string]>().mockResolvedValue([]),
  del: jest.fn<Promise<number>, [string | string[] | readonly string[]]>(),
};

describe('ExpensesService', () => {
  let service: ExpensesService;
  let prisma: typeof mockPrismaService;
  let redis: typeof mockRedisClient;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    prisma = module.get(PrismaService);
    redis = module.get('REDIS_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInput: CreateExpenseInput = {
      name: 'New Shirt',
      amount: 25.99,
      description: 'Bought a new shirt',
      date: '2024-05-25T12:00:00Z',
      category: Category.OTHER, 
      currency: Currency.EUR, 
    };
    const createdExpense: PrismaExpense = { 
        ...mockExpense, 
        id: 'newId', 
        name: createInput.name,
        amount: createInput.amount,
        description: createInput.description,
        date: new Date(createInput.date!), 
        category: createInput.category!,
        currency: createInput.currency!,
        userId: mockUserId 
    };

    it('should create a new expense and invalidate cache', async () => {
      prisma.expense.create.mockResolvedValue(createdExpense);
      redis.keys.mockResolvedValueOnce([`expenses:${mockUserId}:key1`]);
      redis.del.mockResolvedValueOnce(1);

      const result = await service.create(mockUserId, createInput);
      expect(result).toEqual(createdExpense);
      expect(prisma.expense.create).toHaveBeenCalledWith({
        data: {
          name: createInput.name,
          amount: createInput.amount,
          description: createInput.description,
          date: new Date(createInput.date!),
          category: createInput.category, 
          currency: createInput.currency,
          userId: mockUserId,
        },
      });
      expect(redis.keys).toHaveBeenCalledWith(`expenses:${mockUserId}:*`);
      expect(redis.del).toHaveBeenCalledWith(`expenses:${mockUserId}:key1`);
    });

    it('should use current date if date not provided in input', async () => {
        const inputWithoutDate: CreateExpenseInput = { ...createInput, date: undefined! }; 
        const mockDate = new Date(); 
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate); 

        const createdExpenseWithGeneratedDate: PrismaExpense = {
           ...createdExpense, 
           date: mockDate, 
           category: inputWithoutDate.category!,
           currency: inputWithoutDate.currency!,
        };
        prisma.expense.create.mockResolvedValue(createdExpenseWithGeneratedDate);

        await service.create(mockUserId, inputWithoutDate);
        expect(prisma.expense.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ date: mockDate })
        }));
        (global.Date as any).mockRestore(); 
    });
  });

  describe('update', () => {
    const updateInputForTest: UpdateExpenseInput = {
      id: mockExpenseId,
      amount: 60.00,
      description: 'Updated description',
      category: Category.FOOD, 
    };
     const updateInputWithDate: UpdateExpenseInput = {
        id: mockExpenseId,
        amount: 60.00,
        description: 'Updated description',
        date: '2024-05-25T12:00:00Z', 
        currency: Currency.GBP, 
    };
    const updatedExpenseBase = { ...mockExpense, amount: 60.00, description: 'Updated description', category: Category.FOOD };

    it('should update an existing expense and invalidate cache', async () => {
      prisma.expense.findUnique.mockResolvedValue(mockExpense);
      const finalUpdatedExpense = { ...updatedExpenseBase, date: mockExpense.date, currency: mockExpense.currency }; 
      prisma.expense.update.mockResolvedValue(finalUpdatedExpense);
      redis.keys.mockResolvedValueOnce([`expenses:${mockUserId}:key2`]);
      redis.del.mockResolvedValueOnce(1);

      const { id, ...updateDataForPrisma } = updateInputForTest; 
      const result = await service.update(mockUserId, updateInputForTest); 
      expect(result).toEqual(finalUpdatedExpense);
      expect(prisma.expense.findUnique).toHaveBeenCalledWith({ where: { id: mockExpenseId } });
      expect(prisma.expense.update).toHaveBeenCalledWith({
        where: { id: mockExpenseId },
        data: {
          ...updateDataForPrisma,
          date: mockExpense.date, 
        },
      });
      expect(redis.keys).toHaveBeenCalledWith(`expenses:${mockUserId}:*`);
      expect(redis.del).toHaveBeenCalledWith(`expenses:${mockUserId}:key2`);
    });

     it('should update an existing expense with new date if provided in input', async () => {
      prisma.expense.findUnique.mockResolvedValue(mockExpense);
      const updatedExpenseWithNewDate: PrismaExpense = {
        ...mockExpense, 
        amount: updateInputWithDate.amount!,
        description: updateInputWithDate.description!,
        date: new Date(updateInputWithDate.date!),
        currency: updateInputWithDate.currency!, 
        category: mockExpense.category, 
      };
      prisma.expense.update.mockResolvedValue(updatedExpenseWithNewDate);
      redis.keys.mockResolvedValueOnce([`expenses:${mockUserId}:key_date_update`]);
      redis.del.mockResolvedValueOnce(1);

      const result = await service.update(mockUserId, updateInputWithDate);
      expect(result).toEqual(updatedExpenseWithNewDate);
      const { id, ...updateDataForPrismaWithDate } = updateInputWithDate;
      expect(prisma.expense.update).toHaveBeenCalledWith({
        where: { id: mockExpenseId },
        data: {
          ...updateDataForPrismaWithDate,
          date: new Date(updateDataForPrismaWithDate.date!), 
        },
      });
    });

    it('should throw NotFoundException if expense not found', async () => {
      prisma.expense.findUnique.mockResolvedValue(null);
      await expect(service.update(mockUserId, updateInputForTest)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if expense belongs to another user', async () => {
      const otherUserExpense = { ...mockExpense, userId: 'otherUser' };
      prisma.expense.findUnique.mockResolvedValue(otherUserExpense);
      await expect(service.update(mockUserId, updateInputForTest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an expense and invalidate cache', async () => {
      prisma.expense.findUnique.mockResolvedValue(mockExpense);
      prisma.expense.delete.mockResolvedValue(mockExpense); 
      redis.keys.mockResolvedValueOnce([`expenses:${mockUserId}:key3`]);
      redis.del.mockResolvedValueOnce(1);

      const result = await service.delete(mockUserId, mockExpenseId);
      expect(result).toBe(true);
    });

  });

  describe('findOne', () => {
     it('should return a single expense if found and authorized', async () => {
      prisma.expense.findUnique.mockResolvedValue(mockExpense);
      const result = await service.findOne(mockUserId, mockExpenseId);
      expect(result).toEqual(mockExpense);
      expect(prisma.expense.findUnique).toHaveBeenCalledWith({ where: { id: mockExpenseId } });
    });

    it('should throw NotFoundException if expense not found', async () => {
      prisma.expense.findUnique.mockResolvedValue(null);
      await expect(service.findOne(mockUserId, mockExpenseId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if expense belongs to another user', async () => {
      const otherUserExpense = { ...mockExpense, userId: 'otherUser' };
      prisma.expense.findUnique.mockResolvedValue(otherUserExpense);
      await expect(service.findOne(mockUserId, mockExpenseId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const pagination: PaginationArgs = { offset: 0, limit: 10 };

    it('should return paginated expenses from cache if available', async () => {
      const mockExpenseForCache = { 
          ...mockExpense,
          date: new Date(mockExpense.date), 
          createdAt: new Date(mockExpense.createdAt),
          updatedAt: new Date(mockExpense.updatedAt),
      };
      const cachedDataFromService = {
        items: [mockExpenseForCache],
        totalCount: 1,
        limit: pagination.limit,
        offset: pagination.offset,
      };
      const stringifiedCache = JSON.stringify({
          items: [{
              ...mockExpenseForCache,
              date: mockExpenseForCache.date.toISOString(),
              createdAt: mockExpenseForCache.createdAt.toISOString(),
              updatedAt: mockExpenseForCache.updatedAt.toISOString(),
          }],
          totalCount: 1,
          limit: pagination.limit, 
          offset: pagination.offset,
      });

      redis.get.mockResolvedValue(stringifiedCache);

      const result = await service.findAll(mockUserId, pagination);
      
      expect(result.items[0].date).toBeInstanceOf(Date);
      expect(result.items[0].createdAt).toBeInstanceOf(Date);
      expect(result.items[0].updatedAt).toBeInstanceOf(Date);

      // Compare other fields
      expect(result.items[0]).toMatchObject({
        ...mockExpenseForCache, // has Date objects
        date: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.totalCount).toBe(cachedDataFromService.totalCount);
      expect(result.limit).toBe(cachedDataFromService.limit);
      expect(result.offset).toBe(cachedDataFromService.offset);

      expect(redis.get).toHaveBeenCalledTimes(1);
      expect(prisma.expense.findMany).not.toHaveBeenCalled();
    });

    it('should fetch expenses from DB, cache them, and return', async () => {
      redis.get.mockResolvedValue(null);
      prisma.expense.findMany.mockResolvedValue(mockExpenses);
      prisma.expense.count.mockResolvedValue(mockExpenses.length);

      const result = await service.findAll(mockUserId, pagination);
      expect(result.items).toEqual(mockExpenses);
      expect(result.totalCount).toBe(mockExpenses.length);
      expect(result.limit).toBe(pagination.limit);
      expect(result.offset).toBe(pagination.offset);
      expect(redis.get).toHaveBeenCalledTimes(1);
      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId },
          skip: 0,
          take: 10,
          orderBy: { date: 'desc' },
        }),
      );
      expect(prisma.expense.count).toHaveBeenCalledWith({ where: { userId: mockUserId } });
      expect(redis.setex).toHaveBeenCalledTimes(1);
      const expectedCacheContent = {
        items: mockExpenses.map(expense => ({
          ...expense,
          date: expense.date.toISOString(),
          createdAt: expense.createdAt.toISOString(),
          updatedAt: expense.updatedAt.toISOString(),
        })),
        totalCount: mockExpenses.length,
        limit: pagination.limit, 
        offset: pagination.offset, 
      };
      expect(JSON.parse(redis.setex.mock.calls[0][2])).toEqual(expectedCacheContent);

    });

    it('should apply category and currency filters', async () => {
      redis.get.mockResolvedValue(null);
      const filteredMock = mockExpenses.filter(exp => exp.category === Category.FOOD && exp.currency === Currency.USD);
      prisma.expense.findMany.mockResolvedValue(filteredMock);
      prisma.expense.count.mockResolvedValue(filteredMock.length);

      const filter: ExpenseFilterInput = { category: Category.FOOD, currency: Currency.USD }; 
      await service.findAll(mockUserId, pagination, filter);
      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { 
            userId: mockUserId, 
            category: { equals: Category.FOOD }, 
            currency: { equals: Currency.USD }  
          },
        }),
      );
    });
    
     it('should apply name filter', async () => {
      redis.get.mockResolvedValue(null);
      prisma.expense.findMany.mockResolvedValue([mockExpenses[0]]);
      prisma.expense.count.mockResolvedValue(1);

      const filter = { name: 'Groc' };
      await service.findAll(mockUserId, pagination, filter);
      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId, name: { contains: 'Groc', mode: 'insensitive' } },
        }),
      );
    });

    it('should apply amount range filter', async () => {
      redis.get.mockResolvedValue(null);
      prisma.expense.findMany.mockResolvedValue([mockExpenses[0]]);
      prisma.expense.count.mockResolvedValue(1);

      const filter = { minAmount: 40, maxAmount: 60 };
      await service.findAll(mockUserId, pagination, filter);
      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId, amount: { gte: 40, lte: 60 } },
        }),
      );
    });

    it('should apply date range filter', async () => {
        redis.get.mockResolvedValue(null);
        prisma.expense.findMany.mockResolvedValue([mockExpenses[1]]);
        prisma.expense.count.mockResolvedValue(1);

        const filter = { startDate: '2024-05-21T00:00:00Z', endDate: '2024-05-21T23:59:59Z' };
        await service.findAll(mockUserId, pagination, filter);
        expect(prisma.expense.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              userId: mockUserId,
              date: {
                gte: new Date(filter.startDate),
                lte: new Date(filter.endDate),
              },
            },
          }),
        );
    });

    it('should apply sorting by amount ascending', async () => {
      redis.get.mockResolvedValue(null);
      const sortedExpenses = [...mockExpenses].sort((a,b) => a.amount - b.amount);
      prisma.expense.findMany.mockResolvedValue(sortedExpenses);
      prisma.expense.count.mockResolvedValue(mockExpenses.length);

      const sortInput = { field: ExpenseSortField.AMOUNT, direction: SortDirection.ASC };
      await service.findAll(mockUserId, pagination, undefined, sortInput);
      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { amount: 'asc' },
        }),
      );
    });
  });
});