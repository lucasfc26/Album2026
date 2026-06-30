import type { AlbumStats } from '../types/sticker'
import { SECTION_TYPE_LABELS } from '../lib/sticker-utils'

interface StatsPanelProps {
  stats: AlbumStats
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(stats.bySectionType) as Array<keyof typeof stats.bySectionType>).map(
        (sectionType) => {
          const item = stats.bySectionType[sectionType]
          if (item.total === 0) return null

          const ranges =
            sectionType === 'fcw'
              ? '0–20'
              : sectionType === 'cocacola'
                ? '1–14'
                : '1–20 × 48'

          return (
            <div
              key={sectionType}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm text-slate-400">
                {SECTION_TYPE_LABELS[sectionType]} ({ranges})
              </p>
              <p className="text-xl font-bold text-white">
                {item.owned} / {item.total}
              </p>
            </div>
          )
        },
      )}
    </div>
  )
}
