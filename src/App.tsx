import React, { useEffect } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';

import { history } from './app/store';
import { useAppDispatch } from './app/hooks';
import { initWalletAsync } from './features/wallet/slice';
import ConnectWalletPage from './pages/ConnectWalletPage';
import SwapPage from './pages/SwapPage';

import "@fontsource/inter";

const App = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(initWalletAsync());
  }, [dispatch]);

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/swap" render={() => <SwapPage />} />
        <Route path="/" render={() => <ConnectWalletPage />} />
      </Switch>
    </ConnectedRouter>
  );
}

export default App;
