import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getReader,
  useMulticall,
} from "src/web3/web3-contract/hooks/use-contract";
import PairABI from "src/web3/web3-contract/abis/BundauSwapPair.json";
import FarmABI from "src/web3/web3-contract/abis/BundauSwapFarming.json";
import ERC20ABI from "src/web3/web3-contract/abis/ERC20.json";
import VoteABI from "src/web3/web3-contract/abis/Vote.json";
import { useWeb3Connect } from "src/web3/web3-connect";
import { getContractAddress } from "src/web3/web3-contract/addresses";
import Web3 from "web3";

const VoteContext = React.createContext({});

export function VoteProvider({ children }) {
  const { chain, address: accountAddress } = useWeb3Connect();
  const ERC20 = getContractAddress(chain.chainId, "ERC20");
  const voteAddress = getContractAddress(chain.chainId, "vote");
  const bndAddress = getContractAddress(chain.chainId, "BND").address;
  const multicall = useMulticall();
  const [loading, setLoading] = useState(0);
  const [proposals, setProposals] = useState();
  const [totalBND, setTotalBND] = useState(0);
  const [BNDBalance, setBNDBalance] = useState(0);
  const web3 = new Web3();
  const fetchPairInfo = useCallback(
    async (pairAddress) => {
      try {
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
        };
      } catch (error) {
        return null;
      }
    },
    [chain]
  );
  const fetchProposalList = useCallback(async () => {
    const voteReader = getReader(VoteABI, voteAddress, chain);
    const proposalCount = await voteReader.methods.proposalCount().call();
    const proposalFetchs = [];
    const actionFetchs = [];
    const stateFetchs = [];
    const receiptFetchs = [];
    for (let i = 1; i <= proposalCount; i++) {
      proposalFetchs.push(voteReader.methods.proposals(i));
      actionFetchs.push(voteReader.methods.getActions(i));
      stateFetchs.push(voteReader.methods.state(i));
      if (accountAddress) receiptFetchs.push(voteReader.methods.getReceipt(i, accountAddress));
    }
    const result = await multicall.aggregate([
      ...proposalFetchs,
      ...actionFetchs,
      ...stateFetchs,
      ...receiptFetchs
    ]);

    let _proposals = [];
    for (let i = 0; i < proposalCount; i++) {
      const calldatas = result[i + 1 * proposalCount][3];
      let actions = await Promise.all(
        calldatas.map(async (calldata) => {
          const decodedData = web3.eth.abi.decodeParameters(
            ["address", "uint256"],
            calldata
          );
          const pairInfo = await fetchPairInfo(decodedData["0"]);
          return { ...pairInfo, fee: decodedData["1"] };
        })
      );
      _proposals.push({
        ...result[i],
        actions,
        state: result[i + 2 * proposalCount],
        receipt: accountAddress ? result[i + 3 * proposalCount]: undefined 
      });
    }
    setProposals(_proposals);
    console.log(_proposals);
  }, [fetchPairInfo]);
  const fetchTotalBND = useCallback(async () => {
    const bndReader = getReader(ERC20ABI, bndAddress, chain);
    const totalSupply = await bndReader.methods.totalSupply().call();
    setTotalBND(totalSupply);
  }, [chain]);
  const fetchBNDBalance = useCallback(async () => {
    if (accountAddress) {
      const bndReader = getReader(ERC20ABI, bndAddress, chain);
      const balance = await bndReader.methods.balanceOf(accountAddress).call();
      setBNDBalance(balance);
    }
  }, [chain]);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProposalList(),
        fetchTotalBND(),
        fetchBNDBalance(),
      ]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [fetchProposalList, fetchTotalBND, fetchBNDBalance]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const contextData = useMemo(
    () => ({
      fetchData,
      loading,
      proposals,
      totalBND,
      BNDBalance
    }),
    [fetchData, loading, proposals, totalBND, BNDBalance]
  );
  return (
    <VoteContext.Provider value={contextData}>{children}</VoteContext.Provider>
  );
}

export const useVoteContext = () => React.useContext(VoteContext);

export const useVoteDataSelector = (selectorFn) => {
  const data = useVoteContext();
  return useMemo(() => selectorFn(data), [data]);
};
