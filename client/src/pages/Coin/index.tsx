import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

import {
  Skeleton,
  Avatar,
  Typography,
  Row,
  Col,
  Statistic,
  Card,
  Empty,
  Icon,
} from 'antd';

import { Store } from '../../stores';

import styles from './Coin.module.css';

dayjs.extend(relativeTime);

function Coin(props) {
  const {
    coin = {}
  } = props;

  useEffect(() => {
    if (coin.reload && !coin.loaded) {
      coin.reload();
    }
  }, [coin]);

  if (!coin.loaded || coin.loading) {
    return <Skeleton />
  }

  const {
    name,
    symbol,
    rank,
    meta: {
      logo,
    },
    quotes,
  } = coin;

  const {
    marketCap = null
  } = quotes[0] || {}

  return <div>
    <Typography.Title>
      <Avatar
        src={logo}
        className={styles.logo}
      >
        {symbol}
      </Avatar>
      {name} <Typography.Text type="secondary">({symbol})</Typography.Text>
    </Typography.Title>
    <Row gutter={16}>
      <Col span={12}>
        <Statistic title="Rank" value={rank} />
      </Col>
      <Col span={12}>
        <Statistic title="Market Cap" value={marketCap ? `$${marketCap}` : 'N/A'} />
      </Col>
    </Row>
    {quotes.length === 0 && <Empty />}
    {quotes.length > 0 && (
      quotes.map((quote, index) => (
        <Row gutter={16}>
          <Col
            key={quote.id}
            span={24}
            className={styles.card}
          >
            <Card>
              <Row
                gutter={8}
              >
                <Col span={8}>
                  <Statistic
                    title="Time"
                    value={dayjs().to(quote.createdAt)}
                  />
                </Col>
                <Col span={10}>
                  <Statistic
                    title="Price"
                    prefix="$"
                    value={quote.price}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Change"
                    suffix="%"
                    value={quote.change.toFixed(2)}
                    valueStyle={{ color: quote.change >= 0 ? '#3f8600' : '#cf1322' }}
                    prefix={<Icon type={quote.change >= 0 ? 'arrow-up' : 'arrow-down'} />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      ))
    )}
  </div>;
};

export default withRouter(inject(({
  store: {
    coinStore: {
      bySlug,
    }
  },
}: {
  store: typeof Store.Type
}, {
  match: {
    params: {
      coin
    },
  },
}) => ({
  coin: bySlug[coin],
})
)(
  observer(Coin)
));