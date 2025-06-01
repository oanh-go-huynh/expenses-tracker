import { Test, TestingModule } from '@nestjs/testing';
import { PasswordUtils } from './password.utils';
import * as bcrypt from 'bcryptjs'; 

jest.mock('bcryptjs', () => ({
  hash: jest.fn((password, saltRounds) => `hashed_${password}_${saltRounds}`),
  compare: jest.fn((password, hash) => Promise.resolve(hash === `hashed_${password}_10`)),
}));

describe('PasswordUtils', () => {
  let passwordUtils: PasswordUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordUtils],
    }).compile();

    passwordUtils = module.get<PasswordUtils>(PasswordUtils);
  });

  it('should be defined', () => {
    expect(passwordUtils).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash the password using bcrypt', async () => {
      const password = 'mySecretPassword';
      const hashedPassword = await passwordUtils.hashPassword(password);
      expect(hashedPassword).toBe('hashed_mySecretPassword_10'); 
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'mySecretPassword';
      const hash = 'hashed_mySecretPassword_10';
      const result = await passwordUtils.comparePassword(password, hash);
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'wrongPassword';
      const hash = 'hashed_mySecretPassword_10';
      const result = await passwordUtils.comparePassword(password, hash);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });
  });
});