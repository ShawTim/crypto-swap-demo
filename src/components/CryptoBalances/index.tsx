import numeral from "numeral";

import React, { useCallback } from 'react';
import { CryptoPriceState, CRYPTO_NAMES, SupportedCryptos } from '../../features/cryptoPrice/slice';
import { SwapStatus } from "../../features/swapUI/slice";
import { WalletBalances } from "../../features/wallet/slice";

import styles from './index.module.scss';

export type CryptoBalancesProps = React.HTMLAttributes<HTMLElement> & {
  prices: CryptoPriceState,
  balances: WalletBalances,
  status: SwapStatus,
  isModalOpen: boolean,
  onSelectCrypto: (crypto: SupportedCryptos) => void,
};

type BalanceListItemProps = {
  crypto: string,
  balance: number,
  price: number,
  canSelect: boolean,
  onSelect: () => void,
};

const BalanceListItem = (props: BalanceListItemProps) => (
  <li className={styles.cryptoListItem}>
    <div className={styles.cryptoNameContainer}>
      <div className={`${styles.cryptoIcon} ${styles["crypto" + props.crypto]}`}></div>
      <div className={styles.cryptoName}>
        <span className={styles.cryptoNameTitle}>{props.crypto}</span>
        <span className={styles.cryptoNameDesc}>{CRYPTO_NAMES[props.crypto]}</span>
      </div>
    </div>
    <div className={styles.cryptoBalanceContainer}>
      <div className={styles.cryptoBalance}>
        <span className={styles.cryptoValue}>{numeral(props.balance).multiply(props.price).format("$0,0.00")}</span>
        <span className={styles.cryptoAmount}>{numeral(props.balance).format("0,0.00[000000]")}</span>
      </div>
      <button className={styles.rightArrow} onClick={props.onSelect} disabled={!props.canSelect}></button>
    </div>
  </li>
);

const CryptoBalances = (props: CryptoBalancesProps) => {
  const { prices, balances, status, isModalOpen, onSelectCrypto } = props;

  const selectUSDC = useCallback(() => onSelectCrypto(SupportedCryptos.USDC), [onSelectCrypto]);
  const selectWBTC = useCallback(() => onSelectCrypto(SupportedCryptos.WBTC), [onSelectCrypto]);
  const selectETH = useCallback(() => onSelectCrypto(SupportedCryptos.ETH), [onSelectCrypto]);

  return (
    <div className={`${props.className ?? ""} ${styles.cryptoBalances}`}>
      <div className={styles.balanceContainer}>
        <span className={styles.balanceTitle}>My funds</span>
        <ul className={styles.cryptoList}>
          <BalanceListItem
            crypto={SupportedCryptos.USDC}
            balance={balances[SupportedCryptos.USDC]}
            price={prices[SupportedCryptos.USDC].USD}
            canSelect={status === SwapStatus.INITIAL && !isModalOpen}
            onSelect={selectUSDC} />
          <BalanceListItem
            crypto={SupportedCryptos.WBTC}
            balance={balances[SupportedCryptos.WBTC]}
            price={prices[SupportedCryptos.WBTC].USD}
            canSelect={status === SwapStatus.INITIAL && !isModalOpen}
            onSelect={selectWBTC} />
          <BalanceListItem
            crypto={SupportedCryptos.ETH}
            balance={balances[SupportedCryptos.ETH]}
            price={prices[SupportedCryptos.ETH].USD}
            canSelect={status === SwapStatus.INITIAL && !isModalOpen}
            onSelect={selectETH} />
        </ul>
      </div>
    </div>
  );
}

export default CryptoBalances;