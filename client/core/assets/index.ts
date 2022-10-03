import getAssetData from './getAssetData'
import getHistorical from './getHistorical'

export interface Asset {
  token: {
    denom: string
    exponent: number
    display: string
    symbol: string
    name: string
    main: boolean
    price: number
    price_24h_change: number
    liquidity: number
    liquidity_24h_change: number
    volume: number
    volume_24h_change: number
  }
  historical: number[]
}

export default class Assets {
  public async getAll({
    fetchAssetData = true,
    fetchHistorical = false,
  }: {
    fetchAssetData?: boolean
    fetchHistorical?: boolean
  }) {
    try {
      const assets = process.env.NEXT_PUBLIC_ASSETS!.split(',')

      const data = assets.map(async (symbol) => {
        let assetData
        let historical

        if (fetchAssetData) assetData = await getAssetData(symbol)
        if (fetchHistorical) historical = await getHistorical(symbol)

        return { token: assetData, historical }
      })

      const finalizedData = await Promise.all(data)

      return finalizedData
    } catch {
      throw new Error('Error fetching assets')
    }
  }

  public async getOne({
    symbol,
    fetchAssetData = true,
    fetchHistorical = false,
  }: {
    symbol: string
    fetchAssetData?: boolean
    fetchHistorical?: boolean
  }) {
    try {
      let assetData
      let historical

      if (fetchAssetData) assetData = await getAssetData(symbol)
      if (fetchHistorical) historical = await getHistorical(symbol)

      return { token: assetData, historical }
    } catch {
      throw new Error('Error fetching asset')
    }
  }
}
