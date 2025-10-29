import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpUseCase } from './use-cases/signup.usecase';
import { SignInUseCase } from './use-cases/signin.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return this.signUpUseCase.execute(dto);
  }

  @HttpCode(200)
  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    return this.signInUseCase.execute(dto);
  }
}
