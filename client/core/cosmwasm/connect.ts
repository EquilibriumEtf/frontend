import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export default async function connectCosmWasmClient(rpc: string) {
  if (!rpc) {
    throw new Error('No RPC provided to connect the CosmWasmClient.')
  }
  return await CosmWasmClient.connect(rpc)
}
