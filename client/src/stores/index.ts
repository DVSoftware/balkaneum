import { types } from 'mobx-state-tree';
import makeInspectable from 'mobx-devtools-mst';

import { CoinStore } from './Coin';
import { AvailableCoinStore } from './AvailableCoin';

export const Store = types
  .model('Store', {
    coinStore: types.optional(CoinStore, {}),
    availableCoinStore: types.optional(AvailableCoinStore, {}),
  })
  .actions((self) => {
    return {
      afterCreate: () => {
        const stores = Object.keys(self);
        stores.forEach((singleStore) => {
          if (self[singleStore].afterCreate) {
            // Needed to access the property for mobx-state-tree to trigger afterCreate
          }
        })
      }
    }
  });

const store = Store.create();

makeInspectable(store);

export default store;