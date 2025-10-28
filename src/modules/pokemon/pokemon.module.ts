import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokeApiService } from '../../lib/poke-api.service';
import { FetchSkillsByPokemonNameUseCase } from './use-cases/fetch-Skills-by-pokemon-name.usecase';

@Module({
  imports: [],
  controllers: [PokemonController],
  providers: [PokeApiService, FetchSkillsByPokemonNameUseCase],
})
export class PokemonModule {}
