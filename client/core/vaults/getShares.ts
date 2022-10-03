import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import {
  FactoryQueryClient,
  EtfQueryClient,
  Cw20QueryClient,
  VersionControlQueryClient,
  ManagerQueryClient,
  ProxyQueryClient,
} from '@abstract/abstract.js'
import getAssetData from '../assets/getAssetData'
import { Share } from '.'

export default async function getShares(
  osId: number,
  address: string,
  {
    cosmWasmClient,
    factoryClient,
    versionControlClient,
  }: {
    cosmWasmClient: CosmWasmClient
    factoryClient: FactoryQueryClient
    versionControlClient: VersionControlQueryClient
  },
): Promise<Share | null> {
  const osCoreData = await versionControlClient.osCore({ osId })
  const managerClient = new ManagerQueryClient(
    cosmWasmClient,
    osCoreData.os_core.manager,
  )
  const proxyClient = new ProxyQueryClient(
    cosmWasmClient,
    osCoreData.os_core.proxy,
  )

  const config = await managerClient.config()
  const owner = config.root // this is the owner of the vault

  const info = await managerClient.info()
  const module_info = await managerClient.moduleInfos({})

  const etf = module_info.module_infos.find((i) => i.name === 'abstract:etf')

  // If the etf module is not included in the OS, return null
  if (!etf) return null

  const etfClient = new EtfQueryClient(cosmWasmClient, etf.address)
  const etfState = await etfClient.state()

  let totalValue, baseAsset
  try {
    totalValue = await proxyClient.totalValue()
    baseAsset = await proxyClient.baseAsset()
  } catch {
    console.error('Could not query total value or base asset')
  }

  const cw20Client = new Cw20QueryClient(
    cosmWasmClient,
    etfState.liquidity_token,
  )

  const balance = await cw20Client.balance({ address })

  // Replace baseAsset with first default base asset if it does not pertain to the list
  if (
    !process.env
      .NEXT_PUBLIC_ASSETS!.split(',')
      .includes(baseAsset?.base_asset.asset!)
  )
    baseAsset = process.env.NEXT_PUBLIC_ASSETS!.split(',')[0]

  // Get value in $
  const assetData = await getAssetData(baseAsset as string)
  const value_dollar =
    (parseInt(totalValue?.value!) / 1_000_000) * assetData.price

  // Return the share info!
  return {
    value: parseInt(totalValue?.value!),
    value_dollar,
    total_shares: parseInt(balance.balance),
  }
}
