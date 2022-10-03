import {
  ManagerClient,
  FactoryMessageComposer,
  ManagerMessageComposer,
} from '@abstract/abstract.js'
import { jsonToBinary } from 'util/msg'
interface NewOsInfo {
  name: string
  description: string
  root: string
}

export default async function createOsMsg(
  newOsInfo: NewOsInfo,
  {
    factoryMessageComposer,
  }: {
    factoryMessageComposer: FactoryMessageComposer
  },
) {
  const osCreateMsg = factoryMessageComposer.createOs({
    ...newOsInfo,
    governance: {
      Monarchy: {
        monarch: newOsInfo.root,
      },
    },
  })

  return osCreateMsg
}

export async function installModuleMsg(
  moduleId: string,
  initMsg: Record<string, unknown>,
  { managerClient }: { managerClient: ManagerClient },
) {
  const managerMessageComposer = new ManagerMessageComposer(
    managerClient.sender,
    managerClient.contractAddress,
  )

  const msg = managerMessageComposer.createModule({
    initMsg: jsonToBinary(initMsg),
    module: {
      name: moduleId,
      provider: 'abstract',
      version: {
        latest: {},
      },
    },
  })

  return msg
}

export async function registerAssets({
  managerClient,
}: {
  managerClient: ManagerClient
}) {
  const managerMessageComposer = new ManagerMessageComposer(
    managerClient.sender,
    managerClient.contractAddress,
  )

  const execMsg = {
    update_assets: {
      to_add: [
        {
          asset: process.env.NEXT_PUBLIC_SHORT_DENOM!,
          value_reference: undefined,
        },
        {
          asset: 'osmo',
          value_reference: {
            Pool: {
              exchange: 'osmosisrouter',
              pair: `${process.env.NEXT_PUBLIC_SHORT_DENOM!}_osmo`,
            },
          },
        },
      ],
      to_remove: [],
    },
  }

  const msg = managerMessageComposer.execOnModule({
    moduleId: 'abstract:proxy',
    execMsg: jsonToBinary(execMsg),
  })

  return msg
}
