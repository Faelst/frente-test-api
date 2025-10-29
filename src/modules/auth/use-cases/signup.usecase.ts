import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from '../auth.repository';

type Input = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Output = { success: boolean };

@Injectable()
export class SignUpUseCase {
  private readonly rounds = 10;

  constructor(private readonly authRepository: AuthRepository) {}

  async execute({
    name,
    email,
    password,
    confirmPassword,
  }: Input): Promise<Output> {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const exists = await this.authRepository.findByEmail(email);

    if (exists) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(password, this.rounds);

    await this.authRepository.createUser({ name, email, passwordHash });

    return { success: true };
  }
}
