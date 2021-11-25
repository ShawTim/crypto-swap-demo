import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import walletReducer from '../features/wallet/slice';
import priceReducer from '../features/cryptoPrice/slice';
import swapUIReducer from '../features/swapUI/slice';

export const history = createBrowserHistory({ basename: process.env.PUBLIC_URL });

export const rootReducer = combineReducers({
  router: connectRouter(history),
  price: priceReducer,
  wallet: walletReducer,
  swapUI: swapUIReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
