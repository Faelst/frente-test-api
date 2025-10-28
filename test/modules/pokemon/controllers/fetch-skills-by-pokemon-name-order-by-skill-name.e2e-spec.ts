import * as requestNs from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as nockNs from 'nock';
import { AppModule } from '../../../../src/app.module';

const request = (requestNs as unknown as any).default ?? requestNs;
const nock = (nockNs as unknown as any).default ?? nockNs;

describe('PokemonController (E2E with nock)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('GET /fetch-skills-by-pokemon-name-order-by-skill-name/:name -> retorna habilidades ordenadas', async () => {
    nock('https://pokeapi.co')
      .get('/api/v2/pokemon/pikachu')
      .reply(200, {
        abilities: [
          { ability: { name: 'static' } },
          { ability: { name: 'lightning-rod' } },
          { ability: { name: 'volt-absorb' } },
        ],
      });

    const res = await request(app.getHttpServer())
      .get('/pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/pikachu')
      .expect(200);

    expect(res.body).toEqual({
      pokemon: 'pikachu',
      abilities: ['lightning-rod', 'static', 'volt-absorb'],
    });
  });

  it('GET .../:name -> retorna lista vazia quando pokeapi retorna sem habilidades', async () => {
    nock('https://pokeapi.co')
      .get('/api/v2/pokemon/missingno')
      .reply(200, { abilities: [] });

    const res = await request(app.getHttpServer())
      .get(
        '/pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/missingno',
      )
      .expect(200);

    expect(res.body).toEqual({
      pokemon: 'missingno',
      abilities: [],
    });
  });

  it('GET .../:name -> retorna 400 quando pokeapi falha', async () => {
    nock('https://pokeapi.co')
      .get('/api/v2/pokemon/charmander')
      .replyWithError('network error');

    const res = await request(app.getHttpServer())
      .get(
        '/pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/charmander',
      )
      .expect(400);

    expect(res.body.statusCode).toBe(400);
  });
});
