import { Controller, Get, Param } from '@nestjs/common';
import { FetchSkillsByPokemonNameUseCase } from './use-cases/fetch-skills-by-pokemon-name.usecase';

@Controller()
export class PokemonController {
  constructor(
    private readonly FetchSkillsByPokemonNameUseCase: FetchSkillsByPokemonNameUseCase,
  ) {}

  @Get('fetch-skills-by-pokemon-name-order-by-skill-name/:name')
  fetchSkillsByPokemonNameOrderBySkillName(@Param('name') name: string) {
    return this.FetchSkillsByPokemonNameUseCase.execute(name);
  }
}
