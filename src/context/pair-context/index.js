import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getReader,
  useMulticall,
} from 'src/web3/web3-contract/hooks/use-contract'
import { ERC20, factory } from 'src/web3/web3-contract/addresses/bsc-testnet'
import PairABI from 'src/web3/web3-contract/abis/BundauSwapPair.json'
import FactoryABI from 'src/web3/web3-contract/abis/BundauSwapFactory.json'
import ERC20ABI from 'src/web3/web3-contract/abis/ERC20.json'
import { useWeb3Connect } from 'src/web3/web3-connect'

const PairContext = React.createContext({})

export function PairProvider({ children }) {
  const { chain, address: accountAddress } = useWeb3Connect()
  const multicall = useMulticall()
  const [allPairs, setAllPairs] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPair, setCurrentPair] = useState(0)
  const [currentPairReserveInfo, setCurrentPairReserveInfo] = useState({})
  const [userPairInfo, setUserPairInfo] = useState({})
  const fetchPairInfo = useCallback(
    async (pairAddress) => {
      try {
        const pairReader = getReader(PairABI, pairAddress, chain)
        const [token0Addr, token1Addr] = await multicall.aggregate([
          pairReader.methods.token0(),
          pairReader.methods.token1(),
        ])
        const tokenReader0 = getReader(ERC20ABI, token0Addr, chain)
        const tokenReader1 = getReader(ERC20ABI, token1Addr, chain)
        const [
          token0Name,
          token0Symbol,
          token0Decimals,
          token1Name,
          token1Symbol,
          token1Decimals,
          pairDecimals,
        ] = await multicall.aggregate([
          tokenReader0.methods.name(),
          tokenReader0.methods.symbol(),
          tokenReader0.methods.decimals(),
          tokenReader1.methods.name(),
          tokenReader1.methods.symbol(),
          tokenReader1.methods.decimals(),
          pairReader.methods.decimals()
        ])
        return {
          token0Name,
          token0Symbol,
          token0Decimals,
          token1Name,
          token1Symbol,
          token1Decimals,
          token0Img: ERC20[token0Addr].img,
          token1Img: ERC20[token1Addr].img,
          pairAddress,
          pairDecimals
        }
      } catch (error) {
        return null
      }
    },
    [chain, PairABI, ERC20ABI, getReader],
  )
  const fetchPairUserBalance = useCallback(
    async (pairAddress) => {
      console.log('fetch user info')
      const pairReader = getReader(PairABI, pairAddress, chain)
      const [token0Addr, token1Addr] = await multicall.aggregate([
        pairReader.methods.token0(),
        pairReader.methods.token1(),
      ])
      const tokenReader0 = getReader(ERC20ABI, token0Addr, chain)
      const tokenReader1 = getReader(ERC20ABI, token1Addr, chain)
      const [
        token0Name,
        token0Symbol,
        token0Decimals,
        token1Name,
        token1Symbol,
        token1Decimals,
        token0Balance,
        token1Balance,
        liquidity,
        pairDecimals,
      ] = await multicall.aggregate([
        tokenReader0.methods.name(),
        tokenReader0.methods.symbol(),
        tokenReader0.methods.decimals(),
        tokenReader1.methods.name(),
        tokenReader1.methods.symbol(),
        tokenReader1.methods.decimals(),
        tokenReader0.methods.balanceOf(accountAddress),
        tokenReader1.methods.balanceOf(accountAddress),
        pairReader.methods.balanceOf(accountAddress),
        pairReader.methods.decimals(),
      ])

      setUserPairInfo({
        token0Name,
        token0Symbol,
        token0Decimals,
        token1Name,
        token1Symbol,
        token1Decimals,
        token0Balance,
        token1Balance,
        liquidity,
        token0Img: ERC20[token0Addr].img,
        token1Img: ERC20[token1Addr].img,
        pairDecimals,
        token0Addr,
        token1Addr,
        pairAddress,
      })
    },
    [chain, PairABI, ERC20ABI, accountAddress, getReader],
  )
  const fetchPairReserveInfo = useCallback(
    async (pairAddress) => {
      console.log('fetch reserve')
      const pairReader = getReader(PairABI, pairAddress, chain)
      const [reserveInfo, totalLiquidity] = await multicall.aggregate([
        pairReader.methods.getReserves(),
        pairReader.methods.totalSupply(),
      ])
      setCurrentPairReserveInfo({
        token0Reserve: reserveInfo[0],
        token1Reserve: reserveInfo[1],
        totalLiquidity,
      })
    },
    [chain, PairABI, ERC20ABI, getReader],
  )
  const fetchAllPairs = useCallback(async () => {
    setLoading(true)
    try {
      const factoryReader = getReader(FactoryABI, factory, chain)
      const allPairsAddr = await factoryReader.methods.getAllPairs().call()
      let allPairs = []
      allPairs = await Promise.all(
        allPairsAddr.map((pairAddress) => fetchPairInfo(pairAddress)),
      )

      setAllPairs(allPairs)

      const pairAddress = allPairsAddr[currentPair]
      await fetchPairReserveInfo(pairAddress)
      await fetchPairUserBalance(pairAddress)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [factory, chain, FactoryABI, getReader, accountAddress])

  const switchPair = useCallback(
    async (newId) => {
      if (allPairs && allPairs.length > newId) {
        setCurrentPair(newId)
        await fetchPairReserveInfo(allPairs[newId].pairAddress)
        await fetchPairUserBalance(allPairs[newId].pairAddress)
      }
    },
    [allPairs],
  )

  useEffect(() => {
    fetchAllPairs()
  }, [chain, accountAddress])

  const contextData = useMemo(
    () => ({
      fetchAllPairs,
      allPairs,
      switchPair,
      currentPair,
      loading,
      currentPairReserveInfo,
      userPairInfo,
    }),
    [
      factory,
      allPairs,
      currentPair,
      fetchAllPairs,
      switchPair,
      loading,
      userPairInfo,
      currentPairReserveInfo,
      accountAddress,
    ],
  )
  return (
    <PairContext.Provider value={contextData}>{children}</PairContext.Provider>
  )
}

export const usePairContext = () => React.useContext(PairContext)

export const usePairDataSelector = (selectorFn) => {
  const data = usePairContext()
  return useMemo(() => selectorFn(data), [data])
}
