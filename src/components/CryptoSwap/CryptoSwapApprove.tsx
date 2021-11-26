import numeral from "numeral";

import React, { useCallback, useEffect, useState } from 'react';
import { CryptoPriceState, CRYPTO_TXN_FEES } from "../../features/cryptoPrice/slice";
import { SwapStatus, SwapUIState } from "../../features/swapUI/slice";

import styles from './index.module.scss';

export type CryptoSwapReviewProps = {
  prices: CryptoPriceState,
  uiState: SwapUIState,
  onChangeSwapStatus: (status: SwapStatus) => void,
  onSwap: () => void,
};

const CryptoSwapApprove = (props: any) => {
  const { prices, uiState, onChangeSwapStatus, onSwap } = props;
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [invalidTransaction, setInvalidTransaction] = useState(false);
  const [ellipsis, setEllipsis] = useState("");

  // get use of useEffect and useState such that no need to call in every re-render
  useEffect(() => setFromAmount(numeral(uiState.fromAmount).format("0,0.00[000000]")), [uiState.fromAmount]);
  useEffect(() => {
    if ((numeral(uiState.fromAmount).value() || 0) > 0) {
      const amount = numeral(uiState.fromAmount).multiply(prices[uiState.fromCrypto][uiState.toCrypto]);
      const recevied = numeral(amount).subtract(CRYPTO_TXN_FEES[uiState.toCrypto]);
      setToAmount(amount.format("0.00[000000]"));
      setReceivedAmount(recevied.format("0.00[000000]"));
      setInvalidTransaction((recevied.value() || 0) < 0);
    } else {
      setToAmount("0.00");
      setReceivedAmount("0.00");
      setInvalidTransaction(true);
    }
  }, [prices, uiState.fromAmount, uiState.fromCrypto, uiState.toCrypto, setToAmount]);
  useEffect(() => setFeeAmount(numeral(CRYPTO_TXN_FEES[uiState.toCrypto]).format("0,0.00[000000]")), [uiState.toCrypto]);

  const onClickApproveButton = useCallback(() => {
    onChangeSwapStatus(SwapStatus.APPROVING);
    setTimeout(() => onChangeSwapStatus(SwapStatus.APPROVED), 2000);
  }, [onChangeSwapStatus]);
  const onClickConfirmButton = useCallback(() => {
    onChangeSwapStatus(SwapStatus.CONFIRMING);
    setTimeout(onSwap, 2000);
  }, [onChangeSwapStatus, onSwap]);
  const onClickCancelButton = useCallback(() => onChangeSwapStatus(SwapStatus.INITIAL), [onChangeSwapStatus]);

  if (uiState.status === SwapStatus.APPROVING || uiState.status === SwapStatus.CONFIRMING) {
    setTimeout(() => setEllipsis(ellipsis.length >= 3 ? "" : (ellipsis + ".")), 300);
  }

  return (
    <div className={styles.swapBody}>
      <div className={styles.swapInnerBody}>
        <div className={styles.swapFromCryptoContainer}>
          <div className={styles.swapFromCryptoAmountContainer}>
            <div className={`${styles.swapFromCryptoIcon} ${styles["crypto" + uiState.fromCrypto]}`}></div>
            <span className={styles.swapFromCryptoAmount}>{fromAmount}</span>
          </div>
          <span className={styles.swapFromCryptoName}>{uiState.fromCrypto}</span>
        </div>
        <div className={styles.toArrow}></div>
        <div className={styles.swapToCryptoContainer}>
          <div className={styles.swapToCryptoAmountContainer}>
            <div className={`${styles.swapToCryptoIcon} ${styles["crypto" + uiState.toCrypto]}`}></div>
            <span className={styles.swapToCryptoAmount}>{toAmount}</span>
          </div>
          <span className={styles.swapToCryptoName}>{uiState.toCrypto}</span>
        </div>
        <span className={styles.swapDetailTitle}>Details</span>
        <div className={styles.swapDetailContainer}>
          <div className={styles.swapDetailReceivedContainer}>
            <span className={styles.swapDetailReceivedTitle}>Minimum recieved</span>
            <span className={styles.swapDetailReceivedAmount}>{receivedAmount} {uiState.toCrypto}</span>
          </div>
          <div className={styles.swapDetailFeeContainer}>
            <span className={styles.swapDetailFeeTitle}>Network & Protocol fees</span>
            <span className={styles.swapDetailFeeAmount}>{feeAmount} {uiState.toCrypto}</span>
          </div>
        </div>
      </div>
      {uiState.status === SwapStatus.REVIEW && (
        <button className={styles.approveButton} onClick={onClickApproveButton} disabled={invalidTransaction}>Approve Swap</button>
      )}
      {uiState.status === SwapStatus.APPROVING && (
        <button className={styles.approveButton} disabled>Approve in wallet{ellipsis}</button>
      )}
      {uiState.status === SwapStatus.APPROVED && (
        <button className={styles.confirmButton} onClick={onClickConfirmButton} disabled={invalidTransaction}>Confirm Swap</button>
      )}
      {uiState.status === SwapStatus.CONFIRMING && (
        <button className={styles.confirmButton} disabled>Confirm in wallet{ellipsis}</button>
      )}
      <button className={styles.cancelButton} onClick={onClickCancelButton}>Cancel</button>
    </div>
  );
};

export default CryptoSwapApprove;