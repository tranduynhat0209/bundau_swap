import { VoteProvider } from "src/context/vote-context";
import VoteContent from "./VoteContent";

export default function Vote(){
    return (
        <VoteProvider>
            <VoteContent/>
        </VoteProvider>
    )
}