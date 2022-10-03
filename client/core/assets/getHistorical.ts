import { Asset } from '.'

export default async function getHistorical(
  symbol: string,
): Promise<Asset['historical']> {
  return await fetch(
    `https://api-osmosis.imperator.co/tokens/v2/historical/${symbol}/chart?tf=60`,
  )
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      return json.map((range: any) => range.close)
    })
}
