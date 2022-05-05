/**
 * ref:
 * @web3-react/metamask: https://github.com/NoahZinsmeister/web3-react/blob/main/packages/metamask/src/index.ts
 */
export default class Metamask {
  constructor(actions, connectEagerly = true) {
    this._actions = actions;
    if (connectEagerly) {
      this._eagerConnection = this.connectEagerly();
    }

    this._handleConnect = this._handleConnect.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleAccountsChange = this._handleAccountsChange.bind(this);
    this._handleChainChange = this._handleChainChange.bind(this);
    this._initialize = this._initialize.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  async _initialize() {
    if (this._eagerConnection) return this._eagerConnection;

    await (this._eagerConnection = import("@metamask/detect-provider")
      .then((m) => m.default(this.options))
      .then((provider) => {
        if (provider) {
          this.provider = provider;

          this.provider.on("connect", this._handleConnect);
          this.provider.on("disconnect", this._handleDisconnect);
          this.provider.on("chainChanged", this._handleChainChange);
          this.provider.on("accountsChanged", this._handleAccountsChange);
        }
      }));
  }

  async connectEagerly() {
    const cancelActivation = this._actions.startActivation();

    await this._initialize();
    if (!this.provider) {
      cancelActivation();
      this._actions.reportError(new Error("Metamask is not installed"));
      return;
    }

    if (this.provider !== window.ethereum) {
      this._actions.reportError(new Error("Do you have multiple wallets installed?"));
    }

    try {
      const [chainId, accounts] = await Promise.all([
        this.provider.request({ method: "eth_chainId" }),
        this.provider.request({ method: "eth_accounts" }),
      ]);
      if (accounts.length > 0) {
        console.log(accounts)
        this._actions.update({ chainId: parseInt(chainId), accounts });
      } else {
        throw new Error("No accounts returned");
      }
    } catch (error) {
      console.debug("Could not connect eagerly", error);
      cancelActivation();
    }
  }

  _handleChainChange(chainId) {
    this._actions.update({ chainId: parseInt(chainId) });
  }

  _handleConnect({ chainId }) {
    this._actions.update({ chainId: parseInt(chainId) });
  }

  _handleDisconnect(error) {
    console.debug("metamask disconnect", error);
    // this.deactivate();
    this._actions.reportError(error);
  }

  _handleAccountsChange(accounts) {
    if (accounts.length === 0) {
      this._actions.reportError(undefined);
    } else {
      this._actions.update({ accounts });
    }
  }

  async activate(desiredChainIdOrChainParameters) {
    this._actions.startActivation();

    await this._initialize();

    if (!this.provider) {
      this._actions.reportError(new Error("Metamask is not installed"));
      return;
    }

    const [chainId, accounts] = await Promise.all([
      this.provider.request({ method: "eth_chainId" }),
      this.provider.request({ method: "eth_requestAccounts" }),
    ]);

    const receivedChainId = parseInt(chainId);
    const desiredChainId =
      typeof desiredChainIdOrChainParameters === "number"
        ? desiredChainIdOrChainParameters
        : desiredChainIdOrChainParameters?.chainId;

    // if there's no desired chain, or it's equal to the received, update
    if (!desiredChainId || receivedChainId === desiredChainId) {
      return this._actions.update({ chainId: receivedChainId, accounts });
    }

    // if we're here, we can try to switch networks
    const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;
    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: desiredChainIdHex }],
      });
      await this.activate(desiredChainId);
    } catch (error) {
      if (error.code === 4902 && typeof desiredChainIdOrChainParameters !== "number") {
        // if we're here, we can try to add a new network
        try {
          await this.provider.request({
            method: "wallet_addEthereumChain",
            params: [{ ...desiredChainIdOrChainParameters, chainId: desiredChainIdHex }],
          });
        } catch (error) {
          this._actions.reportError(error);
          // await this.deactivate();
        }
      } else {
        this._actions.reportError(error);
        // await this.deactivate();
      }
    }
  }

  async deactivate() {
    this.provider?.removeListener("connect", this._handleConnect);
    this.provider?.removeListener("disconnect", this._handleDisconnect);
    this.provider?.removeListener("chainChanged", this._handleChainChange);
    this.provider?.removeListener("accountsChanged", this._handleAccountsChange);
    this.provider = undefined;
    this._eagerConnection = undefined;
    this._actions.reportError();
  }
}
