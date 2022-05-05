import Web3 from "web3";
import {useMemo, useCallback} from "react";
import {useWeb3Connect} from "src/web3/web3-connect/context/web3-connect-context";
import Multicall from "@dopex-io/web3-multicall";

export function useMulticall() {
    const { chain } = useWeb3Connect();
  
    return useMemo(() => {
      if (!chain) return null;
      const params = { provider: new Web3(chain.urls[0]) };
      if (chain.chainId == 97) params.multicallAddress = "0xe0554d9f33ec88e29576a3b692cb012fa2ee81e2";
      else params.chainId = chain.chainId;
      return new Multicall(params);
    }, [chain]);
  }
export function getReader(ABI, address, chain){
    if(!address || !ABI || !chain) return null;
        try {
            const web3Reader = new Web3(chain.urls[0]);
            return new web3Reader.eth.Contract(ABI, address);
        }
        catch(error){
            console.error("Failed to get contract", error);
            return null;
        }
}
export function getSender(ABI, address, connector, accountAddress){
    if(!address || !ABI || !accountAddress || !connector) return null;
        try{
            const web3Sender = new Web3(connector.provider);
            return new web3Sender.eth.Contract(ABI, address);
        }
        catch(error){
            console.error("Failed to get contract", error);
            return null;
        }
}
export function useContractReader(ABI, address){
    const {chain} = useWeb3Connect();

    return useMemo(() =>getReader(ABI, address, chain), [ABI, address, chain]);
    
}

export function useContractSender(ABI, address){
    const {connector, address: accountAddress} = useWeb3Connect();
    return useMemo(() => getSender(ABI, address, connector, accountAddress), [ABI, address, connector, accountAddress])
}

