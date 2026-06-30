interface ProgressBarProps {
  owned: number
  total: number
  percent: number
}

export function ProgressBar({ owned, total, percent }: ProgressBarProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-300">Progresso do álbum</p>
          <p className="text-2xl font-bold text-white">
            {owned}
            <span className="text-lg font-medium text-slate-400"> / {total}</span>
          </p>
        </div>
        <p className="text-3xl font-black text-emerald-400">{percent}%</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-700/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
