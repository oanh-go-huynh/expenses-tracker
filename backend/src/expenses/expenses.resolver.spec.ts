import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesResolver } from './expenses.resolver';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as PrismaUser, Expense as PrismaExpense, Category, Currency } from '@prisma/client'; 
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ExpenseFilterInput } from './dto/expense-filter.input';
import { ExpenseSortInput, ExpenseSortField, SortDirection } from './dto/expense-sort.input'; 

const mockUserId = 'user123';
const mockCurrentUser: PrismaUser = {
  id: mockUserId,
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
};
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
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaginatedExpenses = {
    items: [mockExpense],
    totalCount: 1,
    limit: 10, 
    offset: 0, 
};

const mockExpensesService = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true), 
};

describe('ExpensesResolver', () => {
  let resolver: ExpensesResolver;
  let service: typeof mockExpensesService;

  beforeEach(async () => {
    jest.clearAllMocks(); 

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesResolver,
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) 
      .useValue(mockJwtAuthGuard)
      .compile();

    resolver = module.get<ExpensesResolver>(ExpensesResolver);
    service = module.get(ExpensesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createExpense', () => {
    const createInput: CreateExpenseInput = {
      name: 'New Item',
      amount: 10.00,
      description: 'Test purchase',
      date: '2024-05-25T12:00:00Z',
      category: Category.OTHER, 
      currency: Currency.EUR, 
    };

    it('should create a new expense', async () => {
      service.create.mockResolvedValue(mockExpense);
      const result = await resolver.createExpense(mockCurrentUser, createInput);
      expect(result).toEqual(mockExpense);
      expect(service.create).toHaveBeenCalledWith(mockUserId, createInput);
    });
  });

  describe('updateExpense', () => {
    const updateInput: UpdateExpenseInput = {
      id: mockExpenseId,
      amount: 15.00,
      category: Category.TRANSPORTATION, 
    };

    const updatedExpense: PrismaExpense = { ...mockExpense, amount: 15.00, category: Category.TRANSPORTATION };


    it('should update an existing expense', async () => {
      service.update.mockResolvedValue(updatedExpense);
      const result = await resolver.updateExpense(mockCurrentUser, updateInput);
      expect(result).toEqual(updatedExpense);
      expect(service.update).toHaveBeenCalledWith(mockUserId, updateInput);
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense', async () => {
      service.delete.mockResolvedValue(true);
      const result = await resolver.deleteExpense(mockCurrentUser, mockExpenseId);
      expect(result).toBe(true);
      expect(service.delete).toHaveBeenCalledWith(mockUserId, mockExpenseId);
    });
  });

  describe('getExpenses', () => {
    const pagination: PaginationArgs = { offset: 0, limit: 10 };
    const filter: ExpenseFilterInput = { category: Category.FOOD }; 
    const sort: ExpenseSortInput = { field: ExpenseSortField.DATE, direction: SortDirection.DESC };

    it('should return a list of expenses with pagination, filter, and sort', async () => {
      service.findAll.mockResolvedValue(mockPaginatedExpenses);
      const result = await resolver.getExpenses(mockCurrentUser, pagination, filter, sort);

      expect(result).toEqual({
        items: mockPaginatedExpenses.items,
        totalCount: mockPaginatedExpenses.totalCount,
        limit: mockPaginatedExpenses.limit,
        offset: mockPaginatedExpenses.offset,
      });
      expect(service.findAll).toHaveBeenCalledWith(mockUserId, pagination, filter, sort);
    });

    it('should return a list of expenses with default args for filter and sort', async () => {
      service.findAll.mockResolvedValue(mockPaginatedExpenses);
      const result = await resolver.getExpenses(mockCurrentUser, pagination, undefined, undefined);
       expect(result).toEqual({
        items: mockPaginatedExpenses.items,
        totalCount: mockPaginatedExpenses.totalCount,
        limit: mockPaginatedExpenses.limit,
        offset: mockPaginatedExpenses.offset,
      });
      expect(service.findAll).toHaveBeenCalledWith(mockUserId, pagination, undefined, undefined);
    });
  });

  describe('getExpense', () => {
    it('should return a single expense by ID', async () => {
      service.findOne.mockResolvedValue(mockExpense);
      const result = await resolver.getExpense(mockCurrentUser, mockExpenseId);
      expect(result).toEqual(mockExpense);
      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockExpenseId);
    });
  });
});