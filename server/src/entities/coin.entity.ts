import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    Index,
    OneToMany,
} from 'typeorm';

import { CoinMeta } from './coinMeta.entity';
import { Quote } from './quote.entity';

@Entity()
export class Coin {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ length: 6 })
    symbol: string;

    @Column({ length: 128 })
    name: string;

    @Column({ default: 0 })
    rank: number;

    @Index({ unique: true })
    @Column({ length: 16 })
    slug: string;

    @OneToOne(type => CoinMeta, coinMeta => coinMeta.coin, { cascade: true, eager: true })
    meta: CoinMeta;

    @OneToMany(type => Quote, quote => quote.coin)
    quotes: Quote[];
};