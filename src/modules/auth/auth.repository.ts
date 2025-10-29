import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });
  }

  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    const created = await this.prisma.user.create({
      data: input,
      select: { id: true },
    });
    return created;
  }
}
