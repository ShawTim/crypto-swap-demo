import numeral from "numeral";

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { CryptoPriceState, SupportedCryptos } from "../../features/cryptoPrice/slice";
import { SwapStatus, SwapUIState } from "../../features/swapUI/slice";
import { WalletBalances } from "../../features/wallet/slice";
import CryptoSelectModal from "./CryptoSelectModal";

import styles from './index.module.scss';

export type CryptoSwapInitialProps = {
  prices: CryptoPriceState,
  balances: WalletBalances,
  uiState: SwapUIState,
  onChangeSwapStatus: (status: SwapStatus) => void,
  onChangeFromCrypto: (crypto: SupportedCryptos) => void,
  onChangeFromAmount: (amount: string) => void,
  onChangeToCrypto: (crypto: SupportedCryptos) => void,
  onChangeIsModalOpen: (isModalOpen: boolean) => void,
};

const CryptoSwapInitial = (props: any) => {
  const { prices, balances, uiState, onChangeSwapStatus, onChangeFromCrypto, onChangeFromAmount, onChangeToCrypto, onChangeIsModalOpen } = props;
  const [fromBalance, setFromBalance] = useState("");
  const [toBalance, setToBalance] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [disableReview, setDisableReview] = useState(true);
  const [fromCryptoSelectOpen, setFromCryptoSelectOpen] = useState(false);
  const [toCryptoSelectOpen, setToCryptoSelectOpen] = useState(false);

  // get use of useEffect and useState such that no need to call in every re-render
  useEffect(() => {
    if ((numeral(uiState.fromAmount).value() || 0) > 0) {
      const amount = numeral(uiState.fromAmount).multiply(prices[uiState.fromCrypto][uiState.toCrypto]);
      setToAmount(amount.format("0.00[000000]"));
    } else {
      setToAmount("");
    }
  }, [prices, uiState, setToAmount]);
  useEffect(() => setDisableReview((numeral(uiState.fromAmount).value() || 0) === 0 || uiState.fromCrypto === uiState.toCrypto), [uiState]);
  useEffect(() => setFromBalance(numeral(balances[uiState.fromCrypto]).format("0,0.00[000000]")), [balances, uiState.fromCrypto]);
  useEffect(() => setToBalance(numeral(balances[uiState.toCrypto]).format("0,0.00[000000]")), [balances, uiState.toCrypto]);

  const onClickMaxButton = useCallback(() => onChangeFromAmount(`${balances[uiState.fromCrypto]}`), [balances, uiState.fromCrypto, onChangeFromAmount]);
  const onClickReviewButton = useCallback(() => onChangeSwapStatus(SwapStatus.REVIEW), [onChangeSwapStatus]);
  const onChangeFromAmountInput = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.validity.patternMismatch) {
      const str = ev.target.value;
      const amount = numeral(str).value() || 0;
      if (amount > balances[uiState.fromCrypto]) {
        onChangeFromAmount(`${balances[uiState.fromCrypto]}`);
      } else if (amount < 0) {
        onChangeFromAmount("");
      } else {
        onChangeFromAmount(str);
      }
    }
  }, [balances, uiState.fromCrypto, onChangeFromAmount]);
  const closeCryptoSelectModal = useCallback(() => {
    setFromCryptoSelectOpen(false);
    setToCryptoSelectOpen(false);
    onChangeIsModalOpen(false);
  }, []);
  const onSelectFromCrypto = useCallback((crypto: SupportedCryptos) => {
    onChangeFromCrypto(crypto);
    onChangeFromAmount("");
    closeCryptoSelectModal();
  }, [onChangeFromCrypto, onChangeFromAmount]);
  const onSelectToCrypto = useCallback((crypto: SupportedCryptos) => {
    onChangeToCrypto(crypto);
    closeCryptoSelectModal();
  }, [onChangeToCrypto]);
  const openFromCryptoSelectModal = useCallback(() => {
    setFromCryptoSelectOpen(true);
    setToCryptoSelectOpen(false);
    onChangeIsModalOpen(true);
  }, []);
  const openToCryptoSelectModal = useCallback(() => {
    setFromCryptoSelectOpen(false);
    setToCryptoSelectOpen(true);
    onChangeIsModalOpen(true);
  }, []);

  return (
    <div className={styles.swapBody}>
      <div className={`${styles.swapInnerBody} ${uiState.isModalOpen ? styles.swapCryptoSelectOpen : ""}`}>
        <div className={styles.swapFromContainer}>
          <span className={styles.swapFromText}>From</span>
          <span className={styles.swapFromBalance}>Balance: {fromBalance}</span>
          <input
            className={styles.swapFromAmount}
            pattern="[0-9]*[.]?[0-9]*"
            placeholder="0.00"
            value={uiState.fromAmount}
            disabled={uiState.isModalOpen}
            onChange={onChangeFromAmountInput} />
          <button className={styles.maxButton} onClick={onClickMaxButton} disabled={uiState.isModalOpen}>MAX</button>
          <div className={styles.swapFromCryptoSelector}>
            <span className={styles.swapFromCryptoName}>{uiState.fromCrypto}</span>
            <div className={`${styles.swapFromCryptoIcon} ${styles["crypto" + uiState.fromCrypto]}`}></div>
            <button className={styles.downArrow} onClick={openFromCryptoSelectModal} disabled={uiState.isModalOpen}></button>
          </div>
        </div>
        <div className={styles.toArrow}></div>
        <div className={styles.swapToContainer}>
          <span className={styles.swapToText}>To</span>
          <span className={styles.swapToBalance}>Balance: {toBalance}</span>
          <input
            className={styles.swapToAmount}
            tabIndex={-1}
            placeholder="0.00"
            readOnly
            value={toAmount} />
          <div className={styles.swapToCryptoSelector}>
            <span className={styles.swapToCryptoName}>{uiState.toCrypto}</span>
            <div className={`${styles.swapToCryptoIcon} ${styles["crypto" + uiState.toCrypto]}`}></div>
            <button className={styles.downArrow} onClick={openToCryptoSelectModal} disabled={uiState.isModalOpen}></button>
          </div>
        </div>
      </div>
      <CryptoSelectModal
        className={styles.swapFromCryptoSelectModal}
        isOpen={fromCryptoSelectOpen}
        title="From"
        prices={prices}
        balances={balances}
        onClose={closeCryptoSelectModal}
        onSelectListItem={onSelectFromCrypto} />
      <CryptoSelectModal
        className={styles.swapToCryptoSelectModal}
        isOpen={toCryptoSelectOpen}
        title="To"
        prices={prices}
        balances={balances}
        onClose={closeCryptoSelectModal}
        onSelectListItem={onSelectToCrypto} />
      <button className={styles.reviewButton} disabled={disableReview} onClick={onClickReviewButton}>Review</button>
    </div>
  );
};

export default CryptoSwapInitial;