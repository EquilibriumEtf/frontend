import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { WalletData } from './wallet'
import { Chain } from '@chain-registry/types'
import {
  FactoryClient,
  FactoryQueryClient,
  FactoryMessageComposer,
  MemoryClient,
  MemoryQueryClient,
  VersionControlClient,
  VersionControlQueryClient,
} from '@abstract/abstract.js'
import { ABSTRACT_DEPLOYMENTS } from 'config/addresses'
import connectCosmWasmClient from './cosmwasm/connect'
import Vaults from './vaults'
import Assets from './assets'

export interface EquilibriumClientConstructor {
  wallet: WalletData | null
  chainInfo: Chain
  signingCosmWasmClient: SigningCosmWasmClient | null
}

export class EquilibriumClient {
  private _cosmWasmClient: CosmWasmClient | null = null
  public signingCosmWasmClient: SigningCosmWasmClient | null = null

  private _factoryClient: FactoryQueryClient | null = null
  public signingFactoryClient: FactoryClient | null = null
  public factoryMessageComposer: FactoryMessageComposer | null = null

  private _memoryClient: MemoryQueryClient | null = null
  public signingMemoryClient: MemoryClient | null = null

  private _versionControlClient: VersionControlQueryClient | null = null
  public signingVersionControlClient: VersionControlClient | null = null

  public factoryContract: string | null = null
  public memoryContract: string | null = null
  public versionControlContract: string | null = null

  public chainInfo: Chain

  private _wallet: WalletData | null = null
  private _vaults: Vaults | null = null
  private _assets: Assets | null = null

  constructor({
    wallet,
    chainInfo,
    signingCosmWasmClient,
  }: EquilibriumClientConstructor) {
    this._wallet = wallet
    this.chainInfo = chainInfo
    this.signingCosmWasmClient = signingCosmWasmClient
  }

  public async connect() {
    // CosmWasm client already exists!
    if (this._cosmWasmClient) {
      return
    }

    // Create CosmWasm client
    this._cosmWasmClient = await connectCosmWasmClient(
      process.env.NEXT_PUBLIC_RPC!,
    )

    // Create query clients
    await this.createFactoryClient()
    await this.createMemoryClient()
    await this.createVersionControlClient()

    // Remove factoryMessageComposer if we are not connected anymore
    await this.createFactoryMessageComposer()
  }

  public get cosmWasmClient(): CosmWasmClient {
    return this._cosmWasmClient as CosmWasmClient
  }

  public get factoryClient(): FactoryQueryClient {
    return (
      this.signingFactoryClient || (this._factoryClient as FactoryQueryClient)
    )
  }
  public get memoryClient(): MemoryQueryClient {
    return this.signingMemoryClient || (this._memoryClient as MemoryQueryClient)
  }
  public get versionControlClient(): VersionControlQueryClient {
    return (
      this.signingVersionControlClient ||
      (this._versionControlClient as VersionControlQueryClient)
    )
  }

  public get wallet(): WalletData {
    return this._wallet as WalletData
  }

  public get vaults(): Vaults {
    if (!this.cosmWasmClient) {
      throw new Error('Client not connected')
    }

    if (this._vaults) {
      return this._vaults
    }

    this._vaults = new Vaults(this)
    return this._vaults
  }

  public get assets(): Assets {
    if (this._assets) {
      return this._assets
    }

    this._assets = new Assets()
    return this._assets
  }

  private async createFactoryClient() {
    this.factoryContract =
      ABSTRACT_DEPLOYMENTS[this.chainInfo.chain_id]['OS_FACTORY']

    if (this._wallet?.address && this.signingCosmWasmClient) {
      this.signingFactoryClient = new FactoryClient(
        this.signingCosmWasmClient,
        this._wallet.address,
        this.factoryContract,
      )
    } else if (this.cosmWasmClient) {
      this._factoryClient = new FactoryQueryClient(
        this.cosmWasmClient,
        this.factoryContract,
      )
    }

    return this.signingFactoryClient ?? this._factoryClient
  }

  private async createFactoryMessageComposer() {
    this.factoryContract =
      ABSTRACT_DEPLOYMENTS[this.chainInfo.chain_id]['OS_FACTORY']

    if (this._wallet?.address && this.signingCosmWasmClient) {
      this.factoryMessageComposer = new FactoryMessageComposer(
        this._wallet.address,
        this.factoryContract,
      )
    } else {
      this.factoryMessageComposer = null
    }

    return this.factoryMessageComposer
  }

  private async createMemoryClient() {
    this.memoryContract =
      ABSTRACT_DEPLOYMENTS[this.chainInfo.chain_id]['MEMORY']
    if (this._wallet?.address && this.signingCosmWasmClient) {
      this.signingMemoryClient = new MemoryClient(
        this.signingCosmWasmClient,
        this._wallet.address,
        this.memoryContract,
      )
    } else if (this.cosmWasmClient) {
      this._memoryClient = new MemoryQueryClient(
        this.cosmWasmClient,
        this.memoryContract,
      )
    }

    return this.signingMemoryClient ?? this._memoryClient
  }

  private async createVersionControlClient() {
    this.versionControlContract =
      ABSTRACT_DEPLOYMENTS[this.chainInfo.chain_id]['VERSION_CONTROL']
    if (this._wallet?.address && this.signingCosmWasmClient) {
      this.signingVersionControlClient = new VersionControlClient(
        this.signingCosmWasmClient,
        this._wallet.address,
        this.versionControlContract!,
      )
    } else if (this.cosmWasmClient) {
      this._versionControlClient = new VersionControlQueryClient(
        this.cosmWasmClient,
        this.versionControlContract!,
      )
    }

    return this.signingVersionControlClient ?? this._versionControlClient
  }

  public async connectSigning() {
    try {
      if (!this.cosmWasmClient) {
        throw new Error('cosmWasmClient could not connect')
      }

      if (!this.signingCosmWasmClient) {
        throw new Error('signingCosmWasmClient could not connect')
      }

      // Create signing clients
      await this.createFactoryClient()
      await this.createMemoryClient()
      await this.createVersionControlClient()
      await this.createFactoryMessageComposer()

      return this._wallet
    } catch (e) {
      console.error(e)
    }
  }

  public async disconnectSigning() {
    this.signingCosmWasmClient?.disconnect()
    this._wallet = null
  }
}
