import { GasPrice } from '@cosmjs/stargate'
export const gasPrice = GasPrice.fromString(`0${process.env.NEXT_PUBLIC_DENOM}`)
