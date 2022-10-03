import { ManagerModuleInfo } from '@abstract/abstract.js/dist/core/manager/Manager.types'
import { Cw20MessageComposer, EtfMessageComposer } from '@abstract/abstract.js'
import { coins } from '@cosmjs/stargate'
import { jsonToBinary } from 'util/msg'

export default async function buyShares({
  module,
  sender,
  microAmount,
  asset,
}: {
  module: ManagerModuleInfo
  sender: string
  microAmount: number
  asset: string
}) {
  const etfMessageComposer = new EtfMessageComposer(sender, module.address)

  const msg = etfMessageComposer.provideLiquidity(
    {
      asset: {
        amount: microAmount.toString(),
        info: {
          native: asset,
        },
      },
    },
    coins(microAmount, asset),
  )

  return msg
}

export async function withdrawShares({
  module,
  cw20token,
  sender,
  microAmount,
}: {
  module: ManagerModuleInfo
  cw20token: string
  sender: string
  microAmount: string
}) {
  const cw20MessageComposer = new Cw20MessageComposer(sender, cw20token)

  const msg = cw20MessageComposer.send({
    amount: microAmount,
    contract: module.address,
    msg: jsonToBinary({ withdraw_liquidity: {} }),
  })

  return msg
}
