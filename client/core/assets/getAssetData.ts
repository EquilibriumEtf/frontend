import { Asset } from '.'

export default async function getAssetData(
  symbol: string,
): Promise<Asset['token']> {
  return await fetch('https://api-osmosis.imperator.co/tokens/v2/' + symbol)
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      return json[0]
    })
}

