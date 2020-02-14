import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Coin } from './coin.entity';

@Entity()
export class Quote {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'numeric' })
    price: number;

    @Column({ type: 'numeric' })
    volume: number;

    @Column({ type: 'numeric' })
    marketCap: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(type => Coin, coin => coin.quotes)
    coin: Coin
};