import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3Connect } from 'src/web3/web3-connect'
import Web3 from 'web3'
import { getReader } from 'src/web3/web3-contract/hooks/use-contract'
import pairABI from 'src/web3/web3-contract/abis/BundauSwapPair.json'
import BigNumber from 'bignumber.js'
const HistoryContext = React.createContext({})
const query = async (contract, from, to, event) => {
  let currentBlock = to
  let result = []
  while (currentBlock >= from) {
    const events = await contract.getPastEvents(event, {
      fromBlock: Math.max(from, currentBlock - 4999),
      toBlock: currentBlock,
    })
    currentBlock -= 5000
    result = events.concat(result)
  }
  return result
}
export function HistoryProvider({ children }) {
  const { chain } = useWeb3Connect()
  const web3Reader = new Web3(chain.urls[0])

  const getFromBlock = async (duration) => {
    const blockNum = Math.ceil(duration / chain.avgBlockSpeed)
    const latest = await web3Reader.eth.getBlock('latest')
    return latest.number - blockNum
  }

  const queryReserveInfo = useCallback(
    async (pairAddr, duration) => {
      try {
        const pairReader = getReader(pairABI, pairAddr, chain)
        let currentBlock = await web3Reader.eth.getBlock('latest')
        currentBlock = currentBlock.number
        const fromBlock = duration
          ? await getFromBlock(duration)
          : currentBlock - 50000
        const events = await query(pairReader, fromBlock, currentBlock, 'Sync')
        let result = []
        for (let i = 0; i < events.length; i++) {
          const event = events[i]
          const block = await web3Reader.eth.getBlock(event.blockNumber)
          const { reserve0, reserve1 } = event.returnValues
          result.push({ timestamp: block.timestamp, reserve0, reserve1 })
        }
        return result
      } catch (error) {
        console.error(error)
        return error.message
      }
    },
    [pairABI, chain, getFromBlock],
  )
  const queryTradingInfo = useCallback(
    async (pairAddr, duration) => {
      try {
        const pairReader = getReader(pairABI, pairAddr, chain)
        let currentBlock = await web3Reader.eth.getBlock('latest')
        currentBlock = currentBlock.number
        const fromBlock = duration
          ? await getFromBlock(duration)
          : currentBlock - 50000
        const events = await query(pairReader, fromBlock, currentBlock, 'Swap')
        let result = []
        for (let i = 0; i < events.length; i++) {
          const event = events[i]
          const block = await web3Reader.eth.getBlock(event.blockNumber)
          const {
            amount0In,
            amount1In,
            amount0Out,
            amount1Out,
          } = event.returnValues
          result.push({
            timestamp: block.timestamp,
            amount0: new BigNumber(amount0Out).minus(amount0In),
            amount1: new BigNumber(amount1Out).minus(amount1In),
          })
        }
        return result
      } catch (error) {
        console.error(error)
        return error.message
      }
    },
    [pairABI, chain, getFromBlock],
  )
  const contextData = useMemo(
    () => ({
      queryReserveInfo,
      queryTradingInfo,
    }),
    [queryReserveInfo, queryTradingInfo],
  )
  return (
    <HistoryContext.Provider value={contextData}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistoryContext = () => React.useContext(HistoryContext)
