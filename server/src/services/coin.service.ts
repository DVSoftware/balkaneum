
import { Repository } from 'typeorm';
import { sortedUniqBy } from 'lodash';

import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';


// TODO: change to DTO
import { AvailableCoin } from 'src/types/availableCoin';
import { CreateCoinDto } from 'src/dtos/create-coin.dto';

// Entities
import { Coin } from 'src/entities/coin.entity';
import { CoinMeta } from 'src/entities/coinMeta.entity';
import { Quote } from 'src/entities/quote.entity';
import { QuoteGateway } from 'src/gateways/quote.gateway';


@Injectable()
export class CoinService {
  private readonly logger = new Logger(CoinService.name);

  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,

    @InjectRepository(CoinMeta)
    private readonly coinMetaRepository: Repository<CoinMeta>,

    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,

    private readonly httpService: HttpService,
    private readonly quoteGateway: QuoteGateway,
  ) {}

  findAll(): Promise<Coin[]> {
    return this.coinRepository.find();
  }

  async findOne(slug: string): Promise<Coin> {
    const coin = await this.coinRepository.findOne({
      slug,
    });

    const quotes = await this.quoteRepository.find({
      where: {
        coin
      },
      take: 8,
      order: {
        createdAt: 'DESC',
      },
    });

    coin.quotes = quotes;
    return coin;
  }

  async create({ symbol }: CreateCoinDto): Promise<Coin> {
    const [balkaneumCoin, balkaneumCoinMeta] = await Promise.all([
      this.httpService.get(`cryptocurrency/${symbol}`)
        .toPromise()
        .then((response) => response.data),
      this.httpService.get(`cryptocurrency/${symbol}/metadata`)
        .toPromise()
        .then((response) => response.data[0]), // It's strange that the route returns an array
    ])

    const coin = this.coinRepository.create({
      name: balkaneumCoin.name,
      slug: balkaneumCoin.slug,
      symbol: balkaneumCoin.symbol,
      rank: balkaneumCoin.cmc_rank,
      meta: {
        logo: balkaneumCoinMeta.logo,
        urls: balkaneumCoinMeta.urls,
      }
    });

    return this.coinRepository.save(coin);
  }

  getAvailable(): Promise<AvailableCoin[]> {
    const availableCoins = [];
    return new Promise(async (resolve, reject) => {
      // Get all available coins so we can list them in the dropdown
      let page = 1;
      while (true) {
        try {
          const response = await this.httpService.get('cryptocurrency', {
            params: { page }
          })
            .toPromise()
            .then((res) => res.data
              .map((data) => ({
                id: data.id,
                name: data.name,
                symbol: data.symbol,
                cmc_rank: data.cmc_rank,
                quote: {
                  USD: data.quote.USD
                }
              }))
            );

          if (response.length === 0) {
            return resolve(sortedUniqBy(availableCoins, 'symbol'));
          }

          availableCoins.push(...response);

          page += 100;
        } catch(error) {
          return reject(error);
        }
      }
    });
  }

  @Cron('0 */5 * * * *')
  async fetchQuotes() {
    const coins = await this.findAll();

    return Promise.all(
      coins.map(async (coin) => {
        try {
          const {
            quote: {
              USD: {
                price,
                volume_24h: volume,
                market_cap: marketCap,
              }
            }
          } = await this.httpService.get(`cryptocurrency/${coin.symbol}`)
            .toPromise()
            .then((response) => response.data);

          const quote = this.quoteRepository.create({
            price,
            volume,
            marketCap,
            coin,
          });

          await this.quoteRepository.save(quote);

          this.quoteGateway.emitQuote(quote);

          return quote;
        } catch (error) {
          this.logger.error(`Failed to get quote for ${coin.symbol}.`, error);
        }
      })
    );
  }
}
