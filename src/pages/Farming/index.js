import NotConnected from "src/components/NotConnected";
import { FarmingProvider } from "src/context/farm-context";
import { useWeb3Connect } from "src/web3/web3-connect";
import FarmingContent from "./FarmingContent";

export default function Farming(){
    const {address} = useWeb3Connect();

    return address ? (
        <FarmingProvider>
            <FarmingContent/>
        </FarmingProvider>
    ) : <NotConnected/>
}