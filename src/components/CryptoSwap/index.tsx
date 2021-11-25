import React, { useCallback, useEffect, useState } from 'react';
import { CryptoPriceState, SupportedCryptos } from "../../features/cryptoPrice/slice";
import { SwapStatus, SwapUIState } from "../../features/swapUI/slice";
import { WalletBalances } from "../../features/wallet/slice";
import CryptoSwapInitial from "./CryptoSwapInitial";
import CryptoSwapApprove from "./CryptoSwapApprove";

import styles from './index.module.scss';

export type CryptoSwapProps = React.HTMLAttributes<HTMLElement> & {
  prices: CryptoPriceState,
  balances: WalletBalances,
  uiState: SwapUIState,
  onChangeSwapStatus: (status: SwapStatus) => void,
  onChangeFromCrypto: (crypto: SupportedCryptos) => void,
  onChangeFromAmount: (amount: string) => void,
  onChangeToCrypto: (crypto: SupportedCryptos) => void,
  onSwap: () => void,
};

const CryptoSwap = (props: CryptoSwapProps) => {
  const { prices, balances, uiState, onChangeSwapStatus, onChangeFromCrypto, onChangeFromAmount, onChangeToCrypto, onSwap } = props;
  const [title, setTitle] = useState("");

  // get use of useEffect and useState such that no need to call in every re-render
  useEffect(() => {
    switch (uiState.status) {
      case SwapStatus.INITIAL:
        setTitle("Swap");
        break;
      case SwapStatus.REVIEW:
      case SwapStatus.APPROVING:
        setTitle("Approve Swap");
        break;

      case SwapStatus.APPROVED:
      case SwapStatus.CONFIRMING:
        setTitle("Confirm Swap");
        break;
    }
  }, [uiState.status]);

  const onClickCloseButton = useCallback(() => onChangeSwapStatus(SwapStatus.INITIAL), [onChangeSwapStatus]);

  return (
    <div className={`${props.className ?? ""} ${styles.cryptoSwap} ${styles["status" + uiState.status]}`}>
      <div className={styles.swapHeader}>
        <span className={styles.swapTitle}>{title}</span>
        {uiState.status !== SwapStatus.INITIAL && <button className={styles.closeButton} onClick={onClickCloseButton}></button>}
      </div>
      <div className={`${styles.swapBodyContainer} ${styles["status" + uiState.status]}`}>
        {uiState.status === SwapStatus.INITIAL && (
          <CryptoSwapInitial
            balances={balances}
            prices={prices}
            uiState={uiState}
            onChangeSwapStatus={onChangeSwapStatus}
            onChangeFromCrypto={onChangeFromCrypto}
            onChangeFromAmount={onChangeFromAmount}
            onChangeToCrypto={onChangeToCrypto} />
        )}
        {uiState.status !== SwapStatus.INITIAL && (
          <CryptoSwapApprove
            balances={balances}
            prices={prices}
            uiState={uiState}
            onChangeSwapStatus={onChangeSwapStatus}
            onSwap={onSwap} />
        )}
      </div>
    </div>
  );
};

export default CryptoSwap;