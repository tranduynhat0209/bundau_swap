const ETH = {
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
};

const BNB = {
  name: "BNB",
  symbol: "BNB",
  decimals: 18,
};

const FTM = {
  name: "Fantom",
  symbol: "FTM",
  decimals: 18,
};

const MATIC = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

export function getAddChainParameters(chainId) {
  const chainInformation = CHAINS[chainId];
  if (!chainInformation) return chainId;
  return {
    chainId,
    chainName: chainInformation.name,
    nativeCurrency: chainInformation.nativeCurrency,
    rpcUrls: chainInformation.urls,
    blockExplorerUrls: chainInformation.blockExplorerUrls,
  };
}

export const CHAIN_ALIASES = {
  ETH_MAINNET: 1,
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
  FTM_MAINNET: 250,
  MATIC_MAINNET: 137,
  MATIC_TESTNET: 80001,
};

export const CHAINS = {
  
  [CHAIN_ALIASES.BSC_TESTNET]: {
    name: "BSC Testnet",
    blockExplorerUrls: ["https://testnet.bscscan.com"],
    nativeCurrency: BNB,
    urls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545",
    ],
    isTestnet: true,
    avgBlockSpeed: 3000
  },
};

export const DEFAULT_CHAIN_IDS = Object.values(CHAIN_ALIASES);
