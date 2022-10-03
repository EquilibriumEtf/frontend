import {
  FactoryQueryClient,
  VersionControlQueryClient,
  ManagerQueryClient,
  ProxyQueryClient,
  EtfQueryClient,
  Cw20QueryClient,
} from '@abstract/abstract.js'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Vault } from '.'
import getAssetData from '../assets/getAssetData'

export default async function getVault(
  osId: number,
  {
    cosmWasmClient,
    factoryClient,
    versionControlClient,
  }: {
    cosmWasmClient: CosmWasmClient
    factoryClient: FactoryQueryClient
    versionControlClient: VersionControlQueryClient
  },
): Promise<Vault | null> {
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

  console.log(etfState)

  const cw20Client = new Cw20QueryClient(
    cosmWasmClient,
    etfState.liquidity_token,
  )
  const tokenInfo = await cw20Client.tokenInfo()

  let totalValue, baseAsset
  try {
    totalValue = await proxyClient.totalValue()
    baseAsset = await proxyClient.baseAsset()
  } catch {
    console.error('Could not query total value or base asset')
  }

  // Replace baseAsset with first default base asset if it does not pertain to the list
  if (
    !process.env
      .NEXT_PUBLIC_ASSETS!.split(',')
      .includes(baseAsset?.base_asset.asset || '')
  )
    baseAsset = process.env.NEXT_PUBLIC_ASSETS!.split(',')[0]

  // Get value in $
  const assetData = await getAssetData(baseAsset as string)
  const value_dollar =
    (parseInt(totalValue?.value || '0') / 1_000_000) * assetData.price

  // Return the vault info!
  return {
    id: osId,
    info: info.info,
    module_infos: module_info.module_infos,
    value: {
      amount: parseInt(totalValue?.value!),
      denom: baseAsset as string,
    },
    cw20token: etfState.liquidity_token,
    token_info: tokenInfo,
    value_dollar,
    owner,
  }
}
