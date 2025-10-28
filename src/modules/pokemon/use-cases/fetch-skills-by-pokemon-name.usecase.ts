import { Injectable } from '@nestjs/common';
import { PokeApiService } from '../../../lib/poke-api.service';

@Injectable()
export class FetchSkillsByPokemonNameUseCase {
  constructor(private readonly pokeApiService: PokeApiService) {}

  async execute(name: string): Promise<any> {
    const abilities = await this.pokeApiService.getSkillsByPokemonName(name);

    const abilitiesOrderByName = abilities.sort((a, b) =>
      a.ability.name.localeCompare(b.ability.name),
    );

    return {
      pokemon: name,
      abilities: abilitiesOrderByName.map((ability) => ability.ability.name),
    };
  }
}
