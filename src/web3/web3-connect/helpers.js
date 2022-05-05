export const WALLETS = {
  METAMASK: "metamask",
  WALLET_CONNECT: "walletconnect",
};

export const getConnectedWallet = () => {
  return window.localStorage.getItem("wallet");
};

export const setConnectedWallet = (wallet) => {
  if (!wallet) {
    window.localStorage.removeItem("wallet");
  } else {
    window.localStorage.setItem("wallet", wallet);
  }
};
