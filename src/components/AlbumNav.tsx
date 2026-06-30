import type { Sticker } from '../types/sticker'
import type { AlbumPage, AlbumPageId } from '../types/navigation'
import {
  createCocaColaPage,
  createCountryPage,
  createFcwPage,
  isSamePage,
} from '../types/navigation'
import { getPageProgress } from '../lib/page-utils'
import { getCountryCode, matchesCountrySearch } from '../lib/countries'
import { CountryLabel } from './CountryLabel'

interface AlbumNavProps {
  countries: string[]
  stickers: Sticker[]
  activePageId: AlbumPageId
  countrySearch: string
  onCountrySearchChange: (value: string) => void
  onSelectPage: (pageId: AlbumPageId) => void
}

function NavItem({
  label,
  countryName,
  subtitle,
  owned,
  total,
  active,
  onClick,
}: {
  label: string
  countryName?: string
  subtitle: string
  owned: number
  total: number
  active: boolean
  onClick: () => void
}) {
  const complete = total > 0 && owned === total

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition ${
        active
          ? 'bg-emerald-400 text-slate-900'
          : 'text-slate-200 hover:bg-white/10'
      }`}
    >
      <span className="min-w-0 flex-1">
        {countryName ? (
          <CountryLabel
            name={countryName}
            className="text-sm font-semibold"
            codeClassName={`text-xs ${active ? 'text-slate-700' : 'text-slate-400'}`}
          />
        ) : (
          <span className="block truncate text-sm font-semibold">{label}</span>
        )}
        <span
          className={`block truncate text-xs ${active ? 'text-slate-700' : 'text-slate-500'}`}
        >
          {subtitle}
        </span>
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
          active
            ? complete
              ? 'bg-slate-900 text-emerald-300'
              : 'bg-slate-900/15 text-slate-900'
            : complete
              ? 'bg-emerald-400/20 text-emerald-300'
              : 'bg-slate-700/80 text-slate-300'
        }`}
      >
        {owned}/{total}
      </span>
    </button>
  )
}

export function AlbumNav({
  countries,
  stickers,
  activePageId,
  countrySearch,
  onCountrySearchChange,
  onSelectPage,
}: AlbumNavProps) {
  const fcwPage = createFcwPage()
  const cocaColaPage = createCocaColaPage()
  const fcwProgress = getPageProgress(stickers, fcwPage.id)
  const cocaProgress = getPageProgress(stickers, cocaColaPage.id)

  const filteredCountries = countries.filter((country) =>
    matchesCountrySearch(country, countrySearch),
  )

  return (
    <nav className="flex h-full flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Páginas do álbum
        </p>

        <div className="space-y-1">
          <NavItem
            label={fcwPage.title}
            subtitle={fcwPage.subtitle}
            owned={fcwProgress.owned}
            total={fcwProgress.total}
            active={isSamePage(activePageId, fcwPage.id)}
            onClick={() => onSelectPage(fcwPage.id)}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Países ({countries.length})
        </p>

        <input
          type="search"
          value={countrySearch}
          onChange={(event) => onCountrySearchChange(event.target.value)}
          placeholder="Buscar país ou sigla (ex: BRA)..."
          className="mb-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        />

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {filteredCountries.map((country) => {
            const page = createCountryPage(country, getCountryCode(country) ?? undefined)
            const progress = getPageProgress(stickers, page.id)

            return (
              <NavItem
                key={country}
                label={page.title}
                countryName={country}
                subtitle={page.subtitle}
                owned={progress.owned}
                total={progress.total}
                active={isSamePage(activePageId, page.id)}
                onClick={() => onSelectPage(page.id)}
              />
            )
          })}

          {filteredCountries.length === 0 && (
            <p className="px-2 py-4 text-center text-sm text-slate-500">
              Nenhum país encontrado.
            </p>
          )}
        </div>
      </div>

      <div>
        <NavItem
          label={cocaColaPage.title}
          subtitle={cocaColaPage.subtitle}
          owned={cocaProgress.owned}
          total={cocaProgress.total}
          active={isSamePage(activePageId, cocaColaPage.id)}
          onClick={() => onSelectPage(cocaColaPage.id)}
        />
      </div>
    </nav>
  )
}

export function getPageMeta(pageId: AlbumPageId, countries: string[]): AlbumPage {
  if (pageId === 'fcw') return createFcwPage()
  if (pageId === 'cocacola') return createCocaColaPage()

  const country = pageId.replace('pais:', '')
  if (countries.includes(country)) {
    return createCountryPage(country, getCountryCode(country) ?? undefined)
  }

  return createFcwPage()
}
