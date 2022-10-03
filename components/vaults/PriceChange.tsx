import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  MinusSmallIcon,
} from '@heroicons/react/20/solid'
import { useMemo } from 'react'
import { classNames } from 'util/css'

export interface PriceChangeTypes {
  change?: number
  period?: string
}

interface IconData {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  color: string
}

/**
 * @name PriceChange
 * @description Default component for reprenseting a change in price or other numeric value
 *
 * @example
 * // Price up by 0.5%
 * <PriceChange change={0.5}  />
 *
 * @example
 * // Price down by 2%
 * <PriceChange change={-2} />
 */
export const PriceChange = ({
  change = 0,
  period = '24hrs',
}: PriceChangeTypes) => {
  // Define a variable to store the color and the icon to use
  const data = useMemo(() => {
    const data: IconData = { color: 'text-yellow-500', icon: MinusSmallIcon }

    if (change > 0) {
      data.color = 'text-green-500'
      data.icon = ArrowUpRightIcon
    } else if (change < 0) {
      data.color = 'text-red-500'
      data.icon = ArrowDownRightIcon
    } else if (change === 0) {
      data.color = 'text-yellow-500'
      data.icon = MinusSmallIcon
    }

    return data
  }, [change])

  return (
    <div className="flex flex-row items-center">
      <data.icon className={classNames('w-5 h-5', data.color)} />
      <p className={classNames('font-inter font-medium text-sm', data.color)}>
        {change.toFixed(2)}%
      </p>
      <p className="ml-1 mt-0.5 text-xs font-inter text-black/50 dark:text-white/50">
        {period}
      </p>
    </div>
  )
}
