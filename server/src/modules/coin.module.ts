import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as redisStore from 'cache-manager-ioredis';

// Controllers
import { CoinController } from '../controllers/coin.controller';
import { AvailableCoinController } from '../controllers/availableCoin.controller';

// Services
import { CoinService } from '../services/coin.service';
import { QuoteGateway } from '../gateways/quote.gateway';

// Entities
import { Coin } from '../entities/coin.entity'
import { CoinMeta } from 'src/entities/coinMeta.entity';
import { Quote } from 'src/entities/quote.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Coin,
      CoinMeta,
      Quote,
    ]),
    HttpModule.register({
      baseURL: process.env.BALKANEUM_API_BASE_URL,
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      db: process.env.REDIS_DB,
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  controllers: [
    CoinController,
    AvailableCoinController,
  ],
  providers: [
    CoinService,
    QuoteGateway,
  ],
})
export class CoinModule {}
