import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import mockChartData from './mock'

export interface ChartItem {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export interface ChartTypes {
  data?: ChartItem[]
  width?: number
  height?: number
}

const Chart = ({
  data = mockChartData(100, new Date('2022-09-01')),
  width = 0,
  height = 0,
}: ChartTypes) => {
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    if (ref) {
      ref.current!.innerHTML = ''
      const chart = createChart(ref.current!, {
        layout: {
          background: { type: ColorType.Solid, color: '#000000' },
          textColor: '#FFFFFF',
          fontFamily: 'Inter',
        },
        grid: {
          vertLines: {
            color: '#262626',
          },
          horzLines: {
            color: '#262626',
          },
        },
      })
      const lineSeries = chart.addCandlestickSeries()
      lineSeries.setData(data!)
    }
  }, [])

  return <article ref={ref} className="z-0 w-full h-full"></article>
}

export default Chart
