import { ConnectionOptions } from "typeorm";

import { Coin } from "src/entities/coin.entity";
import { CoinMeta } from "src/entities/coinMeta.entity";
import { Quote } from "src/entities/quote.entity";

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST,
    port: parseInt(process.env.POSTGRESQL_PORT, 10),
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    entities: [
        Coin,
        CoinMeta,
        Quote,
    ],
    synchronize: true,
    migrationsRun: false,
    logging: true,
    logger: 'advanced-console',
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations'
    }
}

export = config;