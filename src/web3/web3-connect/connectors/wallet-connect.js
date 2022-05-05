/**
 * ref:
 * @web3-react/walletconnect: https://github.com/NoahZinsmeister/web3-react/blob/main/packages/walletconnect/src/index.ts
 * @walletconnect/ethereum-provider: https://github.com/WalletConnect/walletconnect-monorepo/blob/v2.0/packages/ethereum-provider/src/index.ts
 */
export default class WalletConnect {
  constructor(actions, options, connectEagerly = true, treatModalCloseAsError = true) {
    this._actions = actions;
    this._options = options;
    this._treatModalCloseAsError = treatModalCloseAsError;

    if (connectEagerly) {
      this.connectEagerly();
    }

    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleAccountsChange = this._handleAccountsChange.bind(this);
    this._handleChainChange = this._handleChainChange.bind(this);
    this._initialize = this._initialize.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  _handleChainChange(chainId) {
    this._actions.update({ chainId: parseInt(chainId) });
  }

  _handleDisconnect() {
    if (this?.deactivate) {
      this.deactivate();
    }
  }

  _handleAccountsChange(accounts) {
    if (accounts.length === 0) {
      this.deactivate();
    } else {
      this._actions.update({ accounts });
    }
  }

  async _initialize(chainId) {
    if (this._eagerConnection) return this._eagerConnection;

    await (this._eagerConnection = import("@walletconnect/ethereum-provider").then(async (m) => {
      this.provider = new m.default({
        ...this._options,
        ...(chainId ? { chainId } : undefined),
      });

      this.provider.on("disconnect", this._handleDisconnect);
      this.provider.on("chainChanged", this._handleChainChange);
      this.provider.on("accountsChanged", this._handleAccountsChange);
    }));
  }

  async connectEagerly() {
    const cancelActivation = this._actions.startActivation();
    await this._initialize();

    if (this.provider?.connected) {
      try {
        const accounts = await this.provider.request({ method: "eth_accounts" });
        const chainId = await this.provider.request({ method: "eth_chainId" });

        if (accounts.length > 0) {
          this._actions.update({ chainId: parseInt(chainId), accounts });
        } else {
          throw new Error("No accounts returned");
        }
      } catch (error) {
        console.debug("Could not connect eagerly", error);
        cancelActivation();
      }
    } else {
      cancelActivation();
    }
  }

  async activate(desiredChainIdOrChainParameters) {
    const desiredChainId =
      typeof desiredChainIdOrChainParameters === "number"
        ? desiredChainIdOrChainParameters
        : desiredChainIdOrChainParameters?.chainId;

    // this early return clause catches some common cases if we're already connected
    if (this.provider?.connected) {
      if (desiredChainId === undefined) return;
      if (desiredChainId === this.provider.chainId) return;

      const desiredChainIdHex = `0x${Number(desiredChainId).toString(16)}`;

      return this.provider
        ?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: desiredChainIdHex }],
        })
        .catch(() => {
          void 0;
        });
    }

    this._actions.startActivation();

    // if we're trying to connect to a specific chain that we're not already initialized for, we have to re-initialize
    if (desiredChainId && desiredChainId !== this.provider?.chainId) {
      await this.deactivate();
    }

    await this._initialize(desiredChainId);

    try {
      const accounts = await this.provider.request({ method: "eth_requestAccounts" });
      const chainId = parseInt(await this.provider.request({ method: "eth_chainId" }));

      if (!desiredChainId || desiredChainId === chainId) {
        return this._actions.update({ chainId, accounts });
      }

      // because e.g. metamask doesn't support wallet_switchEthereumChain, we have to report first-time connections,
      // even if the chainId isn't necessarily the desired one. this is ok because in e.g. rainbow,
      // we won't report a connection to the wrong chain while the switch is pending because of the re-initialization
      // logic above, which ensures first-time connections are to the correct chain in the first place
      this._actions.update({ chainId, accounts });

      // try to switch to the desired chain, ignoring errors
      if (desiredChainId && desiredChainId !== chainId) {
        const desiredChainIdHex = `0x${Number(desiredChainId).toString(16)}`;
        return this.provider
          ?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: desiredChainIdHex }],
          })
          .catch(() => {
            void 0;
          });
      }
    } catch (error) {
      // this condition is a bit of a hack :/
      // if a user triggers the walletconnect modal, closes it, and then tries to connect again, the modal will not trigger.
      // the logic below prevents this from happening
      if (error.message === "User closed modal") {
        if (this._treatModalCloseAsError) {
          this._actions.reportError(error);
        }
        await this.deactivate();
      } else {
        this._actions.reportError(error);
      }
    }
  }

  async deactivate() {
    this.provider?.off("disconnect", this._handleDisconnect);
    this.provider?.off("chainChanged", this._handleChainChange);
    this.provider?.off("accountsChanged", this._handleAccountsChange);
    await this.provider?.disconnect();
    this.provider = undefined;
    this._eagerConnection = undefined;
    this._actions.reportError();
  }
}
