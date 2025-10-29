import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignUpUseCase } from './signup.usecase';
import { AuthRepository } from '../auth.repository';

describe('SignUpUseCase', () => {
  let useCase: SignUpUseCase;
  let repo: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    useCase = new SignUpUseCase(repo);

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const baseInput = {
    name: 'Rafael',
    email: 'rafael@example.com',
    password: '123456',
    confirmPassword: '123456',
  };

  it('deve lançar BadRequestException quando as senhas não conferem', async () => {
    await expect(
      useCase.execute({ ...baseInput, confirmPassword: 'diferente' }),
    ).rejects.toThrow(new BadRequestException('Passwords do not match'));

    expect(repo.findByEmail).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(repo.createUser).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException quando o email já existe', async () => {
    repo.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      name: 'Existing',
      email: baseInput.email,
      passwordHash: 'hash',
    });

    await expect(useCase.execute(baseInput)).rejects.toThrow(
      new BadRequestException('Email already in use'),
    );

    expect(repo.findByEmail).toHaveBeenCalledWith(baseInput.email);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(repo.createUser).not.toHaveBeenCalled();
  });

  it('deve criar o usuário com senha hasheada e retornar success=true', async () => {
    repo.findByEmail.mockResolvedValueOnce(null);
    repo.createUser.mockResolvedValueOnce({ id: 'new-user-id' });

    const result = await useCase.execute(baseInput);

    // rounds default do use case = 10
    expect(bcrypt.hash).toHaveBeenCalledWith(baseInput.password, 10);
    expect(repo.createUser).toHaveBeenCalledWith({
      name: baseInput.name,
      email: baseInput.email,
      passwordHash: 'hashed-password',
    });
    expect(result).toEqual({ success: true });
  });

  it('deve propagar erro inesperado do repositório', async () => {
    repo.findByEmail.mockResolvedValueOnce(null);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-password');
    repo.createUser.mockRejectedValueOnce(new Error('db error'));

    await expect(useCase.execute(baseInput)).rejects.toThrow('db error');

    expect(repo.findByEmail).toHaveBeenCalledWith(baseInput.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(baseInput.password, 10);
    expect(repo.createUser).toHaveBeenCalled();
  });
});
