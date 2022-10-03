import { useEquilibriumClient, useWallet } from 'client'
import { Button, Input, Textarea } from 'components/ui'
import { useEffect, useState } from 'react'
import { classNames } from 'util/css'
import { WalletButton } from 'components/layout/Wallet'
import { useCallback } from 'react'
import createOsMsg, {
  installModuleMsg,
  registerAssets,
} from 'client/core/vaults/createVault'
import {
  FactoryMessageComposer,
  ManagerClient,
  ProxyClient,
  ManagerQueryClient,
  VersionControlClient,
} from '@abstract/abstract.js'
import { Tx, useTx } from 'contexts/tx'
import { useRouter } from 'next/router'
import { ABSTRACT_DEPLOYMENTS } from 'config/addresses'

const Crown = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    focusable="false"
    role="img"
    aria-label="avatar"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M2 19h20v2H2v-2zM2 5l5 3.5L12 2l5 6.5L22 5v12H2V5zm2 3.841V15h16V8.841l-3.42 2.394L12 5.28l-4.58 5.955L4 8.84z"></path>
    </g>
  </svg>
)

const YinYang = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 496 512"
    focusable="false"
    role="img"
    aria-label="avatar"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm0 376c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0-128c-53.02 0-96 42.98-96 96s42.98 96 96 96c-106.04 0-192-85.96-192-192S141.96 64 248 64c53.02 0 96 42.98 96 96s-42.98 96-96 96zm0-128c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z"></path>
  </svg>
)

