import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { User as PrismaUser } from '@prisma/client'; 

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, 
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const mockUser: PrismaUser = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: null, // As per schema
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.user.findUnique.mockResolvedValue(mockUser); 

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found by email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found by ID', async () => {
      const mockUser: PrismaUser = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('user1');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user1' },
      });
    });

    it('should return null if user not found by ID', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const newUser: PrismaUser = {
        id: 'newUserId',
        email: 'new@example.com',
        password: 'newHashedPassword',
        name: 'New User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.user.create.mockResolvedValue(newUser);

      const result = await service.create('new@example.com', 'newHashedPassword', 'New User');
      expect(result).toEqual(newUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          password: 'newHashedPassword',
          name: 'New User',
        },
      });
    });
  });
});