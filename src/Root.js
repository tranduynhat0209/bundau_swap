import React from "react";
import App from "./App";
import { AppProvider } from "./context/app-context";
import Theme from "./Theme";
import { Web3ConnectProvider } from "./web3/web3-connect/context/web3-connect-context";
import { SnackbarProvider } from "notistack";
import ConnectionErrorNotification from "./components/connection/ConnectionErrorNotification";
import { PairProvider } from "./context/pair-context";
import { CacheProvider } from "./context/cache-context";
function getDefaultChainId() {
  return 4002;
}

function getAllowedChainIds() {
  let allowedChainIds = [4002];

  return allowedChainIds;
}

export default function Root() {
  return (
    <Web3ConnectProvider
      defaultChainId={getDefaultChainId()}
      allowedChainIds={getAllowedChainIds()}
    >
      <AppProvider>
        <Theme>
          <SnackbarProvider>
            <CacheProvider>
              <PairProvider>
                <App />
              </PairProvider>
              <ConnectionErrorNotification />
            </CacheProvider>
          </SnackbarProvider>
        </Theme>
      </AppProvider>
    </Web3ConnectProvider>
  );
}
