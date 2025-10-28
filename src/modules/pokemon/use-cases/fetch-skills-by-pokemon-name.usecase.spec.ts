import { PokeApiService } from '../../../lib/poke-api.service';
import { FetchSkillsByPokemonNameUseCase } from './fetch-skills-by-pokemon-name.usecase';

type AbilityEntry = {
  ability: { name: string; url?: string };
  is_hidden?: boolean;
  slot?: number;
};

describe('FetchSkillsByPokemonNameUseCase', () => {
  let sut: FetchSkillsByPokemonNameUseCase;
  let pokeApiService: jest.Mocked<PokeApiService>;

  beforeEach(() => {
    pokeApiService = {
      getSkillsByPokemonName: jest.fn(),
    } as unknown as jest.Mocked<PokeApiService>;

    sut = new FetchSkillsByPokemonNameUseCase(pokeApiService);
    jest.clearAllMocks();
  });

  it('deve ordenar as habilidades por nome e mapear apenas os nomes', async () => {
    const input: AbilityEntry[] = [
      { ability: { name: 'static' } },
      { ability: { name: 'lightning-rod' } },
      { ability: { name: 'volt-absorb' } },
    ];
    pokeApiService.getSkillsByPokemonName.mockResolvedValueOnce(input as any);

    const result = await sut.execute('pikachu');

    expect(result).toEqual({
      pokemon: 'pikachu',
      abilities: ['lightning-rod', 'static', 'volt-absorb'], // ordem alfabética
    });
  });

  it('deve chamar o PokeApiService com o nome do pokémon recebido', async () => {
    pokeApiService.getSkillsByPokemonName.mockResolvedValueOnce([] as any);

    await sut.execute('bulbasaur');

    expect(pokeApiService.getSkillsByPokemonName).toHaveBeenCalledTimes(1);
    expect(pokeApiService.getSkillsByPokemonName).toHaveBeenCalledWith(
      'bulbasaur',
    );
  });

  it('deve retornar lista vazia quando o serviço retorna sem habilidades', async () => {
    pokeApiService.getSkillsByPokemonName.mockResolvedValueOnce([] as any);

    const result = await sut.execute('missingno');

    expect(result).toEqual({
      pokemon: 'missingno',
      abilities: [],
    });
  });

  it('deve propagar erro quando o serviço falhar', async () => {
    pokeApiService.getSkillsByPokemonName.mockRejectedValueOnce(
      new Error('network'),
    );

    await expect(sut.execute('charmander')).rejects.toThrow('network');
  });
});
