import type { Sticker } from '../types/sticker'
import type { AlbumPageId } from '../types/navigation'

export function getPageId(sticker: Sticker): AlbumPageId {
  if (sticker.section_type === 'fcw') return 'fcw'
  if (sticker.section_type === 'cocacola') return 'cocacola'
  return `pais:${sticker.section}`
}

export function getStickersForPage(stickers: Sticker[], pageId: AlbumPageId): Sticker[] {
  return stickers
    .filter((sticker) => getPageId(sticker) === pageId)
    .sort((a, b) => a.number - b.number)
}

export function getPageProgress(stickers: Sticker[], pageId: AlbumPageId) {
  const pageStickers = getStickersForPage(stickers, pageId)
  const owned = pageStickers.filter((sticker) => sticker.owned).length
  const total = pageStickers.length
  const percent = total === 0 ? 0 : Math.round((owned / total) * 100)

  return { owned, total, percent, missing: total - owned }
}

export function groupStickersByPage(stickers: Sticker[]): Map<AlbumPageId, Sticker[]> {
  const groups = new Map<AlbumPageId, Sticker[]>()

  for (const sticker of stickers) {
    const pageId = getPageId(sticker)
    const current = groups.get(pageId) ?? []
    current.push(sticker)
    groups.set(pageId, current)
  }

  return groups
}
