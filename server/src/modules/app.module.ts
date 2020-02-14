import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { join } from 'path';

import { CoinModule } from './coin.module';

import * as typeOrmConfig from '../config/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    CoinModule,
  ],
})
export class AppModule {}
