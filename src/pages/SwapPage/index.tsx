import numeral from 'numeral';

import React, { useCallback, useEffect } from 'react';
import { Redirect } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getCoinGeckoPricesAsync, SupportedCryptos } from '../../features/cryptoPrice/slice';
import { reset, setFromAmount, setFromCrypto, setStatus, setToCrypto, SwapStatus } from '../../features/swapUI/slice';
import { doSwap } from '../../features/wallet/slice';
import CryptoBalances from '../../components/CryptoBalances';
import CryptoSwap from '../../components/CryptoSwap';

import styles from './index.module.scss';

const SwapPage = () => {
  const dispatch = useAppDispatch();
  const connectedAddress = useAppSelector((state) => state.wallet.connectedAddress);
  const balances = useAppSelector((state) => state.wallet.balances);
  const prices = useAppSelector((state) => state.price);
  const swapUI = useAppSelector((state) => state.swapUI);

  const getPrices = useCallback(() => dispatch(getCoinGeckoPricesAsync()), [dispatch]);
  const onChangeSwapStatus = useCallback((status: SwapStatus) => dispatch(setStatus(status)), [dispatch]);
  const onChangeFromCrypto = useCallback((crypto: SupportedCryptos) => dispatch(setFromCrypto(crypto)), [dispatch]);
  const onChangeFromAmount = useCallback((amount: string) => dispatch(setFromAmount(amount)), [dispatch]);
  const onChangeToCrypto = useCallback((crypto: SupportedCryptos) => dispatch(setToCrypto(crypto)), [dispatch]);
  const onSwap = useCallback(() => {
    const { fromCrypto, fromAmount, toCrypto } = swapUI;
    const toAmount = numeral(fromAmount).multiply(prices[fromCrypto][toCrypto]).value() || 0;
    dispatch(doSwap({ fromCrypto, fromAmount: numeral(fromAmount).value() || 0, toCrypto, toAmount }));
    dispatch(reset());
  }, [dispatch, prices, swapUI]);
  
  useEffect(() => {
    if (connectedAddress) {
      getPrices();
      const id = setInterval(getPrices, 30000);
      return () => clearInterval(id);
    }
  }, [connectedAddress, getPrices]);

  if (!connectedAddress) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.swapPage}>
      <div className={styles.innerContainer}>
        <CryptoBalances className={styles.cryptoBalances} balances={balances} prices={prices} />
        <CryptoSwap
          className={styles.cryptoSwap}
          balances={balances}
          prices={prices}
          uiState={swapUI}
          onChangeSwapStatus={onChangeSwapStatus}
          onChangeFromCrypto={onChangeFromCrypto}
          onChangeFromAmount={onChangeFromAmount}
          onChangeToCrypto={onChangeToCrypto}
          onSwap={onSwap} />
      </div>
    </div>
  );
}

export default SwapPage;
