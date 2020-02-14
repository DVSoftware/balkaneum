import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn
} from 'typeorm';

import { Coin } from './coin.entity';

@Entity()
export class CoinMeta {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({length: 128})
    logo: string;

    @Column('jsonb')
    urls: JSON;

    @OneToOne(type => Coin, coin => coin.meta)
    @JoinColumn()
    coin: Coin;
};