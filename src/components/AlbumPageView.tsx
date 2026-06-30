import type { Sticker } from '../types/sticker'
import type { AlbumPage } from '../types/navigation'
import { StickerCard } from './StickerCard'
import { ProgressBar } from './ProgressBar'
import { CountryLabel } from './CountryLabel'

interface AlbumPageViewProps {
  page: AlbumPage
  stickers: Sticker[]
  progress: { owned: number; total: number; percent: number }
  pendingIds: Set<number>
  showMissingOnly: boolean
  onToggleMissing: () => void
  onToggleSticker: (sticker: Sticker) => void
}

export function AlbumPageView({
  page,
  stickers,
  progress,
  pendingIds,
  showMissingOnly,
  onToggleMissing,
  onToggleSticker,
}: AlbumPageViewProps) {
  const visibleStickers = showMissingOnly
    ? stickers.filter((sticker) => !sticker.owned)
    : stickers

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
            Página do álbum
          </p>
          {page.sectionType === 'pais' ? (
            <CountryLabel
              name={page.title}
              className="mt-1 text-2xl font-black text-white sm:text-3xl"
              codeClassName="text-lg text-slate-400 sm:text-2xl"
            />
          ) : (
            <h2 className="text-2xl font-black text-white sm:text-3xl">{page.title}</h2>
          )}
          <p className="mt-1 text-slate-400">{page.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onToggleMissing}
          className={`self-start rounded-full px-4 py-2 text-sm font-medium transition ${
            showMissingOnly
              ? 'bg-amber-400 text-slate-900'
              : 'border border-white/20 bg-transparent text-slate-200 hover:bg-white/10'
          }`}
        >
          {showMissingOnly ? 'Mostrando faltantes' : 'Só faltantes'}
        </button>
      </div>

      <ProgressBar
        owned={progress.owned}
        total={progress.total}
        percent={progress.percent}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visibleStickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            pending={pendingIds.has(sticker.id)}
            onToggle={onToggleSticker}
          />
        ))}
      </div>

      {visibleStickers.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
          {stickers.length === 0
            ? 'Nenhuma figurinha nesta página.'
            : 'Página completa! Nenhuma figurinha faltando.'}
        </p>
      )}
    </div>
  )
}
