import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInUseCase } from './signin.usecase';
import { AuthRepository } from '../auth.repository';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let repo: jest.Mocked<AuthRepository>;
  let jwt: jest.Mocked<JwtService>;

  const userFixture = {
    id: 'u1',
    name: 'Rafael',
    email: 'rafael@example.com',
    passwordHash: 'hashed',
  };

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      createUser: jest.fn(), // não usado aqui, mas mantém a shape
    } as unknown as jest.Mocked<AuthRepository>;

    jwt = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    useCase = new SignInUseCase(repo, jwt);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('deve lançar UnauthorizedException quando usuário não existe', async () => {
    repo.findByEmail.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ email: 'no@user.com', password: '123456' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

    expect(repo.findByEmail).toHaveBeenCalledWith('no@user.com');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('deve lançar UnauthorizedException quando senha está incorreta', async () => {
    repo.findByEmail.mockResolvedValueOnce(userFixture);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      useCase.execute({ email: userFixture.email, password: 'wrong' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

    expect(repo.findByEmail).toHaveBeenCalledWith(userFixture.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'wrong',
      userFixture.passwordHash,
    );
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('deve retornar token, name e email quando as credenciais são válidas', async () => {
    repo.findByEmail.mockResolvedValueOnce(userFixture);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    jwt.signAsync.mockResolvedValueOnce('jwt-token');

    const result = await useCase.execute({
      email: userFixture.email,
      password: '123456',
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      '123456',
      userFixture.passwordHash,
    );
    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: userFixture.id, email: userFixture.email },
      { secret: process.env.JWT_SECRET },
    );
    expect(result).toEqual({
      token: 'jwt-token',
      name: userFixture.name,
      email: userFixture.email,
    });
  });

  it('deve propagar erro inesperado do repositório', async () => {
    repo.findByEmail.mockRejectedValueOnce(new Error('db down'));

    await expect(
      useCase.execute({ email: userFixture.email, password: '123456' }),
    ).rejects.toThrow('db down');

    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('deve propagar erro inesperado do jwt.signAsync', async () => {
    repo.findByEmail.mockResolvedValueOnce(userFixture);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    jwt.signAsync.mockRejectedValueOnce(new Error('jwt fail'));

    await expect(
      useCase.execute({ email: userFixture.email, password: '123456' }),
    ).rejects.toThrow('jwt fail');
  });
});
