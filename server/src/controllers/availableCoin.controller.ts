import { CacheInterceptor, CacheKey, CacheTTL, Controller, Get, UseInterceptors } from '@nestjs/common';
import { AvailableCoin } from 'src/types/availableCoin';

import { CoinService } from '../services/coin.service';

@Controller('available-coins')
@UseInterceptors(CacheInterceptor)
export class AvailableCoinController {
  constructor(private readonly coinService: CoinService) {}

  @CacheKey('available_coins')
  @CacheTTL(3600)
  @Get()
  getAvailableCoins(): Promise<AvailableCoin[]> {
    return this.coinService.getAvailable();
  }
}
