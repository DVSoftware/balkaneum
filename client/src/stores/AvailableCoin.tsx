import { types, flow } from 'mobx-state-tree';
import Fuse from 'fuse.js';
import { notification } from 'antd';

import { defaultClient as client } from '../libs/client';

export const AvailableCoin = types
  .model('AvailableCoin', {
    name: types.string,
    symbol: types.string,
  });


export const AvailableCoinStore = types
  .model('AvailableCoinStore', {
    availableCoins: types.optional(types.array(AvailableCoin), []),
    fetched: types.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
  })
  .views((self) => {
    const views = {
      get fuseSearch() {
        return new Fuse(self.availableCoins, {
          shouldSort: true,
          threshold: 0.2,
          location: 0,
          distance: 100,
          maxPatternLength: 10,
          minMatchCharLength: 2,
          keys: [
            'name',
            'symbol',
          ],
        });
      }
    }

    return views;
  })
  .actions((self) => {
    const actions = {
      fetchAvailable: flow(function* fetchAvailable() {
        if (self.fetched || self.loading) {
          return;
        }

        self.loading = true;

        try {
          self.availableCoins = (yield client.get('/available-coins')).data;
          self.fetched = true;
        } catch (error) {
          notification.error({
            key: 'getCoins',
            message: 'Unable to fetch available coins',
            description: error.message,
            duration: 5000,
          });
        } finally {
          self.loading = false;
        }
      }),
    }

    return actions;
  })