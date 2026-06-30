import { getCountryCode } from '../lib/countries'

interface CountryLabelProps {
  name: string
  className?: string
  codeClassName?: string
}

export function CountryLabel({ name, className = '', codeClassName = '' }: CountryLabelProps) {
  const code = getCountryCode(name)

  if (!code) {
    return <span className={className}>{name}</span>
  }

  return (
    <span className={`flex min-w-0 items-center justify-between gap-2 ${className}`}>
      <span className="truncate">{name}</span>
      <span className={`shrink-0 font-medium tabular-nums ${codeClassName}`}>({code})</span>
    </span>
  )
}
