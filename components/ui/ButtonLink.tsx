import type { PropsOf } from '@headlessui/react/dist/types'
import { classNames } from '../../util/css'
import {
  baseButtonClassNames,
  BaseButtonTypes,
  buttonVariantClassNames,
} from './Button'
import Link from 'next/link'

export const isExternalHref = (url: string) => new RegExp(/^http/).test(url)

export type ButtonLinkTypes = PropsOf<'a'> &
  BaseButtonTypes & {
    href: string
  }

/**
 * @name ButtonLink
 * @description Styled link component, will use Next.js Link if internal or standard 'a' tag if external
 *
 * @example
 * // External button link
 * <ButtonLink href="https://google.com">Button text</ButtonLink>
 *
 * @example
 * // Internal button link
 * <ButtonLink href="/discover" variant="secondary">Button text</ButtonLink>
 */
export default function ButtonLink({
  href,
  className = '',
  variant = 'primary',
  ...rest
}: ButtonLinkTypes) {
  const cachedClassNames = classNames(
    ...baseButtonClassNames,
    buttonVariantClassNames[variant],
    className,
  )

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={cachedClassNames}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      />
    )
  }

  return (
    <Link href={href}>
      <a className={cachedClassNames} {...rest} />
    </Link>
  )
}
