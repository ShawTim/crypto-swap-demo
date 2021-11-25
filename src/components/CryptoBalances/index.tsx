import numeral from "numeral";

import React from 'react';
import { CryptoPriceState, CRYPTO_NAMES, SupportedCryptos } from '../../features/cryptoPrice/slice';
import { WalletBalances } from "../../features/wallet/slice";

import styles from './index.module.scss';
import USDCIcon from './USDC.png';

export type CryptoBalancesProps = React.HTMLAttributes<HTMLElement> & {
  prices: CryptoPriceState,
  balances: WalletBalances,
};

const BalanceListItem = (props: { crypto: string, balance: number, price: number, icon: string }) => (
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
      <div className={styles.rightArrow}></div>
    </div>
  </li>
);

const CryptoBalances = (props: CryptoBalancesProps) => {
  const { prices, balances } = props;

  return (
    <div className={`${props.className ?? ""} ${styles.cryptoBalances}`}>
      <div className={styles.balanceContainer}>
        <span className={styles.balanceTitle}>My funds</span>
        <ul className={styles.cryptoList}>
          <BalanceListItem
            crypto={SupportedCryptos.USDC}
            balance={balances[SupportedCryptos.USDC]}
            price={prices[SupportedCryptos.USDC].USD}
            icon={USDCIcon} />
          <BalanceListItem
            crypto={SupportedCryptos.WBTC}
            balance={balances[SupportedCryptos.WBTC]}
            price={prices[SupportedCryptos.WBTC].USD}
            icon={USDCIcon} />
          <BalanceListItem
            crypto={SupportedCryptos.ETH}
            balance={balances[SupportedCryptos.ETH]}
            price={prices[SupportedCryptos.ETH].USD}
            icon={USDCIcon} />
        </ul>
      </div>
    </div>
  );
}

export default CryptoBalances;