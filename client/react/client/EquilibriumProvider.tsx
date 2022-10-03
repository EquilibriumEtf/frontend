import { useCallback, useEffect, useMemo, useState } from 'react'
import { EquilibriumClient } from 'client/core'
import EquilibriumContext from './EquilibriumContext'
import { chains } from 'chain-registry'

import useWallet from '../wallet/useWallet'

export default function EquilibriumProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [, updateState] = useState<{}>()
  const forceUpdate = useCallback(() => updateState({}), [])

  const { wallet, signingCosmWasmClient } = useWallet()

  const client = useMemo(
    () =>
      new EquilibriumClient({
        wallet: wallet || null,
        chainInfo: chains.find(
          (c) => c.chain_name === process.env.NEXT_PUBLIC_CHAIN,
        )!,
        signingCosmWasmClient: signingCosmWasmClient || null,
      }),
    [wallet, signingCosmWasmClient],
  )

  const connectSigning = useCallback(async () => {
    if (client) {
      await client?.connectSigning()
      forceUpdate()
    }
  }, [client, forceUpdate])

  // Connect client
  useEffect(() => {
    // Unsigned Client
    async function connectClient() {
      await client?.connect()
      forceUpdate()
    }

    connectClient()
  }, [client, forceUpdate])

  return (
    <EquilibriumContext.Provider
      value={{
        client,
        connectSigning,
      }}
    >
      {children}
    </EquilibriumContext.Provider>
  )
}
