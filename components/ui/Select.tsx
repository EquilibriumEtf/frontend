import { PropsOf } from '@headlessui/react/dist/types'
import { classNames } from '../../util/css'
import { ReactNode } from 'react'
import Fieldset, { FieldsetBaseType } from './Fieldset'
import { inputClassNames } from './Input'

type SelectProps = Omit<PropsOf<'select'> & FieldsetBaseType, 'className'> & {
  children: ReactNode
}

/**
 * @name Select
 * @description A standard <select> element, pass options as children to this component.
 *
 * @example
 * // Standard Select component with options
 * <Select id="select" name="option">
 *   <option value="">Select...</option>
 *   <option value="video">Option A</option>
 *   <option value="image">Option B</option>
 * </Select>
 *
 * @example
 * // Standard Select component with options and a label
 * <Select id="select" name="option" label="Select Version">
 *   <option value="">Select...</option>
 *   <option value="video">Option A</option>
 *   <option value="image">Option B</option>
 * </Select>
 */
export default function Select({
  id,
  label,
  hint,
  error,
  children,
  ...rest
}: SelectProps) {
  const cachedClassNames = classNames(
    ...inputClassNames.base,
    error ? inputClassNames.invalid : inputClassNames.valid,
  )

  const describedBy = [
    ...(error ? [`${id}-error`] : []),
    ...(typeof hint === 'string' ? [`${id}-optional`] : []),
  ].join(' ')

  return (
    <Fieldset error={error} hint={hint} id={id} label={label}>
      <select
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        className={cachedClassNames}
        id={id}
        {...rest}
      >
        {children}
      </select>

      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23737373' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        }
      `}</style>
    </Fieldset>
  )
}
