import React from 'react';
import { Provider } from 'mobx-react';

import { Layout } from 'antd';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navigation from './components/Navigation';

import Coin from './pages/Coin';
import Welcome from './pages/Welcome';

import stores from './stores'

import styles from './App.module.css';

const { Header, Content, Footer, Sider } = Layout;


const App = () => {
  return (
    <Provider
      store={stores}
    >
      <BrowserRouter>
        <Layout>
          <Sider
            className={styles.sider}
          >
            <Navigation />
          </Sider>
          <Layout className={styles.layout}>
            <Content className={styles.content}>
              <div>
                  <Switch>
                    <Route exact path="/" component={Welcome}/>
                    <Route path="/coin/:coin" component={Coin}/>
                  </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
