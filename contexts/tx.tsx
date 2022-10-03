import { createContext, ReactNode, useContext } from 'react'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { isDeliverTxSuccess } from '@cosmjs/stargate'
import { coins } from '@cosmjs/stargate'
import { ArrowTopRightOnSquareIcon as LinkIcon } from '@heroicons/react/24/outline'
import useToaster, { ToastPayload, ToastTypes } from 'hooks/useToaster'
import { useEquilibriumClient, useWallet } from 'client'

// Context to handle simple signingClient transactions
export interface Msg {
  typeUrl: string
  value: any
}

export interface TxOptions {
  party?: boolean
  gas?: number
  toast?: {
    title?: ToastPayload['title']
    message?: ToastPayload['message']
    type?: ToastTypes
    actions?: JSX.Element
  }
}

export interface TxContext {
  tx: (
    msgs: Msg[],
    options: TxOptions,
    callback?: (log: any) => void,
  ) => Promise<void>
}

export const Tx = createContext<TxContext>({
  tx: () => new Promise(() => {}),
})

export function TxProvider({ children }: { children: ReactNode }) {
  const { wallet, refreshBalance } = useWallet()
  const { client } = useEquilibriumClient()
  const signingCosmWasmClient = client?.signingCosmWasmClient

  const toaster = useToaster()

  // Method to sign & broadcast transaction
  const tx = async (
    msgs: Msg[],
    options: TxOptions,
    callback?: (log: any) => void,
  ) => {
    // Gas config
    const fee = {
      amount: coins(0, process.env.NEXT_PUBLIC_DENOM!),
      gas: options.gas
        ? String(options.gas)
        : process.env.NEXT_PUBLIC_DEFAULT_GAS_FEE!,
    }

    // Broadcast the redelegation message to Keplr
    let signed
    try {
      if (wallet?.address) {
        signed = await signingCosmWasmClient?.sign(
          wallet?.address,
          msgs,
          fee,
          '',
        )
      }
    } catch (e) {
      console.error(e)
      toaster.toast({
        title: 'Error',
        dismissable: true,
        message: 'An unexpected error has occured',
        type: ToastTypes.Error,
      })
      return
    }

    let broadcastToastId = ''

    broadcastToastId = toaster.toast(
      {
        title: 'Broadcasting transaction...',
        type: ToastTypes.Pending,
      },
      { duration: 999999 },
    )

    if (signingCosmWasmClient && signed) {
      await signingCosmWasmClient
        .broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()))
        .then((res) => {
          toaster.dismiss(broadcastToastId)
          if (isDeliverTxSuccess(res)) {
            // Get raw log
            let log = JSON.parse(res.rawLog as string)

            // Run callback
            if (callback) callback(log[0])

            // Refresh balance
            refreshBalance()

            toaster.toast({
              title: options.toast?.title || 'Transaction Successful',
              type: options.toast?.type || ToastTypes.Success,
              dismissable: true,
              actions: options.toast?.actions || <></>,
              message: options.toast?.message || <></>,
            })
          } else {
            toaster.toast({
              title: 'Error',
              message: res.rawLog,
              type: ToastTypes.Error,
            })
          }
        })
    } else {
      toaster.dismiss(broadcastToastId)
    }
  }

  return <Tx.Provider value={{ tx }}>{children}</Tx.Provider>
}

export const useTx = (): TxContext => useContext(Tx)
