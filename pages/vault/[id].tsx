import { Share, Vault as VaultType } from 'client/core/vaults'
import useEquilibriumClient from 'client/react/client/useEquilibriumClient'
import { Price } from 'components/vaults/Price'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Button, Input } from 'components/ui'
import { useWallet } from 'client'
import { Asset } from 'client/core/assets'
import { BanknotesIcon, TicketIcon } from '@heroicons/react/24/solid'
import { LoadingVault } from 'components/vaults/LoadingVault'
import { Vault } from 'components/vaults/Vault'
import dynamic from 'next/dynamic'
import { Address } from 'components/vaults/Address'
import { Modal } from 'components/FSModal'
import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { EtfMessageComposer } from '@abstract/abstract.js'
import { coins } from '@cosmjs/stargate'
import { useTx } from 'contexts/tx'
import buyShares, { withdrawShares } from 'client/core/vaults/createShares'

const Chart = dynamic(() => import('../../components/charts/Chart'), {
  ssr: false,
})

export default function VaultDetail() {
  const router = useRouter()
  const { client } = useEquilibriumClient()
  const { wallet } = useWallet()
  const { tx } = useTx()

  const [vault, setVault] = useState<VaultType>()
  const [assets, setAssets] = useState<Asset[]>()
  const [shares, setShares] = useState<Share | null>()

  const [isLoadingVault, setIsLoadingVault] = useState<boolean>(true)
  const [isLoadingShares, setIsLoadingShares] = useState<boolean>(true)
  const [isLoadingAssets, setIsLoadingAssets] = useState<boolean>(true)

  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false)
  const [buyAmount, setBuyAmount] = useState<number>(0)

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false)
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0)

  const handleBuyModal = useCallback(() => {
    setIsBuyModalOpen(!isBuyModalOpen)
    setBuyAmount(0)
  }, [isBuyModalOpen])

  const handleWithdrawModal = useCallback(() => {
    setIsWithdrawModalOpen(!isWithdrawModalOpen)
    setWithdrawAmount(0)
  }, [isWithdrawModalOpen])

  const { id } = router.query

  useEffect(() => {
    async function effect() {
      await client?.connect()
      client?.vaults.getOne({ osId: parseInt(id as string) }).then((vault) => {
        if (!vault) return router.push('/404')
        setVault(vault as VaultType)
        setIsLoadingVault(false)
      })
      client?.assets.getAll({}).then((assets) => {
        setAssets(assets as Asset[])
        setIsLoadingAssets(false)
      })
      if (wallet)
        client?.vaults
          .getShares({
            osId: parseInt(id as string),
            address: wallet?.address!,
          })
          .then((shares) => {
            setShares(shares)
            setIsLoadingShares(false)
          })
    }

    if (client && id) effect()
  }, [client, id, wallet])

  const handleBuyShares = useCallback(async () => {
    if (!wallet) return
    const microAmount = buyAmount * 1_000_000
    const asset = process.env.NEXT_PUBLIC_DENOM!

    const etf = vault?.module_infos.find((i) => i.name === 'abstract:etf')

    const buyMsg = await buyShares({
      module: etf!,
      sender: wallet.address,
      microAmount,
      asset,
    })

    tx([buyMsg], {})
  }, [buyAmount])

  const handleWithdrawShares = useCallback(async () => {
    if (!wallet) return
    const microAmount = withdrawAmount * 1_000_000

    const etf = vault?.module_infos.find((i) => i.name === 'abstract:etf')

    const withdrawMsg = await withdrawShares({
      module: etf!,
      sender: wallet.address,
      cw20token: vault?.cw20token!,
      microAmount: microAmount.toFixed(0),
    })

    tx([withdrawMsg], {})
  }, [withdrawAmount])

  return (
    <div className="max-w-5xl pt-8 mx-8 sm:pt-24 lg:mx-auto">
      <Modal
        actions={[
          {
            button: 'secondary',
            name: 'Buy Shares',
            action: handleBuyShares,
          },
          {
            button: 'outline',
            name: 'Cancel',
            action: () => {},
          },
        ]}
        open={isBuyModalOpen || false}
        handleStateChange={handleBuyModal}
      >
        <h3 className="-mt-1 text-lg font-semibold text-black dark:text-white">
          Buy Shares of {vault?.info.name!}
        </h3>
        <div className="mt-2">
          <Input
            id="juno-amount"
            type="number"
            label="Amount to deposit"
            trailingAddon="JUNO"
            onChange={(e) => {
              setBuyAmount(parseInt(e.currentTarget.value))
            }}
          />
        </div>
      </Modal>
      <Modal
        actions={[
          {
            button: 'secondary',
            name: 'Withdraw Shares',
            action: handleWithdrawShares,
          },
          {
            button: 'outline',
            name: 'Cancel',
            action: () => {},
          },
        ]}
        open={isWithdrawModalOpen || false}
        handleStateChange={handleWithdrawModal}
      >
        <h3 className="-mt-1 text-lg font-semibold text-black dark:text-white">
          Withdraw Shares of {vault?.info.name!}
        </h3>
        <div className="mt-2">
          <Input
            id="share-amount"
            type="number"
            label="Amount to withdraw"
            trailingAddon="shares"
            step={1}
            onChange={(e) => {
              setWithdrawAmount(parseInt(e.currentTarget.value))
            }}
          />
        </div>
      </Modal>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        {isLoadingVault ? (
          <div>
            <div className="w-64 h-10 rounded-md bg-black/25 dark:bg-white/25 animate-pulse"></div>
            <div className="flex flex-row items-center mt-2">
              <div className="w-24 h-5 text-lg font-bold rounded-md bg-black/25 dark:bg-white/25 animate-pulse"></div>
              <div className="w-12 h-4 mt-1 ml-1 text-xs rounded-sm font-inter bg-black/10 dark:bg-white/10 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mb-1.5 text-2xl font-semibold lg:text-3xl">
              {vault?.info.name}
            </h2>
            <Price
              large
              price={
                vault?.value_dollar! /
                  (parseInt(vault?.token_info.total_supply!) / 1_000_000) || 0
              }
              length={
                vault?.value_dollar! /
                  (parseInt(vault?.token_info.total_supply!) / 1_000_000) <
                0.01
                  ? 5
                  : 2
              }
              divider="share"
            />
          </div>
        )}
        <Button
          variant="secondary"
          disabled={isLoadingVault || !wallet}
          onClick={handleBuyModal}
          className="inline-flex justify-center mt-2 bg-green-500 hover:bg-green-700 sm:mt-0"
        >
          <BanknotesIcon className="w-5 h-5 mr-2 text-black" />
          Buy Shares
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-3">
        {isLoadingVault || isLoadingAssets ? (
          <div className="w-full h-[65vh] col-span-2 bg-black/10 dark:bg-white/10 animate-pulse border border-black/10 dark:border-white/10 rounded-md"></div>
        ) : (
          <div className="w-full h-[65vh] col-span-2 border border-black/10 dark:border-white/10 rounded-md">
            <Chart />
          </div>
        )}
        <div className="w-full h-full col-span-1 p-5 border rounded-md border-black/10 dark:border-white/10">
          {wallet && (
            <div>
              <h4 className="text-xl font-semibold">Your Shares</h4>
              <div className="p-4 rounded-lg mt-1.5 bg-black/10 dark:bg-white/10 border-black/25 dark:border-white/25">
                {isLoadingShares ? (
                  <div>
                    <div className="w-24 mt-0.5 h-6 text-lg font-semibold rounded-md bg-black/50 dark:bg-white/50 animate-pulse"></div>
                    <div className="h-4 mt-2 mb-2 rounded-md w-28 bg-black/25 dark:bg-white/25 animate-pulse"></div>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold">
                      ${(shares ? shares?.value_dollar : 0).toFixed(2)}
                    </p>
                    <p className="mb-2 mt-0.5 text-black/50 dark:text-white/50">
                      {(shares ? shares?.total_shares / 1_000_000 : 0).toFixed(
                        0,
                      )}{' '}
                      shares
                    </p>
                  </div>
                )}
                <div className="w-full">
                  <Button
                    disabled={isLoadingAssets}
                    onClick={handleWithdrawModal}
                    className="inline-flex justify-center w-full"
                    variant="secondary"
                  >
                    <TicketIcon className="w-5 h-5 mr-2 text-black" />
                    Redeem my shares
                  </Button>
                </div>
              </div>
            </div>
          )}
          <h4 className="mt-4 text-xl font-semibold">Assets</h4>
          <div className="flex flex-row mt-4 space-x-2 overflow-y-scroll">
            {isLoadingAssets
              ? [1, 2].map((key) => <LoadingVault small key={key} />)
              : assets?.map(({ token: asset }, key) => (
                  <Vault
                    key={key}
                    name={asset.symbol}
                    price={50}
                    currency="%"
                    divider={''}
                    href={`https://info.osmosis.zone/token/${asset.symbol}`}
                    image={`https://raw.githubusercontent.com/cosmos/chain-registry/master/${asset.name.toLowerCase()}/images/${asset.symbol.toLowerCase()}.png`}
                    graph={false}
                    small
                  />
                ))}
          </div>
          <h4 className="mt-4 text-xl font-semibold">Creator</h4>
          <div className="mt-2">
            {isLoadingVault ? (
              <div className="w-full h-12 mt-1 rounded-md bg-black/25 dark:bg-white/25 animate-pulse"></div>
            ) : (
              <Address address={vault?.owner!} copy />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
