import { createContext, ReactNode, useState, useEffect } from 'react'
import { useWallet } from '@cosmos-kit/react'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClient } from '@cosmjs/stargate'
import { WalletData } from 'client/core/wallet'
import { chains, assets } from 'chain-registry'

// Wallet context

// The wallet context provides wallet information (name, address) and signing clients to the app,
// to sign transactions and communicate directly with Stargate or CosmWasm contracts.

// OfflineSigner allows the signing of simple wallet transactions like the transfer of funds.
// SigningCosmWasmClient allows execution of CosmWasm contracts like when minting an NFT.
// SigningStargateClient allows communication with the Cosmos SDK (used when emitting cosmos messages like delegation or voting).

export interface WalletContext {
  connect: () => void
  disconnect: () => void
  refreshBalance: () => void
  signingCosmWasmClient?: SigningCosmWasmClient
  signingStargateClient?: SigningStargateClient
  wallet?: WalletData
}

export const Wallet = createContext<WalletContext>({
  connect: () => {},
  disconnect: () => {},
  refreshBalance: () => {},
  signingCosmWasmClient: undefined,
  signingStargateClient: undefined,
  wallet: undefined,
})

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // Current wallet data
  const [wallet, setWallet] = useState<WalletData>()
  const [signingCosmWasmClient, setSigningCosmWasmClient] = useState<
    SigningCosmWasmClient
  >()
  const [signingStargateClient, setSigningStargateClient] = useState<
    SigningStargateClient
  >()

  const [refreshCounter, setRefreshCounter] = useState<number>(0)

  const { currentWallet, connect, disconnect, currentChainName } = useWallet()

  const chain = chains.find((c) => c.chain_name === currentChainName)
  const asset = assets.find((a) => a.chain_name === currentChainName)

  const refreshBalance = () => {
    setRefreshCounter(refreshCounter + 1)
  }

  // Refresh the wallet's balance when the refresh counter is incremented
  useEffect(() => {
    async function effect() {
      if (currentWallet) {
        const signingCosmWasmClient = await currentWallet.getCosmWasmClient()
        const balance = await signingCosmWasmClient?.queryClient.bank.balance(
          currentWallet.address,
          asset?.assets[0].denom_units[0].denom,
        )

        // Set the wallet data
        setWallet({
          address: currentWallet.address,
          name: currentWallet.name,
          balance,
        })
      }
    }
    effect()
  }, [refreshCounter])

  // When connectedWallet changes, we extract the info we need and save it to `wallet`.
  // If it's become `null`, we also set `wallet` to `null`.
  useEffect(() => {
    async function effect() {
      if (currentWallet) {
        // Fetch the user's balance from the signing cosmwasm client
        const signingCosmWasmClient = await currentWallet.getCosmWasmClient()
        const signingStargateClient = await currentWallet.getStargateClient()

        const balance = await signingCosmWasmClient?.queryClient.bank.balance(
          currentWallet.address,
          asset?.assets[0].denom_units[0].denom,
        )

        // Set the wallet data
        setWallet({
          address: currentWallet.address,
          name: currentWallet.name,
          balance,
        })

        // Get all other signers
        // They are state vars so that when they are updated StargazeClient is also udpated
        setSigningCosmWasmClient(signingCosmWasmClient)
        setSigningStargateClient(signingStargateClient)
      } else {
        // No wallet = no data
        setWallet(undefined)
        setSigningCosmWasmClient(undefined)
        setSigningStargateClient(undefined)
      }
    }
    effect()
  }, [currentWallet])

  return (
    <Wallet.Provider
      value={{
        connect,
        disconnect,
        refreshBalance,
        signingCosmWasmClient,
        signingStargateClient,
        wallet,
      }}
    >
      {children}
    </Wallet.Provider>
  )
}
