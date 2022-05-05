import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Metamask from "../connectors/metamask";
import { useState } from "react";
import { useMemo } from "react";
import { getConnectedWallet, setConnectedWallet, WALLETS } from "../helpers";
import { CHAINS, DEFAULT_CHAIN_IDS, getAddChainParameters } from "../chains";
import WalletConnect from "../connectors/wallet-connect";

const Web3ConnectContext = React.createContext({});

// flag for tracking updates so we don't clobber data when cancelling activation
let nullifier = 0;

export function Web3ConnectProvider(props) {
  const { children, defaultChainId, allowedChainIds, connectEagerly, autoSwitchNetwork } = props;
  const DEFAULT_STATE = useMemo(
    () => ({
      chainId: Number(defaultChainId),
      accounts: undefined,
      activating: false,
      error: undefined,
      // connector: undefined,
    }),
    [defaultChainId]
  );
  const [state, setState] = useState({ ...DEFAULT_STATE, chainId: Number(defaultChainId) });

  const chain = useMemo(() => {
    return { ...CHAINS[Number(state.chainId)], chainId: Number(state.chainId) };
  }, [state.chainId, defaultChainId]);

  const allowedNetworkNames = useMemo(() => {
    return allowedChainIds.map((chainId) => CHAINS[Number(chainId)].name);
  }, [allowedChainIds]);

  /**
   * Sets activating to true, indicating that an update is in progress.
   *
   * @returns cancelActivation - A function that cancels the activation by setting activating to false,
   * as long as there haven't been any intervening updates.
   */
  function startActivation() {
    const nullifierCached = ++nullifier;

    setState({ ...DEFAULT_STATE, activating: true });

    // return a function that cancels the activation if nothing else has happened
    return () => {
      if (nullifier === nullifierCached) {
        setState({ ...DEFAULT_STATE, activating: false });
      }
    };
  }

  const _validateChainId = (chainId) => {
    if (
      chainId !== undefined &&
      !allowedChainIds.some((allowedChainId) => Number(allowedChainId) === Number(chainId))
    ) {
      throw new Error(
        `Network is not supported. Please switch to ${
          allowedChainIds.length > 1 ? "one of the following networks " : ""
        } ${allowedNetworkNames.join(", ")}`
      );
    }
  };

  const update = (newState) => {
    try {
      _validateChainId(newState.chainId);
    } catch (error) {

      reportError(error);
      //
      if (autoSwitchNetwork) {
        // switch to default network
        switchChain();
      } else {
        // destroy connection
        terminate();
      }
      return;
    }

    nullifier++;

    setState((currentState) => {
      const chainId = newState.chainId ?? currentState.chainId;
      const accounts = newState.accounts ?? currentState.accounts;

      // ensure that the error is cleared when appropriate
      let error = currentState.error;
      if (error && chainId && accounts) {
        error = undefined;
      }

      // ensure that the activating flag is cleared when appropriate
      let activating = currentState.activating;
      if (activating && (error || chainId || accounts)) {
        activating = false;
      }

      return { ...currentState, ...newState, chainId, accounts, activating, error };
    });
  };

  const reportError = (error) => {

    nullifier++;
    // metamask error, show when user tries to switch network
    // if error code is 1013, ignore this because it doesn't affect to app's flow
    // so we don't need to reset state
    if (error && error.code === 1013 && error.message === "MetaMask: Disconnected from chain. Attempting to connect.") {
      return;
    }

    setState((currentState) => {
      // we don't want reset current network to default
      const chainId = currentState.chainId ?? defaultChainId;
      return { ...DEFAULT_STATE, chainId, error: error?.message };
    });
  };

  const connectors = useMemo(() => {
    const actions = {
      startActivation,
      update,
      reportError,
    };

    const metamask = new Metamask(actions, false);
    const walletConnect = new WalletConnect(
      actions,
      {
        rpc: allowedChainIds.reduce((accumulator, chainId) => {
          accumulator[Number(chainId)] = CHAINS[Number(chainId)].urls[0];
          return accumulator;
        }, {}),
      },
      false
    );

    return {
      metamask,
      walletConnect,
    };
  }, [defaultChainId, allowedChainIds, connectEagerly]);

  const _getConnector = () => {
    const connectedWallet = getConnectedWallet();
    if (connectedWallet === WALLETS.METAMASK) {
      return connectors.metamask;
    } else if (connectedWallet === WALLETS.WALLET_CONNECT) {
      return connectors.walletConnect;
    }
  };

  const connectMetamask = useCallback(async () => {
    try {
      setConnectedWallet(WALLETS.METAMASK);
      await connectors.metamask.activate();
      // setState((currentState) => ({ ...currentState, connector: connectors.metamask }));
    } catch (error) {
      reportError(error);
      setConnectedWallet(undefined);
    }
  }, []);

  const connectWalletConnect = useCallback(async () => {
    try {
      const chainId = isNaN(Number(defaultChainId)) ? undefined : parseInt(defaultChainId);
      setConnectedWallet(WALLETS.WALLET_CONNECT);
      await connectors.walletConnect.activate(chainId);
      // setState((currentState) => ({ ...currentState, connector: connectors.walletConnect }));
    } catch (error) {
      reportError(error);
      setConnectedWallet(undefined);
    }
  }, [state.chainId, defaultChainId]);

  const terminate = useCallback(async () => {
    await connectors.metamask.deactivate();
    await connectors.walletConnect.deactivate();
    setConnectedWallet(undefined);
  }, [connectors]);

  const switchChain = useCallback(
    async (chainId) => {
      if (chainId === undefined) {
        chainId = defaultChainId;
      }
      const connector = _getConnector();
      if (connector) {
        const chainParams = getAddChainParameters(parseInt(chainId));
        await connector.activate(chainParams);
      }
    },
    [defaultChainId]
  );

  const getAddressExplorerLink = useCallback(
    (address) => {
      return `${chain.blockExplorerUrls[0]}/address/${address}`;
    },
    [chain]
  );

  const getTransactionExplorerLink = useCallback(
    (txHash) => {
      return `${chain.blockExplorerUrls[0]}/tx/${txHash}`;
    },
    [chain]
  );

  useEffect(() => {
    const connectedWallet = getConnectedWallet();

    if (connectedWallet === WALLETS.METAMASK) {
      connectors.metamask.connectEagerly();
      setState((currentState) => ({ ...currentState, connector: connectors.metamask }));
    } else if (connectedWallet === WALLETS.WALLET_CONNECT) {
      connectors.walletConnect.connectEagerly();
      setState((currentState) => ({ ...currentState, connector: connectors.walletConnect }));
    }
  }, [connectors]);

  const contextData = useMemo(
    () => ({
      connectMetamask,
      connectWalletConnect,
      switchChain,
      disconnect: terminate,
      getAddressExplorerLink,
      getTransactionExplorerLink,
      connector: _getConnector(),
      ...state,
      chain,
    }),
    [
      connectMetamask,
      connectWalletConnect,
      switchChain,
      terminate,
      getTransactionExplorerLink,
      getAddressExplorerLink,
      state,
      chain,
    ]
  );

  return <Web3ConnectContext.Provider value={contextData}>{children}</Web3ConnectContext.Provider>;
}

Web3ConnectProvider.propTypes = {
  children: PropTypes.node,
  defaultChainId: PropTypes.number.isRequired,
  connectEagerly: PropTypes.bool.isRequired,
  allowedChainIds: PropTypes.array.isRequired,
  autoSwitchNetwork: PropTypes.bool,
};

Web3ConnectProvider.defaultProps = {
  connectEagerly: true,
  allowedChainIds: DEFAULT_CHAIN_IDS,
  autoSwitchNetwork: false,
};

export function useWeb3Connect() {
  const context = React.useContext(Web3ConnectContext);

  if (!context) throw new Error("useWeb3Connect must be used within Web3ConnectProvider");

  return useMemo(() => ({ ...context, address: context?.accounts?.[0] }), [context]);
  // return useMemo(() => ({ ...context, address: "0x0b690ed8df6fcdd664f9e69447c94d0053f5faa3" }), [context]);
}
