import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PokeApiService {
  private readonly apiUrl: string = 'https://pokeapi.co/api/v2';
  private readonly apiInstace: AxiosInstance;

  constructor() {
    this.apiInstace = axios.create({
      baseURL: this.apiUrl,
    });
  }

  async getSkillsByPokemonName(name: string): Promise<any> {
    try {
      const response = await this.apiInstace.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`,
      );

      return response.data.abilities;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch Pokémon: ${error.message}`,
      );
    }
  }
}
