import type { Sticker } from '../types/sticker'
import { formatStickerLabel } from '../lib/sticker-utils'
import { CountryLabel } from './CountryLabel'

interface StickerCardProps {
  sticker: Sticker
  pending: boolean
  onToggle: (sticker: Sticker) => void
}

export function StickerCard({ sticker, pending, onToggle }: StickerCardProps) {
  const label = formatStickerLabel(sticker.section, sticker.number)

  return (
    <button
      type="button"
      onClick={() => onToggle(sticker)}
      disabled={pending}
      aria-pressed={sticker.owned}
      aria-label={`${sticker.owned ? 'Desmarcar' : 'Marcar'} figurinha ${label}`}
      className={`group relative flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border p-4 text-center transition duration-200 ${
        sticker.owned
          ? 'border-emerald-400/60 bg-gradient-to-br from-emerald-500/20 to-lime-400/10 shadow-lg shadow-emerald-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
      } ${pending ? 'opacity-60' : 'cursor-pointer'}`}
    >
      <span
        className={`mb-2 rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
          sticker.owned
            ? 'bg-emerald-400/20 text-emerald-200'
            : 'bg-slate-700/80 text-slate-300'
        }`}
      >
        {sticker.owned ? 'Tenho' : 'Falta'}
      </span>

      <p className="text-4xl font-black tabular-nums text-white">{sticker.number}</p>

      {sticker.section_type === 'pais' ? (
        <CountryLabel
          name={sticker.section}
          className="mt-2 w-full px-1 text-xs font-medium text-slate-300"
          codeClassName="text-slate-400"
        />
      ) : (
        <p className="mt-2 text-sm font-medium text-slate-300">{sticker.section}</p>
      )}
    </button>
  )
}
