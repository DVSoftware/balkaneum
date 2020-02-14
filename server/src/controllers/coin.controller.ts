import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CoinService } from '../services/coin.service';
import { Coin } from 'src/entities/coin.entity';
import { CreateCoinDto } from 'src/dtos/create-coin.dto';


@Controller('coins')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get()
  getCoins(): Promise<Coin[]> {
    return this.coinService.findAll();
  }

  @Get(':slug')
  getCoin(@Param() { slug }): Promise<Coin> {
    return this.coinService.findOne(slug);
  }

  @Post()
  create(@Body() data: CreateCoinDto): Promise<Coin> {
    return this.coinService.create(data);
  }
}
