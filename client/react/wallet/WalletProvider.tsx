import { WalletProvider as WalletContextProvider } from './WalletContext'
import EquilibriumProvider from 'client/react/client/EquilibriumProvider'

import { WalletProvider as InternalWalletProvider } from '@cosmos-kit/react'
import { wallets } from '@cosmos-kit/keplr'
import { SignerOptions, WalletOption } from '@cosmos-kit/core'
import { chains, assets } from 'chain-registry'

import { Modal } from 'components/modal'

// WalletProvider serves multiple purposes:
// - It provides `useWalletManager()` to the wallet context (WalletContext.tsx)
// - It wraps WalletManagerProvider and WalletContext into one simple component you can insert in the root
// - It provides the app access to EquilibriumClient

export default function WalletProvider({
  children,
}: {
  children: JSX.Element
}) {
  const signerOptions: SignerOptions = {
    // stargate: (_chain: Chain) => {
    //   return getSigningCosmosClientOptions();
    // }
  }

  return (
    <InternalWalletProvider
      chains={chains}
      assetLists={assets}
      walletModal={Modal}
      wallets={(wallets as unknown) as WalletOption[]}
      signerOptions={signerOptions}
    >
      <WalletContextProvider>
        <EquilibriumProvider>{children}</EquilibriumProvider>
      </WalletContextProvider>
    </InternalWalletProvider>
  )
}
