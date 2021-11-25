import numeral from "numeral";

import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { CryptoPriceState, CRYPTO_NAMES, SupportedCryptos } from "../../features/cryptoPrice/slice";
import { WalletBalances } from "../../features/wallet/slice";

import styles from './index.module.scss';

type CryptSelectListItemProps = {
  crypto: SupportedCryptos,
  price: number,
  balance: number,
  onSelect: (crypto: SupportedCryptos) => void,
};

const CryptoSelectListItem = (props: CryptSelectListItemProps) => {
  const { crypto, price, balance, onSelect } = props;
  const [cryptoValue, setCryptoValue] = useState("");
  const onClickListItem = useCallback(() => onSelect(crypto), [crypto, onSelect]);
  const onEnterListItem = useCallback((ev: KeyboardEvent) => {
    if (ev.key === " " || ev.key === "Enter") {
      onSelect(crypto);
    }
  }, [crypto, onSelect])

  useEffect(() => setCryptoValue(numeral(price).multiply(balance).format("$0,0.00")), [price, balance]);

  return (
    <li className={styles.cryptoSelectListItem} tabIndex={0} onClick={onClickListItem} onKeyUp={onEnterListItem}>
      <div className={styles.cryptoSelectListItemCryptoContainer}>
        <div className={`${styles.cryptoSelectListItemCryptoIcon} ${styles["crypto" + crypto]}`}></div>
        <div className={styles.cryptoSelectListItemCryptoNameContainer}>
          <span className={styles.cryptoSelectListItemCryptoName}>{crypto}</span>
          <span className={styles.cryptoSelectListItemCryptoDesc}>{CRYPTO_NAMES[crypto]}</span>
        </div>
      </div>
      <div className={styles.cryptoSelectListItemBalanceContainer}>
        <span className={styles.cryptoSelectListItemValue}>{cryptoValue}</span>
        <span className={styles.cryptoSelectListItemBalance}>{balance}</span>
      </div>
    </li>
  )
};

export type CryptoSelectModalProps = React.HTMLAttributes<HTMLElement> & {
  isOpen: boolean,
  title: string,
  prices: CryptoPriceState,
  balances: WalletBalances,
  onClose: () => void,
  onSelectListItem: (crypto: SupportedCryptos) => void,
};

const CryptoSelectModal = (props: CryptoSelectModalProps) => props.isOpen ? (
  <div className={`${props.className ?? ""} ${styles.cryptoSelectModal}`}>
    <div className={styles.modalOverlay} onClick={props.onClose}></div>
    <div className={styles.cryptoSelectModalBody}>
      <span className={styles.cryptoSelectModalTitle}>{props.title}</span>
      <button className={styles.upArrow} onClick={props.onClose}></button>
      <ul className={styles.cryptoSelectList}>
        <CryptoSelectListItem
          crypto={SupportedCryptos.USDC}
          price={props.prices[SupportedCryptos.USDC].USD}
          balance={props.balances[SupportedCryptos.USDC]}
          onSelect={props.onSelectListItem} />
        <CryptoSelectListItem
          crypto={SupportedCryptos.WBTC}
          price={props.prices[SupportedCryptos.WBTC].USD}
          balance={props.balances[SupportedCryptos.WBTC]}
          onSelect={props.onSelectListItem} />
        <CryptoSelectListItem
          crypto={SupportedCryptos.ETH}
          price={props.prices[SupportedCryptos.ETH].USD}
          balance={props.balances[SupportedCryptos.ETH]}
          onSelect={props.onSelectListItem} />
      </ul>
    </div>
  </div>
) : null;

export default CryptoSelectModal;