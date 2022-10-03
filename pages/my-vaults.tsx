import { useWallet } from 'client'
import useEquilibriumClient from 'client/react/client/useEquilibriumClient'
import { useState, useEffect } from 'react'
import { Vault as VaultType } from 'client/core/vaults'
import { Vault } from 'components/vaults/Vault'
import { LoadingVault } from 'components/vaults/LoadingVault'
import { EmptyState } from 'components/layout/EmptyState'
import { isEmpty } from 'lodash'
import { Button } from 'components/ui'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { WalletButton } from 'components/layout/Wallet'
import { useRouter } from 'next/router'

export default function MyVaults() {
  const { client } = useEquilibriumClient()
  const { wallet } = useWallet()
  const router = useRouter()

  const [isLoadingVaults, setIsLoadingVaults] = useState<boolean>(true)

  const [vaults, setVaults] = useState<VaultType[]>()

  useEffect(() => {
    async function effect() {
      await client?.connect()
      client?.vaults.getByOwner({ owner: wallet?.address! }).then((vaults) => {
        setVaults(vaults as VaultType[])
        setIsLoadingVaults(false)
      })
    }

    if (client && wallet) effect()
  }, [client, wallet])

  return (
    <div className="max-w-5xl mx-8 sm:pt-24 lg:mx-auto">
      <h2 className="text-2xl font-semibold lg:text-3xl">My Vaults</h2>
      <div className="flex flex-row mt-4 space-x-2 overflow-y-scroll">
        {isLoadingVaults && wallet?.address
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
        {(isEmpty(vaults) && !isLoadingVaults) || !wallet?.address ? (
          <div className="w-full border rounded-md border-black/10 dark:border-white/10">
            <div className="py-24 mx-auto">
              <EmptyState />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {!wallet ? (
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
      ) : (
        <div className="flex flex-col items-center justify-between w-full px-8 py-16 mt-8 border rounded-md sm:flex-row border-black/25 dark:border-primary-500/25 bg-black/10 dark:bg-primary-500/10">
          <div>
            <h3 className="text-xl font-bold">Create a vault</h3>
            <p className="w-2/3">
              Create a vault in seconds with your own selection of assets.
            </p>
          </div>
          <div className="flex items-end">
            <Button onClick={() => router.push('/new')}>
              <PlusCircleIcon className="w-4 h-4 mr-2 text-white" />
              Create vault
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
