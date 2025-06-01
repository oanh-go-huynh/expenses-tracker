import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User as PrismaUser } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

const mockUsersService = {
  findById: jest.fn(),
};

const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true), 
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: typeof mockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) 
      .useValue(mockJwtAuthGuard)
      .compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getMe', () => {
    const mockCurrentUser: PrismaUser = {
      id: 'mockUserId',
      email: 'mock@example.com',
      password: 'hashedpassword',
      name: 'Mock User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return the authenticated user', async () => {
      usersService.findById.mockResolvedValue(mockCurrentUser); 

      const result = await resolver.getMe(mockCurrentUser);
      expect(result).toEqual(mockCurrentUser);
      expect(usersService.findById).toHaveBeenCalledWith(mockCurrentUser.id);
    });

    it('should throw NotFoundException if user not found in DB', async () => {
      usersService.findById.mockResolvedValue(null); 

      await expect(resolver.getMe(mockCurrentUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(usersService.findById).toHaveBeenCalledWith(mockCurrentUser.id);
    });
  });
});