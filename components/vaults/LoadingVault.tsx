import { classNames } from 'util/css'

/**
 * @name LoadingVault
 * @description Loading state of Vault
 *
 * @example
 * // Regular size
 * <LoadingVault />
 * @example
 * // Large size
 * <LoadingVault large />
 */
export const LoadingVault = ({
  large,
  small,
}: {
  large?: boolean
  small?: boolean
}) => {
  return (
    <div
      className={classNames(
        large ? 'w-[24rem] flex flex-row space-x-4' : 'w-[12rem]',
        'relative bg-white dark:bg-black overflow-visible border rounded-md border-black/10 dark:border-white/10',
      )}
    >
      <div className="p-4 pb-8">
        <div className="flex-shrink-0 w-12 h-12 rounded-full aniamte-pulse aspect-1 bg-gradient-to-r from-black/20 to-black/10 dark:from-white/20 dark:to-white/10"></div>
        <div className={classNames(large ? 'mt-0' : 'mt-2')}>
          <p
            className={classNames(
              small ? 'w-24' : 'w-32',
              'h-6 text-lg font-semibold rounded-md bg-black/25 dark:bg-white/25 animate-pulse',
            )}
          ></p>
          <div className="flex flex-row items-center mt-2">
            <div
              className={classNames(
                small ? 'w-16' : 'w-24',
                'h-5 text-lg font-bold rounded-md bg-black/25 dark:bg-white/25 animate-pulse',
              )}
            ></div>
            {!small && (
              <div className="w-12 h-3 mt-1 ml-1 text-xs rounded-sm font-inter bg-black/10 dark:bg-white/10 animate-pulse"></div>
            )}
          </div>
          {!small && (
            <div className="mt-2">
              <div className="flex flex-row items-center">
                <div className="w-16 h-4 text-sm font-medium rounded-md animate-pulse font-inter bg-black/25 dark:bg-white/10"></div>
                <div className="ml-1 mt-0.5 h-3 w-8 animate-pulse rounded-sm text-xs font-inter bg-black/10 dark:bg-white/10"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!small && (
        <img className="w-full pb-2 animate-pulse" src="/chart-loading.png" />
      )}
    </div>
  )
}
