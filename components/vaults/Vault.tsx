import { classNames } from 'util/css'
import { Price } from './Price'
import { useMemo } from 'react'
import { PriceChange } from './PriceChange'
import { dataset as rDataset } from 'util/r'
import Link from 'next/link'

export interface VaultTypes {
  image?: string
  name: string
  price: number
  priceLength?: number
  currency?: string
  change?: number
  href?: string
  large?: boolean
  divider?: string
  dataset?: number[]
  graph?: boolean
}

/**
 * @name Vault
 * @description Descriptive component for a unique ETF
 *
 * @example
 * // Regular vault view
 * <Vault name="My vault" price={12.24} change={12} />
 *
 * @example
 * // Large vault view
 * <Vault large name="My vault" price={12.24} change={12} />
 */
export const Vault = ({
  image,
  name,
  price,
  priceLength = 2,
  currency = '$',
  change,
  href = '#',
  large,
  divider = 'share',
  dataset,
  graph = true,
}: VaultTypes) => {
  const baseUrl =
    'https://quickchart.io/chart?key=q-dl1zysj3y7wccbatwwz9h5u5jvmpad0t&bkg=transparent&height=150&c='

  const lineColor = useMemo(() => {
    if (change) {
      if (change > 0) {
        return 'rgb(34,197,94)'
      } else if (change < 0) {
        return 'rgb(239,68,68)'
      } else {
        return 'rgb(234,179,8)'
      }
    } else {
      return '%238E19D5'
    }
  }, [change])

  const chartData = useMemo(() => {
    return {
      type: 'sparkline',
      data: {
        datasets: [
          {
            fill: false,
            borderWidth: 6,
            lineTension: 0.3,
            borderColor: lineColor,
            data: dataset || rDataset(12, 30),
          },
        ],
      },
    }
  }, [lineColor])

  const imgUrl = useMemo(() => baseUrl + JSON.stringify(chartData), [chartData])

  return (
    <Link href={href}>
      <div
        className={classNames(
          large ? 'w-[24rem] flex flex-row space-x-4' : 'w-[12rem]',
          'bg-white dark:bg-black flex-shrink-0 cursor-pointer hover:bg-black/10 overflow-visible dark:hover:bg-white/10 transition-all duration-75 ease-in-out border rounded-md border-white/25 hover:border-primary',
        )}
      >
        <div className="p-4 pb-8">
          {image ? (
            <img
              src={image}
              className="flex-shrink-0 w-12 h-12 rounded-full aspect-1"
            />
          ) : (
            <div className="flex-shrink-0 w-12 h-12 rounded-full aspect-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          )}
          <div className={classNames(large ? 'mt-0' : 'mt-2')}>
            <p className="text-lg font-semibold text-black dark:text-white">
              {name}
            </p>
            <Price
              price={price}
              length={priceLength}
              divider={divider}
              currency={currency}
            />
            <div className="mt-0.5">
              {change && <PriceChange change={change} />}
            </div>
          </div>
        </div>
        {graph && <img className="w-full pb-2" src={imgUrl} loading="eager" />}
      </div>
    </Link>
  )
}
