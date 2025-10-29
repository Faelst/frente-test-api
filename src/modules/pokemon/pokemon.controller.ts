import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FetchSkillsByPokemonNameUseCase } from './use-cases/fetch-skills-by-pokemon-name.usecase';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pokemon')
export class PokemonController {
  constructor(
    private readonly FetchSkillsByPokemonNameUseCase: FetchSkillsByPokemonNameUseCase,
  ) {}

  @Get('fetch-skills-by-pokemon-name-order-by-skill-name/:name')
  fetchSkillsByPokemonNameOrderBySkillName(@Param('name') name: string) {
    return this.FetchSkillsByPokemonNameUseCase.execute(name);
  }
}
