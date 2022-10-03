import { EquilibriumClient } from 'client/core'
import { chains } from 'chain-registry'

const client = new EquilibriumClient({
  wallet: null,
  signingCosmWasmClient: null,
  chainInfo: chains.find(
    (c) => c.chain_name === process.env.NEXT_PUBLIC_CHAIN,
  )!,
})

export default client
