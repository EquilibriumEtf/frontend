import { EquilibriumClient } from '..'
import getVault from './getVault'
import getShares from './getShares'
import {
  ManagerModuleInfo,
  OsInfo,
} from '@abstract/abstract.js/dist/core/manager/Manager.types'
import { TokenInfoResponse } from '@abstract/abstract.js/dist/cw-plus/Cw20.types'

export interface Vault {
  id: number
  info: OsInfo
  module_infos: ManagerModuleInfo[]
  token_info: TokenInfoResponse
  cw20token: string
  value: {
    amount: number
    denom: string
  }
  value_dollar: number
  owner: string
}

export interface Share {
  value: number
  value_dollar: number
  total_shares: number
}

export default class Vaults {
  private client: EquilibriumClient

  constructor(client: EquilibriumClient) {
    this.client = client
  }

  public async getAll() {
    try {
      await this.client.connect()
      const cosmWasmClient = this.client.cosmWasmClient
      const factoryClient = this.client.factoryClient
      const versionControlClient = this.client.versionControlClient

      const config = await factoryClient.config()

      const osIds = Array.from(Array(config.next_os_id).keys()).slice(22)
      osIds.shift()

      const arr = osIds.map(async (osId) => {
        return await getVault(osId, {
          cosmWasmClient,
          factoryClient,
          versionControlClient,
        })
      })

      const result = await Promise.all(arr)
      return result.filter((item) => item !== null)
    } catch {
      throw new Error('Error fetching vaults')
    }
  }

  public async getByOwner({ owner }: { owner: string }) {
    try {
      const cosmWasmClient = this.client.cosmWasmClient
      const factoryClient = this.client.factoryClient
      const versionControlClient = this.client.versionControlClient

      const config = await factoryClient.config()

      const osIds = Array.from(Array(config.next_os_id).keys()).slice(22)
      osIds.shift()

      const arr = osIds.map(async (osId) => {
        return await getVault(osId, {
          cosmWasmClient,
          factoryClient,
          versionControlClient,
        })
      })

      const result = await Promise.all(arr)
      return result.filter((item) => item?.owner === owner)
    } catch {
      // throw new Error('Error fetching vaults')
      console.error('Error fetching vaults')
    }
  }

  public async getOne({ osId }: { osId: number }) {
    try {
      await this.client.connect()
      const cosmWasmClient = this.client.cosmWasmClient
      const factoryClient = this.client.factoryClient
      const versionControlClient = this.client.versionControlClient

      return await getVault(osId, {
        cosmWasmClient,
        factoryClient,
        versionControlClient,
      })
    } catch {
      // throw new Error('Error fetching vault')
      console.error('Error fetching vault')
    }
  }

  public async getShares({ osId, address }: { osId: number; address: string }) {
    try {
      await this.client.connect()
      const cosmWasmClient = this.client.cosmWasmClient
      const factoryClient = this.client.factoryClient
      const versionControlClient = this.client.versionControlClient

      return await getShares(osId, address, {
        cosmWasmClient,
        factoryClient,
        versionControlClient,
      })
    } catch {
      // throw new Error('Error fetching shares')
      console.error('Error fetching shares')
    }
  }
}
