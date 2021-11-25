import React, { useCallback } from 'react';
import { Redirect } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { connectWalletAsync } from '../../features/wallet/slice';

import styles from './index.module.scss';
import metamaskSVG from './metamask.svg';

const ConnectWalletPage = () => {
  const dispatch = useAppDispatch();
  const connectedAddress = useAppSelector((state) => state.wallet.connectedAddress);
  const onBtnClick = useCallback(() => dispatch(connectWalletAsync()), [dispatch]);

  if (!!connectedAddress) {
    return <Redirect to="/swap" />;
  }

  return (
    <div className={styles.connectWalletPage}>
      <span className={styles.connectWalletText}>Connect account</span>
      <button className={styles.connectWalletButton} onClick={onBtnClick}>
        <span className={styles.icon}>
          <img src={metamaskSVG} alt="Metamask Logo" />
        </span>
        <span className={styles.text}>Metamask</span>
        <span className={styles.spacer}></span>
      </button>
    </div>
  );
}

export default ConnectWalletPage;