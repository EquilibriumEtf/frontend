import { classNames } from '../../util/css'

export default function Dot({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        'bg-primary-600 flex-shrink-0 w-2.5 h-2.5 rounded-full',
        className,
      )}
    />
  )
}
