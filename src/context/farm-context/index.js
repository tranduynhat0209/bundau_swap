import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getReader,
  useMulticall,
} from "src/web3/web3-contract/hooks/use-contract";
import {
  ERC20,
  farming as farmingAddress,
  BND
} from "src/web3/web3-contract/addresses/bsc-testnet";
import PairABI from "src/web3/web3-contract/abis/BundauSwapPair.json";
import FarmABI from "src/web3/web3-contract/abis/BundauSwapFarming.json";
import ERC20ABI from "src/web3/web3-contract/abis/ERC20.json";
import { useWeb3Connect } from "src/web3/web3-connect";

const FarmingContext = React.createContext({});

export function FarmingProvider({ children }) {
  const { chain, address: accountAddress } = useWeb3Connect();
  const multicall = useMulticall();
  const [userFarmInfo, setUserFarmInfo] = useState({});
  const [allPairs, setAllPairs] = useState([]);
  const [currentPid, setCurrentPid] = useState(0);
  const [loading, setLoading] = useState(0);
  const fetchPairInfo = useCallback(
    async (pid) => {
      console.log("fetch pair info");
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
        const [token0Symbol, token1Symbol] =
          await multicall.aggregate([
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
      console.log("fetch user farming info");
      const farmReader = getReader(FarmABI, farmingAddress, chain);
      const pairReader = getReader(PairABI, pairAddress, chain);
      const bndReader = getReader(ERC20ABI, BND.address, chain);
      const [pairBalance, pairDecimals, userFarmInfo, userPendingReward, totalPendingReward, BNDBalance, BNDDecimals] =
        await multicall.aggregate([
          pairReader.methods.balanceOf(accountAddress),
          pairReader.methods.decimals(),
          farmReader.methods.userInfo(pid, accountAddress),
          farmReader.methods.pending(pid, accountAddress),
          farmReader.methods.totalPending(),
          bndReader.methods.balanceOf(accountAddress),
          bndReader.methods.decimals()
        ]);

      setUserFarmInfo({
        pairBalance,
        pairDecimals,
        userDeposited: userFarmInfo[0],
        userPendingReward,
        totalPendingReward,
        BNDBalance,
        BNDDecimals
      });
    },
    [chain, accountAddress]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const farmReader = getReader(FarmABI, farmingAddress, chain);
      const poolLength = await farmReader.methods.poolLength().call();
      console.log("Pool length: ", poolLength);
      const fetchs = [];
      for (let i = 0; i < poolLength; i++) {
        fetchs.push(fetchPairInfo(i));
      }
      let allPairs = await Promise.all(fetchs);
      console.log(allPairs);
      setAllPairs(allPairs);

      const { pairAddress } = allPairs[currentPid];
      await fetchUserFarmBalance(currentPid, pairAddress);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [chain, accountAddress]);

  const switchPid = useCallback(
    async (newId) => {
      if (allPairs && allPairs.length > newId) {
        setCurrentPid(newId);
        const { pairAddress } = allPairs[newId];
        await fetchUserFarmBalance(newId, pairAddress);
      }
    },
    [allPairs]
  );

  const currentPairInfo = useMemo(() => {
    return allPairs[currentPid];
  }, [allPairs, currentPid]);

  useEffect(() => {
    fetchData();
  }, [chain, accountAddress]);
  const contextData = useMemo(
    () => ({
      fetchData,
      userFarmInfo,
      allPairs,
      switchPid,
      currentPid,
      currentPairInfo,
      loading,
    }),
    [
      fetchData,
      userFarmInfo,
      allPairs,
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
