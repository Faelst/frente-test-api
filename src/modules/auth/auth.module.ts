import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SignUpUseCase } from './use-cases/signup.usecase';
import { SignInUseCase } from './use-cases/signin.usecase';
import { AuthRepository } from './auth.repository';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    SignUpUseCase,
    SignInUseCase,
    AuthRepository,
  ],
})
export class AuthModule {}
