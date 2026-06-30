export type SectionType = 'fcw' | 'pais' | 'cocacola'

export interface Sticker {
  id: number
  section_type: SectionType
  section: string
  number: number
  owned: boolean
  created_at: string
}

export interface AlbumStats {
  owned: number
  total: number
  percent: number
  missing: number
  bySectionType: Record<SectionType, { owned: number; total: number }>
}

export const ALBUM_TOTAL = 995
