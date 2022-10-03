import { PropsOf } from '@headlessui/react/dist/types'
import { classNames } from '../../util/css'
import Fieldset, { FieldsetBaseType } from './Fieldset'
import { inputClassNames } from './Input'

type TextareaProps = Omit<PropsOf<'textarea'> & FieldsetBaseType, 'className'>

/**
 * @name Textarea
 * @description A standard textarea component.
 *
 * @example
 * // Standard textarea component and rows set to handle the default height
 * <Textarea id="textarea" rows={4} />
 *
 * @example
 * // Textarea component with label and rows set to handle the default height
 * <Textarea id="textarea-label" label="Description" rows={4} />
 */
export default function Textarea({
  id,
  label,
  hint,
  error,
  ...rest
}: TextareaProps) {
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
      <textarea
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        className={cachedClassNames}
        id={id}
        {...rest}
      />
    </Fieldset>
  )
}
