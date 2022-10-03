import {
  ClipboardDocumentIcon as ClipboardIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon as LinkIcon,
} from '@heroicons/react/24/solid'
import { useCallback, useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'

export interface AddressTypes {
  address: string
  truncate?: boolean
  copy?: boolean
  extLink?: string
}

export function truncate(address: string) {
  return `${address.substring(0, 12)}...${address.substring(
    address.length - 8,
    address.length,
  )}`
}

/**
 * @name Address
 * @description Default component for displaying an address
 *
 * @example
 * // Basic truncated address with copy
 * <Address address="juno1..." copy />
 *
 * @example
 * // Non-truncated (long) address with copy and an external link
 * <Address address="juno1..." extLink="https://..." truncate={false} copy />
 */
export const Address = ({
  address,
  truncate: truncateAddress = true,
  copy,
  extLink,
}: AddressTypes) => {
  const truncatedAddress = truncateAddress ? truncate(address) : address

  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = useCallback(() => {
    copyToClipboard(address)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }, [])

  return (
    <div className="flex flex-row items-center px-3 py-2 border rounded-md border-black/25 dark:border-white/25">
      <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full aspect-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
      <p className="mr-2 text-sm font-medium text-black/75 dark:text-white/75">
        {truncatedAddress}
      </p>
      <div className="flex flex-row items-center space-x-2">
        {copy && (
          <a
            className="cursor-pointer text-black/50 dark:text-white/50 hover:text-black/75 dark:hover:text-white/75"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <ClipboardIcon className="w-5 h-5" />
            )}
          </a>
        )}
        {extLink && (
          <a
            className="cursor-pointer text-black/50 dark:text-white/50 hover:text-black/75 dark:hover:text-white/75"
            href={extLink}
            rel="noopener norefferer"
            target="_blank"
          >
            <LinkIcon className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  )
}
