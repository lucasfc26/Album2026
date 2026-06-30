export type AlbumPageId = 'fcw' | 'cocacola' | `pais:${string}`

export interface AlbumPage {
  id: AlbumPageId
  title: string
  countryCode?: string
  subtitle: string
  sectionType: 'fcw' | 'pais' | 'cocacola'
}

export function createFcwPage(): AlbumPage {
  return {
    id: 'fcw',
    title: 'FWC',
    subtitle: 'Figurinhas 0–20',
    sectionType: 'fcw',
  }
}

export function createCocaColaPage(): AlbumPage {
  return {
    id: 'cocacola',
    title: 'Coca-Cola',
    subtitle: 'Figurinhas 1–14',
    sectionType: 'cocacola',
  }
}

export function createCountryPage(country: string, code?: string): AlbumPage {
  return {
    id: `pais:${country}`,
    title: country,
    countryCode: code,
    subtitle: 'Figurinhas 1–20',
    sectionType: 'pais',
  }
}

export function isSamePage(a: AlbumPageId, b: AlbumPageId): boolean {
  return a === b
}