export default function NewVault() {
  const { wallet } = useWallet()
  const { client } = useEquilibriumClient()
  const { tx } = useTx()

  const router = useRouter()

  const [step, setStep] = useState<number>(1)

  const [manager, setManager] = useState<'monarchy' | 'daodao'>('monarchy')

  const [osId, setOsId] = useState<number>()

  const [managerClient, setManagerClient] = useState<ManagerClient>()
  const [proxyClient, setProxyClient] = useState<ProxyClient>()

  const [osName, setOsName] = useState<string>()
  const [osDescription, setOsDescription] = useState<string>()
  const [etfFee, setEtfFee] = useState<number>()

  const handleCreate = useCallback(async () => {
    if (step !== 1) return
    if (
      client?.factoryMessageComposer &&
      client?.versionControlClient &&
      osName &&
      osDescription
    ) {
      const newOsInfo = {
        name: osName,
        description: osDescription,
        root: wallet?.address!,
      }
      const msg = await createOsMsg(newOsInfo, {
        factoryMessageComposer: client?.factoryMessageComposer,
      })
      tx(
        [msg],
        {
          toast: {
            title: 'OS created successfully',
          },
        },
        async (log) => {
          // Get osid from logs
          const osId = log.events
            .find((e: any) => e.type === 'wasm')
            .attributes.find((attr: any) => attr.key === 'os_id:')

          // Get osdata
          const osCore = await client?.versionControlClient.osCore({
            osId: parseInt(osId.value),
          })

          setOsId(parseInt(osId.value))

          // Create clients
          setManagerClient(
            new ManagerClient(
              client?.signingCosmWasmClient!,
              wallet?.address!,
              osCore.os_core.manager,
            ),
          )
          setProxyClient(
            new ProxyClient(
              client?.signingCosmWasmClient!,
              wallet?.address!,
              osCore.os_core.proxy,
            ),
          )

          // Set to next step
          setStep(2)
        },
      )
    }
  }, [
    manager,
    osName,
    osDescription,
    client?.factoryMessageComposer,
    client?.versionControlClient,
    step,
  ])

  const handleInstallETF = useCallback(async () => {
    if (step !== 2) return
    if (client && etfFee) {
      const initMsg = {
        base: {
          memory_address:
            ABSTRACT_DEPLOYMENTS[client.chainInfo.chain_id]['MEMORY'],
        },
        token_code_id: parseInt(process.env.NEXT_PUBLIC_CW20_CODE_ID!),
        fee: (etfFee / 100).toString(),
        provider_addr: wallet?.address!,
      }

      const msg = await installModuleMsg('etf', initMsg, {
        managerClient: managerClient!,
      })

      tx([msg], {}, () => {
        setStep(3)
      })
    }
  }, [etfFee, client, step])

  const handleInstallBalancer = useCallback(async () => {
    if (step !== 3) return
    if (client && etfFee) {
      const initMsg = {
        base: {
          memory_address:
            ABSTRACT_DEPLOYMENTS[client.chainInfo.chain_id]['MEMORY'],
        },
        token_code_id: parseInt(process.env.NEXT_PUBLIC_CW20_CODE_ID!),
        fee: (etfFee / 100).toString(),
        provider_addr: wallet?.address!,
      }

      const msg = await installModuleMsg('balancer', initMsg, {
        managerClient: managerClient!,
      })

      tx([msg], {}, () => {
        setStep(4)
      })
    }
  }, [etfFee, client, step])

  const handleRegisterAssets = useCallback(async () => {
    if (step !== 4) return
    if (managerClient && osId) {
      const msg = await registerAssets({ managerClient })

      tx([msg], {}, () => {
        router.push(`/vault/${osId}`)
      })
    }
  }, [managerClient, step, osId])

  return !wallet ? (
    <div className="max-w-5xl pt-8 mx-8 sm:pt-24 lg:mx-auto">
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
    </div>
  ) : (
    <form className="max-w-5xl pt-8 mx-8 sm:pt-24 lg:mx-auto">
      <h2 className="text-2xl font-semibold lg:text-3xl">Create New Vault</h2>

      <fieldset
        className={classNames(
          step >= 0 ? 'opacity-100' : 'opacity-50 cursor-not-allowed',
          'mt-6',
        )}
      >
        <h3 className="text-xl font-medium">Manager</h3>
        <p className="text-black/50 dark:text-white/50">
          What type of entity will be managing this ETF?
        </p>
        <div className="grid grid-cols-1 gap-4 p-4 mt-2 rounded-md bg-black/10 dark:bg-white/10">
          <a className="flex flex-row items-start px-4 py-3 space-x-2 text-left rounded-lg cursor-pointer bg-gradient-to-r from-primary-400 to-primary-600">
            <Crown className="w-6 h-6 mt-0.5" />
            <div>
              <p className="text-lg font-medium text-white">Monarchy</p>
              <p className="text-white/50">
                You will be the sole manager of this ETF.
              </p>
            </div>
          </a>
          <a className="flex flex-row items-start px-4 py-3 space-x-2 text-left border rounded-lg cursor-not-allowed border-black/25 dark:border-white/25">
            <YinYang className="w-6 h-6 mt-0.5" />
            <div>
              <p className="text-lg font-medium text-white">DAO DAO</p>
              <p className="text-white/50">
                Your DAO will be the common manager of this ETF.
              </p>
            </div>
          </a>
        </div>
      </fieldset>

      <fieldset
        className={classNames(
          step >= 1 ? 'opacity-100' : 'opacity-50 cursor-not-allowed',
          'mt-6',
        )}
      >
        <h3 className="text-xl font-medium">ETF Information</h3>
        <p className="text-black/50 dark:text-white/50">
          Please provide a name and description for your new ETF.
        </p>
        <div className="grid grid-cols-1 gap-4 p-4 mt-2 rounded-md bg-black/10 dark:bg-white/10">
          <Input
            label="Name"
            id="os-name"
            required
            value={osName}
            onChange={(e) => setOsName(e.currentTarget.value)}
          />
          <Textarea
            label="Description"
            id="os-description"
            required
            value={osDescription}
            onChange={(e) => setOsDescription(e.currentTarget.value)}
          />
          <Input
            disabled
            label="Root address"
            id="os-root"
            required
            value={wallet?.address!}
          />
          <Input
            label="Fee % (0-50%)"
            id="etf-fee"
            placeholder="% of fees to charge the users of the ETF"
            type="number"
            min={0}
            max={100}
            trailingAddon="%"
            required
            value={etfFee}
            onChange={(e) => {
              const value = e.currentTarget.value
              const intValue = parseInt(value)
              if (intValue > 0 && intValue < 50) setEtfFee(intValue)
              else if (!value) setEtfFee(0)
            }}
          />
          <div className="flex flex-row justify-end">
            <Button onClick={handleCreate} variant="secondary">
              Create OS
            </Button>
          </div>
        </div>
      </fieldset>

      <fieldset
        className={classNames(
          step >= 2 ? 'opacity-100' : 'opacity-50 cursor-not-allowed',
          'mt-6',
        )}
      >
        <h3 className="text-xl font-medium">Install ETF module</h3>
        <p className="text-black/50 dark:text-white/50">
          Install the ETF module onto your OS to deposit tokens.
        </p>
        <div className="grid grid-cols-1 gap-4 p-4 mt-2 rounded-md bg-black/10 dark:bg-white/10">
          <div className="flex flex-row justify-end">
            <Button onClick={handleInstallETF} variant="secondary">
              Install Module
            </Button>
          </div>
        </div>
      </fieldset>

      <fieldset
        className={classNames(
          step >= 3 ? 'opacity-100' : 'opacity-50 cursor-not-allowed',
          'mt-6',
        )}
      >
        <h3 className="text-xl font-medium">Install Balancer module</h3>
        <p className="text-black/50 dark:text-white/50">
          Install the balancer module onto your OS to automatically rebalance
          your ETF.
        </p>
        <div className="grid grid-cols-1 gap-4 p-4 mt-2 rounded-md bg-black/10 dark:bg-white/10">
          <div className="flex flex-row justify-end">
            <Button onClick={handleInstallBalancer} variant="secondary">
              Install Module
            </Button>
          </div>
        </div>
      </fieldset>

      <fieldset
        className={classNames(
          step >= 4 ? 'opacity-100' : 'opacity-50 cursor-not-allowed',
          'mt-6',
        )}
      >
        <h3 className="text-xl font-medium">Register ETF Assets</h3>
        <p className="text-black/50 dark:text-white/50">
          Regsiter the JUNO/OSMO pool to your ETF to bond tokens.
        </p>
        <div className="grid grid-cols-1 gap-4 p-4 mt-2 rounded-md bg-black/10 dark:bg-white/10">
          <div className="flex flex-row justify-end">
            <Button onClick={handleRegisterAssets} variant="secondary">
              Register Assets
            </Button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}
