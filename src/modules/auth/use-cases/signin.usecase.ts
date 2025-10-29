import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../auth.repository';

type Input = { email: string; password: string };
type Output = { token: string; name: string; email: string };

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute({ email, password }: Input): Promise<Output> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwt.signAsync<{ sub: string; email: string }>(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_SECRET,
      },
    );

    return { token, name: user.name, email: user.email };
  }
}
