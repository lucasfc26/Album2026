import { useMemo, useState } from 'react'
import { AlbumNav, getPageMeta } from './components/AlbumNav'
import { AlbumPageView } from './components/AlbumPageView'
import { ProgressBar } from './components/ProgressBar'
import { StatsPanel } from './components/StatsPanel'
import { useStickers } from './hooks/useStickers'
import { getPageProgress, getStickersForPage } from './lib/page-utils'
import type { AlbumPageId } from './types/navigation'
import { ALBUM_TOTAL } from './types/sticker'

export default function App() {
  const {
    stickers,
    loading,
    error,
    pendingIds,
    stats,
    countries,
    toggle,
    reload,
  } = useStickers()

  const [activePageId, setActivePageId] = useState<AlbumPageId>('fcw')
  const [countrySearch, setCountrySearch] = useState('')
  const [showMissingOnly, setShowMissingOnly] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  const activePage = useMemo(
    () => getPageMeta(activePageId, countries),
    [activePageId, countries],
  )

  const pageStickers = useMemo(
    () => getStickersForPage(stickers, activePageId),
    [stickers, activePageId],
  )

  const pageProgress = useMemo(
    () => getPageProgress(stickers, activePageId),
    [stickers, activePageId],
  )

  const handleSelectPage = (pageId: AlbumPageId) => {
    setActivePageId(pageId)
    setShowMissingOnly(false)
    setNavOpen(false)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-950/80 px-4 py-6 backdrop-blur-sm sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Copa do Mundo FIFA 2026
          </p>
          <h1 className="text-2xl font-black text-white sm:text-3xl">
            Meu Álbum — {ALBUM_TOTAL} figurinhas
          </h1>
          {!loading && stickers.length > 0 && (
            <div className="mt-4 max-w-xl">
              <ProgressBar
                owned={stats.owned}
                total={stats.total}
                percent={stats.percent}
              />
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/10 bg-slate-950 p-4 pt-20 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:self-start lg:pt-6 ${
            navOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {!loading && stickers.length > 0 && (
            <AlbumNav
              countries={countries}
              stickers={stickers}
              activePageId={activePageId}
              countrySearch={countrySearch}
              onCountrySearchChange={setCountrySearch}
              onSelectPage={handleSelectPage}
            />
          )}
        </aside>

        {navOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="mb-4 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 lg:hidden"
          >
            Abrir páginas do álbum
          </button>

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              Carregando figurinhas...
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-100">
              <p className="font-medium">{error}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="mt-3 rounded-lg bg-red-400 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && stickers.length === 0 && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-100">
              <p className="font-medium">Nenhuma figurinha encontrada.</p>
              <p className="mt-2 text-sm text-amber-200/90">
                Execute <code className="rounded bg-black/20 px-1">supabase/schema.sql</code> e
                depois <code className="rounded bg-black/20 px-1">supabase/seed.sql</code> no SQL
                Editor do Supabase.
              </p>
            </div>
          )}

          {!loading && stickers.length > 0 && stickers.length !== ALBUM_TOTAL && (
            <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
              <p className="font-medium">
                Álbum incompleto no banco: {stickers.length} de {ALBUM_TOTAL} figurinhas.
              </p>
            </div>
          )}

          {!loading && stickers.length > 0 && (
            <div className="space-y-6">
              <StatsPanel stats={stats} />

              <AlbumPageView
                page={activePage}
                stickers={pageStickers}
                progress={pageProgress}
                pendingIds={pendingIds}
                showMissingOnly={showMissingOnly}
                onToggleMissing={() => setShowMissingOnly((value) => !value)}
                onToggleSticker={toggle}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
