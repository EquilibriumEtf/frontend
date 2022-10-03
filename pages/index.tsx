import { useWallet } from '@cosmos-kit/react'
import { WalletButton } from 'components/layout/Wallet'
import { Vault } from 'components/vaults/Vault'
import client from 'client/OfflineClient'
import { Asset } from 'client/core/assets'
import { Vault as VaultType } from 'client/core/vaults'
import useEquilibriumClient from 'client/react/client/useEquilibriumClient'
import { useEffect, useState } from 'react'
import { LoadingVault } from 'components/vaults/LoadingVault'

export default function Home() {
  const { client } = useEquilibriumClient()

  const [isLoadingVaults, setIsLoadingVaults] = useState<boolean>(true)
  const [isLoadingAssets, setIsLoadingAssets] = useState<boolean>(true)

  const [vaults, setVaults] = useState<VaultType[]>()
  const [assets, setAssets] = useState<Asset[]>()

  useEffect(() => {
    async function effect() {
      await client?.connect()
      client?.vaults.getAll().then((vaults) => {
        setVaults(vaults as VaultType[])
        setIsLoadingVaults(false)
      })
      client?.assets.getAll({ fetchHistorical: true }).then((assets) => {
        setAssets(assets as Asset[])
        setIsLoadingAssets(false)
      })
    }

    if (client) effect()
  }, [client])

  const { currentWallet } = useWallet()
  return (
    <div className="max-w-5xl mx-8 sm:pt-24 lg:mx-auto">
      <h2 className="text-2xl font-semibold lg:text-3xl">Featured Vaults</h2>
      <div className="flex flex-row mt-4 space-x-2 overflow-y-scroll">
        {isLoadingVaults
          ? [1, 2, 3, 4, 5].map((key) => <LoadingVault key={key} />)
          : vaults?.map((vault: VaultType, key: number) => (
              <Vault
                key={key}
                name={vault?.info.name}
                price={
                  vault?.value_dollar! /
                    (parseInt(vault?.token_info.total_supply!) / 1_000_000) || 0
                }
                priceLength={
                  vault?.value_dollar! /
                    (parseInt(vault?.token_info.total_supply!) / 1_000_000) <
                  0.01
                    ? 5
                    : 2
                }
                href={`/vault/${vault?.id}`}
                // change={2}
              />
            ))}
      </div>
      <h2 className="mt-8 text-xl font-semibold lg:text-2xl">Popular Assets</h2>
      <div className="flex flex-row mt-4 space-x-2 overflow-y-scroll">
        {isLoadingAssets
          ? [1, 2, 3, 4, 5].map((key) => <LoadingVault key={key} />)
          : assets?.map(({ token: asset, historical }, key) => (
              <Vault
                key={key}
                name={asset.symbol}
                price={asset.price}
                change={asset.price_24h_change}
                divider={''}
                href={`https://info.osmosis.zone/token/${asset.symbol}`}
                image={`https://raw.githubusercontent.com/cosmos/chain-registry/master/${asset.name.toLowerCase()}/images/${asset.symbol.toLowerCase()}.png`}
                dataset={historical.reverse().slice(0, 24).reverse()}
              />
            ))}
      </div>
      {!currentWallet && (
        <div className="flex flex-col items-center justify-between w-full px-8 py-16 mt-8 border rounded-md sm:flex-row border-black/25 dark:border-primary-500/25 bg-black/10 dark:bg-primary-500/10">
          <div>
            <h3 className="text-xl font-bold">Want to start your own vault?</h3>
            <p className="w-2/3">
              Create a vault in seconds with your own selection of assets by
              connecting a wallet.
            </p>
          </div>
          <div className="flex items-end">
            <WalletButton />
          </div>
        </div>
      )}
    </div>
  )
}
