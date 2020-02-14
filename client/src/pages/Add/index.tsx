import React, { useState, useEffect } from 'react';

import { observer, inject } from 'mobx-react';
import Fuse from 'fuse.js';

import { Modal, Form, AutoComplete, Select, Spin, message } from 'antd'
import { FormComponentProps } from 'antd/es/form';

import { Store } from '../../stores';
import { AvailableCoin } from '../../stores/AvailableCoin';
import { Coin } from '../../stores/Coin';

import styles from './Add.module.css';

interface Props extends FormComponentProps {
  visible: boolean,
  onClose: () => void,
  loading?: boolean,
  adding?: boolean,
  fetchAvailable?: () => void,
  addCoin?: (symbol: string) => Promise<typeof Coin.Type>,
  fuseSearch?: typeof Fuse.prototype,
}

function Add(props: Props) {
  const {
    visible,
    onClose,
    fetchAvailable,
    form: { getFieldDecorator, validateFieldsAndScroll },
    fuseSearch,
    loading,
    adding,
    addCoin,
  } = props;

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) {
      fetchAvailable();
    }
  }, [visible]);

  function handleOk(): void {
    validateFieldsAndScroll(async (err, fields) => {
      if (!err) {
        await addCoin(fields.select);
        onClose();
      }
    })
  }

  function handleChange(value: string): void {
    setQuery(value);
  }

  function renderOption(option) {
    return <AutoComplete.Option
      key={option.symbol}
    >
      <div>
        <span>
          {option.name}
        </span>
        <span className={styles.symbol}>{option.symbol}</span>
      </div>
    </AutoComplete.Option>
  }

  const dataSource = (fuseSearch.search(query) as typeof AvailableCoin.Type[])
    .slice(0,10)
    .map(renderOption);

  return <Modal
    title="Add a Coin"
    visible={visible}
    onCancel={onClose}
    onOk={handleOk}
    confirmLoading={adding}
  >
    <Form
      layout="vertical"
    >
      <Form.Item label="Select coin">
        {getFieldDecorator('select', {
          rules: [{required: true, message: 'Please select a coin'}],
        })(<Select
          onSearch={handleChange}
          notFoundContent={loading ? <Spin size="small" /> : null}
          defaultActiveFirstOption={false}
          showSearch
          filterOption={false}
        >
          {dataSource}
        </Select>)}
      </Form.Item>
    </Form>
  </Modal>
}

export default inject(({
  store: {
    availableCoinStore: {
      fuseSearch,
      loading,
      fetchAvailable,
    },
    coinStore: {
      addCoin,
      adding,
    }
  },
}: {
  store: typeof Store.Type
}) => ({
    fuseSearch,
    loading,
    fetchAvailable,
    addCoin,
    adding,
  })
)(
  observer(
    Form.create<Props>({})(Add)
  )
);