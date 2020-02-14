import React, { useState } from 'react';

import { Menu, Button, Spin, Avatar } from 'antd';
import { inject, observer } from 'mobx-react';

import { Link } from 'react-router-dom';

import Add from '../../pages/Add';

import { Store } from '../../stores';
import { Coin } from '../../stores/Coin';

import styles from './Navigation.module.css';

type Props = {
  coins?: typeof Coin.Type[]
  loading?: boolean,
}

function Navigation(props: Props) {
  const {
    coins,
    loading,
  } = props;

  const [addVisible, setAddVisible] = useState(false);

  function handleAddClick() {
    setAddVisible(true);
  }

  function handleAddClose() {
    setAddVisible(false);
  }

  return (
    <>
      <Spin
        spinning={loading}
      >
        <Menu
          theme="light"
          mode="inline"
          className={styles.menu}
        >
          {coins.map((coin) => (
            <Menu.Item
              key={coin.id}
            >
              <Link to={`/coin/${coin.slug}`}>
                <Avatar
                  className={styles.symbol}
                  size="small"
                >
                  {coin.symbol}
                </Avatar>
                <span> {coin.name}</span>
              </Link>
            </Menu.Item>
          ))}
          {!coins.length && (
            <div className={styles.noCoins}>
              There are no coins added. Please add some coins to see the quotes.
            </div>
          )}
          <div className={styles.addButtonWrapper}>
            <Button
              icon="plus"
              type="primary"
              block
              onClick={handleAddClick}
            >
              Add a Coin
            </Button>
          </div>
        </Menu>
      </Spin>
      <Add
        visible={addVisible}
        onClose={handleAddClose}
      />
    </>
  );
}

export default inject(({
  store: {
    coinStore: {
      coins,
      loading,
    },
  },
}: {
  store: typeof Store.Type
}) => {
  return {
    coins,
    loading
  }
})(
  observer(
    Navigation
  )
);