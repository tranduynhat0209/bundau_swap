import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getReader,
  useMulticall,
} from "src/web3/web3-contract/hooks/use-contract";
import PairABI from "src/web3/web3-contract/abis/BundauSwapPair.json";
import FarmABI from "src/web3/web3-contract/abis/BundauSwapFarming.json";
import ERC20ABI from "src/web3/web3-contract/abis/ERC20.json";
import { useWeb3Connect } from "src/web3/web3-connect";
import { getContractAddress } from "src/web3/web3-contract/addresses";
import { useCacheContext } from "../cache-context";

const FarmingContext = React.createContext({});

export function FarmingProvider({ children }) {
  const { chain, address: accountAddress } = useWeb3Connect();
  const ERC20 = getContractAddress(chain.chainId, "ERC20");
  const farmingAddress = getContractAddress(chain.chainId, "farming");
  const BND = getContractAddress(chain.chainId, "BND");
  const multicall = useMulticall();
  const [userFarmInfo, setUserFarmInfo] = useState({});
  const [currentPid, setCurrentPid] = useState(0);
  const [loading, setLoading] = useState(0);
  const { push, select } = useCacheContext();
  const fetchPairInfo = useCallback(
    async (pid) => {
      try {
        const farmReader = getReader(FarmABI, farmingAddress, chain);
        const poolInfo = await farmReader.methods.poolInfo(pid).call();

        const pairAddress = poolInfo.lpToken;

        const pairReader = getReader(PairABI, pairAddress, chain);

        const [token0Addr, token1Addr] = await multicall.aggregate([
          pairReader.methods.token0(),
          pairReader.methods.token1(),
        ]);
        const tokenReader0 = getReader(ERC20ABI, token0Addr, chain);
        const tokenReader1 = getReader(ERC20ABI, token1Addr, chain);
        const [token0Symbol, token1Symbol] = await multicall.aggregate([
          tokenReader0.methods.symbol(),
          tokenReader1.methods.symbol(),
        ]);
        return {
          token0Symbol,
          token1Symbol,
          token0Img: ERC20[token0Addr].img,
          token1Img: ERC20[token1Addr].img,
          pairAddress,
        };
      } catch (error) {
        return null;
      }
    },
    [chain]
  );

  const fetchUserFarmBalance = useCallback(
    async (pid, pairAddress) => {
      const farmReader = getReader(FarmABI, farmingAddress, chain);
      const pairReader = getReader(PairABI, pairAddress, chain);
      const bndReader = getReader(ERC20ABI, BND.address, chain);
      const [
        pairBalance,
        pairDecimals,
        userFarmInfo,
        userPendingReward,
        totalPendingReward,
        BNDBalance,
        BNDDecimals,
      ] = await multicall.aggregate([
        pairReader.methods.balanceOf(accountAddress),
        pairReader.methods.decimals(),
        farmReader.methods.userInfo(pid, accountAddress),
        farmReader.methods.pending(pid, accountAddress),
        farmReader.methods.totalPending(),
        bndReader.methods.balanceOf(accountAddress),
        bndReader.methods.decimals(),
      ]);

      setUserFarmInfo({
        pairBalance,
        pairDecimals,
        userDeposited: userFarmInfo[0],
        userPendingReward,
        totalPendingReward,
        BNDBalance,
        BNDDecimals,
      });
    },

    [chain, accountAddress]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let allPairs = select("farm");
      if (!allPairs) {
        const farmReader = getReader(FarmABI, farmingAddress, chain);
        const poolLength = await farmReader.methods.poolLength().call();

        const fetchs = [];
        for (let i = 0; i < poolLength; i++) {
          fetchs.push(fetchPairInfo(i));
        }
        allPairs = await Promise.all(fetchs);
        push("farm", allPairs);
      }
      const { pairAddress } = allPairs[currentPid];
      await fetchUserFarmBalance(currentPid, pairAddress);
    } catch (error) {}
    setLoading(false);
  }, [chain, accountAddress, currentPid]);

  const switchPid = useCallback(
    async (newId) => {
      const allPairs = select("farm");
      if (allPairs && allPairs.length > newId) {
        setCurrentPid(newId);
      }
    },
    []
  );

  const currentPairInfo = useMemo(() => {
    const allPairs = select("farm");
    return allPairs && allPairs.length > currentPid ? allPairs[currentPid] : undefined;
  }, [select, currentPid]);

  useEffect(() => {
    fetchData();
  }, [chain, accountAddress]);
  const contextData = useMemo(
    () => ({
      fetchData,
      userFarmInfo,
      allPairs: select("farm"),
      switchPid,
      currentPid,
      currentPairInfo,
      loading,
    }),
    [
      fetchData,
      userFarmInfo,
      select,
      switchPid,
      currentPid,
      currentPairInfo,
      loading,
    ]
  );
  return (
    <FarmingContext.Provider value={contextData}>
      {children}
    </FarmingContext.Provider>
  );
}

export const useFarmingContext = () => React.useContext(FarmingContext);

export const useFarmDataSelector = (selectorFn) => {
  const data = useFarmingContext();
  return useMemo(() => selectorFn(data), [data]);
};
