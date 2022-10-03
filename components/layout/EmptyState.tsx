import { NoSymbolIcon } from '@heroicons/react/24/solid'

export const EmptyState = () => (
  <div className="flex flex-col items-center space-y-2">
    <NoSymbolIcon className="w-12 h-12 text-black/50 dark:text-white/50" />
    <p className="text-sm font-semibold text-black/75 dark:text-white/75">
      There is nothing here
    </p>
  </div>
)
