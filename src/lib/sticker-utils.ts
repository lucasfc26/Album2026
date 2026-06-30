import type { SectionType } from '../types/sticker'

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  fcw: 'FWC',
  pais: 'Países',
  cocacola: 'Coca-Cola',
}

export function formatStickerLabel(section: string, number: number): string {
  return `${section} · ${number}`
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase()
}

export function matchesSearch(
  sticker: { section: string; number: number; section_type: SectionType },
  query: string,
): boolean {
  const normalized = normalizeSearch(query)
  if (!normalized) return true

  return (
    sticker.section.toLowerCase().includes(normalized) ||
    String(sticker.number).includes(normalized) ||
    SECTION_TYPE_LABELS[sticker.section_type].toLowerCase().includes(normalized)
  )
}

export function sortStickers<T extends { section_type: SectionType; section: string; number: number }>(
  stickers: T[],
): T[] {
  const typeOrder: Record<SectionType, number> = { fcw: 0, pais: 1, cocacola: 2 }

  return [...stickers].sort((a, b) => {
    const typeDiff = typeOrder[a.section_type] - typeOrder[b.section_type]
    if (typeDiff !== 0) return typeDiff

    const sectionDiff = a.section.localeCompare(b.section, 'pt-BR')
    if (sectionDiff !== 0) return sectionDiff

    return a.number - b.number
  })
}
