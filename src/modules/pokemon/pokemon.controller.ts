import { Controller, Get, Param } from '@nestjs/common';
import { FetchSkillsByPokemonNameUseCase } from './use-cases/fetch-Skills-by-pokemon-name.usecase';

@Controller()
export class PokemonController {
  constructor(
    private readonly fetchSkillsByPokemonNameUseCase: FetchSkillsByPokemonNameUseCase,
  ) {}

  @Get('fetch-skills-by-pokemon-name-order-by-skill-name/:name')
  fetchSkillsByPokemonNameOrderBySkillName(@Param('name') name: string) {
    return this.fetchSkillsByPokemonNameUseCase.execute(name);
  }
}
