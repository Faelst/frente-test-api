import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, PokemonModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
