import { ChartItem } from './Chart'

function r(max: number, minVal?: number) {
  const min = minVal || 0
  return Math.floor(Math.random() * (max - min) + min)
}

export default function mockChartData(max: number, startingDate: Date) {
  let arr: ChartItem[] = []

  const points = [
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
    r(max, max / 2),
  ]
  const diffusion = 30

  let date = startingDate

  points.forEach((point, key) => {
    // Return if on last point
    if (key === points.length - 1) return

    const difference = points[key + 1] - point
    const multiplier = difference / diffusion
    for (let i = 0; i < diffusion; i++) {
      date.setDate(date.getDate() + 1)
      const pt = point + multiplier * i
      arr.push({
        time: date.toLocaleDateString('en-US'),
        open: r(pt * 1.05, pt),
        close: r(pt * 1.1, pt),
        high: r(pt * 1.2, pt),
        low: r(pt, pt * 0.975),
      })
    }
  })

  return arr
}
