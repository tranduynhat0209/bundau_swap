import React from "react";
import { useEffect } from "react";
import useNotifier from "../../../hooks/use-notifier";
import { useWeb3Connect } from "../../../web3/web3-connect";

export default function ConnectionErrorNotification(){
    const {error} = useWeb3Connect();

    const {notifyError} = useNotifier();

    useEffect(() =>{
        if(error){
            notifyError(error);
        }
    }, [error])
    
    return null;
}