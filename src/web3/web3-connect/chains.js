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
  [CHAIN_ALIASES.ETH_MAINNET]: {
    name: "Ethereum Mainnet",
    blockExplorerUrls: ["https://etherscan.io"],
    nativeCurrency: ETH,
    urls: [
      process.env.INFURA_KEY ? `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}` : "",
      "https://cloudflare-eth.com",
    ].filter((url) => url !== ""),
  },
  [CHAIN_ALIASES.BSC_MAINNET]: {
    name: "Binance Smart Chain",
    blockExplorerUrls: ["https://bscscan.com"],
    nativeCurrency: BNB,
    urls: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
    ],
  },
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
  },
  [CHAIN_ALIASES.FTM_MAINNET]: {
    name: "Fantom Opera",
    blockExplorerUrls: ["https://ftmscan.com"],
    nativeCurrency: FTM,
    urls: ["https://rpc.ftm.tools"],
  },
  [CHAIN_ALIASES.MATIC_MAINNET]: {
    name: "Polygon",
    blockExplorerUrls: ["https://polygonscan.com"],
    nativeCurrency: MATIC,
    urls: [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.matic.network",
      "https://rpc-mainnet.maticvigil.com",
      "https://matic-mainnet.chainstacklabs.com",
      "https://matic-mainnet-full-rpc.bwarelabs.com",
    ],
  },
  [CHAIN_ALIASES.MATIC_TESTNET]: {
    name: "Mumbai Testnet",
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    nativeCurrency: MATIC,
    urls: [
      "https://rpc-mumbai.matic.today",
      "https://matic-mumbai.chainstacklabs.com",
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com",
    ],
    isTestnet: true,
  },
};

export const DEFAULT_CHAIN_IDS = Object.values(CHAIN_ALIASES);
