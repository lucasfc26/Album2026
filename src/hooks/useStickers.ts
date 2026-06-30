import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AlbumStats, SectionType, Sticker } from '../types/sticker'
import { fetchStickers, isSupabaseConfigured, toggleStickerOwned } from '../lib/supabase'
import { sortStickers } from '../lib/sticker-utils'
import { COUNTRIES } from '../lib/countries'

const EMPTY_SECTION_STATS: AlbumStats['bySectionType'] = {
  fcw: { owned: 0, total: 0 },
  pais: { owned: 0, total: 0 },
  cocacola: { owned: 0, total: 0 },
}

export function useStickers() {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      setError(
        'Supabase não configurado. Copie .env.example para .env e preencha as credenciais.',
      )
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchStickers()
      setStickers(sortStickers(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar figurinhas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const toggle = useCallback(async (sticker: Sticker) => {
    const nextOwned = !sticker.owned

    setStickers((current) =>
      current.map((item) =>
        item.id === sticker.id ? { ...item, owned: nextOwned } : item,
      ),
    )
    setPendingIds((current) => new Set(current).add(sticker.id))

    try {
      const updated = await toggleStickerOwned(sticker.id, nextOwned)
      setStickers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
    } catch (err) {
      setStickers((current) =>
        current.map((item) =>
          item.id === sticker.id ? { ...item, owned: sticker.owned } : item,
        ),
      )
      setError(err instanceof Error ? err.message : 'Erro ao atualizar figurinha')
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(sticker.id)
        return next
      })
    }
  }, [])

  const stats = useMemo<AlbumStats>(() => {
    const bySectionType = { ...EMPTY_SECTION_STATS }
    let owned = 0

    for (const sticker of stickers) {
      bySectionType[sticker.section_type].total += 1
      if (sticker.owned) {
        owned += 1
        bySectionType[sticker.section_type].owned += 1
      }
    }

    const total = stickers.length
    const percent = total === 0 ? 0 : Math.round((owned / total) * 100)

    return {
      owned,
      total,
      percent,
      missing: total - owned,
      bySectionType,
    }
  }, [stickers])

  const countries = useMemo(() => {
    const fromDb = new Set(
      stickers.filter((s) => s.section_type === 'pais').map((s) => s.section),
    )

    const ordered = COUNTRIES.map((country) => country.name).filter((name) =>
      fromDb.has(name),
    )

    for (const name of fromDb) {
      if (!ordered.includes(name)) ordered.push(name)
    }

    return ordered
  }, [stickers])

  const sectionTypes = useMemo(() => {
    const unique = [...new Set(stickers.map((s) => s.section_type))]
    return unique.sort() as SectionType[]
  }, [stickers])

  return {
    stickers,
    loading,
    error,
    pendingIds,
    stats,
    countries,
    sectionTypes,
    toggle,
    reload: load,
  }
}
