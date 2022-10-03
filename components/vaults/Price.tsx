import { classNames } from 'util/css'

export interface PriceTypes {
  price?: number
  length?: number
  currency?: string
  divider?: string
  large?: boolean
}

/**
 * @name Price
 * @description Default component for reprenseting a price in a specific currency
 *
 * @example
 * // Price of $10
 * <Price price={10}  />
 *
 * @example
 * // Price of CHF104/share
 * <Price price={10} currency="CHF" divider="share" />
 */
export const Price = ({
  price = 0,
  length = 2,
  currency = '$',
  divider,
  large = false,
}: PriceTypes) => {
  return (
    <div className="flex flex-row items-center">
      <p
        className={classNames(
          large ? 'text-xl' : 'text-lg',
          'font-bold text-black dark:text-white',
        )}
      >
        {currency}
        {price.toFixed(length)}
      </p>
      {divider && (
        <p
          className={classNames(
            large ? 'text-base' : 'text-xs mt-1',
            'ml-1 font-inter text-black/50 dark:text-white/50',
          )}
        >
          / {divider}
        </p>
      )}
    </div>
  )
}
