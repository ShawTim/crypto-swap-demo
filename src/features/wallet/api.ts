import { ethers } from 'ethers';

export const initWallet = async (): Promise<string> => {
  try {
    const win: any = window;
    const ethProvider = new ethers.providers.Web3Provider(win.ethereum);
    const signer = ethProvider.getSigner();
    return await signer.getAddress();
  } catch (e) {
    throw e;
  }
};

export const connectWallet = async (): Promise<string> => {
  try {
    const win: any = window;
    const ethProvider = new ethers.providers.Web3Provider(win.ethereum);
    await ethProvider.send("eth_requestAccounts", []);
    const signer = ethProvider.getSigner();
    return await signer.getAddress();
  } catch (e) {
    console.error(e);
    throw e;
  }
};