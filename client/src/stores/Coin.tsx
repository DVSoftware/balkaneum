import { types, flow, applySnapshot } from 'mobx-state-tree';
import SocketIO from 'socket.io-client';

import { notification } from 'antd';

import { defaultClient as client } from '../libs/client';

import { keyBy } from '../libs/utils';

export const Quote = types
  .model('Quote', {
    id: types.identifier,
    price: types.string,
    volume: types.string,
    marketCap: types.string,
    createdAt: types.string,
    change: types.number
  });

export const CoinMeta = types
  .model('CoinMeta', {
    id: types.identifier,
    logo: types.string,
    urls: types.frozen({}),
  });

export const Coin = types
  .model('Coin', {
    id: types.identifier,
    symbol: types.string,
    name: types.string,
    slug: types.string,
    rank: types.number,
    meta: types.maybeNull(CoinMeta),
    quotes: types.optional(types.array(Quote), []),
    loading: types.optional(types.boolean, false),
    loaded: types.optional(types.boolean, false),
  })
    .actions((self) => {
      const actions = {
        reload: flow(function* reload(symbol) {
          self.loading = true;
          try {
            const loadedCoin = (yield client.get(`/coins/${self.slug}`)).data;
            applySnapshot(self, {
              ...loadedCoin,
              quotes: loadedCoin.quotes.map((quote: typeof Quote.Type, index: number) => ({
                ...quote,
                change: calculatePreviousPercentage(quote, loadedCoin.quotes[index+1]),
              })).slice(0, 7),
            });
            self.loaded = true;
          } catch (error) {
            notification.error({
              key: 'reloadCoin',
              message: 'Unable to reload coin',
              description: error.message,
              duration: 5000,
            });
          } finally {
            self.loading = false;
          }
        }),
      }

      return actions;
    });

function calculatePreviousPercentage(current: typeof Quote.Type, previous: typeof Quote.Type | null) {
  if (!previous) {
    return 100;
  }
  const currentValue = parseFloat(current.price);
  const previousValue = parseFloat(previous.price);
  const diff = currentValue - previousValue;
  
  return diff / previousValue * 100;
}

export const CoinStore = types
  .model('CoinStore', {
    coins: types.optional(types.array(Coin), []),
    fetched: types.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
    error: types.optional(types.boolean, false),
    adding: types.optional(types.boolean, false),
  })
  .views((self) => {
    const views = {
      get byId() {
        return keyBy(self.coins, 'id');
      },
      get bySlug() {
        return keyBy(self.coins, 'slug');
      }
    };

    return views;
  })
  .actions((self) => {
    const actions = {
      addQuote: (coinId: string, quote: typeof Quote.Type) => {
        if (!self.byId[coinId]) {
          return;
        }
        self.byId[coinId].quotes = [
          {
            ...quote,
            change: calculatePreviousPercentage(quote, self.byId[coinId].quotes[0]),
          },
          ...self.byId[coinId].quotes.slice(0, 6)];
      },
      addCoin: flow(function* addCoin(symbol) {
        self.adding = true;
        try {
          const addedCoin = (yield client.post('/coins', { symbol })).data;
          self.coins.push(addedCoin);
        } catch (error) {
          notification.error({
            key: 'addCoin',
            message: 'Unable to add coin',
            description: error.message,
            duration: 5000,
          });
        } finally {
          self.adding = false;
        }
      }),
      afterCreate: flow(function* afterCreate() {

        const socket = SocketIO(process.env.REACT_APP_API_URL);

        socket.on('connect', () => {
          socket.on('quote', (quote) => {
            actions.addQuote(quote.coin.id, quote);
          })
        });

        self.loading = true;

        try {
          self.coins = (yield client.get('/coins')).data;
          self.fetched = true;
        } catch (error) {
          notification.error({
            key: 'getCoins',
            message: 'Unable to fetch coins',
            description: error.message,
            duration: 5000,
          });
        } finally {
          self.loading = false;
        }
      }),
    }

    return actions;
  });