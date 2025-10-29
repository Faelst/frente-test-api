import * as requestNs from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as nockNs from 'nock';
import { AppModule } from '../../../../src/app.module';
import { JwtAuthGuard } from '../../../../src/modules/auth/guards/jwt-auth.guard';

const request = (requestNs as unknown as any).default ?? requestNs;
const nock = (nockNs as unknown as any).default ?? nockNs;

describe('PokemonController (E2E with nock & auth bypass)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterAll(async () => {
    nock.cleanAll();
    nock.enableNetConnect();
    await app.close();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('GET /pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/:name -> retorna habilidades ordenadas', async () => {
    const scope = nock('https://pokeapi.co')
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

    expect(scope.isDone()).toBe(true);
  });

  it('GET .../missingno -> lista vazia quando pokeapi retorna sem habilidades', async () => {
    const scope = nock('https://pokeapi.co')
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

    expect(scope.isDone()).toBe(true);
  });

  it('GET .../charmander -> retorna 400 quando pokeapi falha', async () => {
    const scope = nock('https://pokeapi.co')
      .get('/api/v2/pokemon/charmander')
      .replyWithError('network error');

    const res = await request(app.getHttpServer())
      .get(
        '/pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/charmander',
      )
      .expect(400);

    // estrutura básica de erro do Nest (pode variar se houver filtros globais)
    expect(res.body.statusCode).toBe(400);
    expect(scope.isDone()).toBe(true);
  });
});
