import {useSnackbar} from "notistack"

import { ERR_TOP_CENTER, INFO_TOP_CENTER, SUCCESS_TOP_CENTER, WARNING_TOP_CENTER } from "src/configs/snackbar-utils";

export default function useNotifier(){
    const {enqueueSnackbar} = useSnackbar();

    const notifyError = (msg) =>{
        enqueueSnackbar(msg, ERR_TOP_CENTER);
    }
    const notifyInfo = (msg) =>{
        enqueueSnackbar(msg, INFO_TOP_CENTER);
    }
    const notifySuccess = (msg) =>{
        enqueueSnackbar(msg, SUCCESS_TOP_CENTER);
    }
    const notifyWarn = (msg) =>{
        enqueueSnackbar(msg, WARNING_TOP_CENTER);
    }
    return {
        notifyError,
        notifyInfo,
        notifySuccess,
        notifyWarn
    }
}