import countries from '../data/countries.json'

export interface Country {
  name: string
  code: string
}

export const COUNTRIES = countries as Country[]

const codeByName = new Map(COUNTRIES.map((country) => [country.name, country.code]))

export function getCountryCode(name: string): string | null {
  return codeByName.get(name) ?? null
}

export function formatCountryLabel(name: string): string {
  const code = getCountryCode(name)
  return code ? `${name} (${code})` : name
}

export function matchesCountrySearch(name: string, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const code = getCountryCode(name)
  return (
    name.toLowerCase().includes(normalized) ||
    (code?.toLowerCase().includes(normalized) ?? false)
  )
}
