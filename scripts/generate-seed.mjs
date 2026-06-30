import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const COUNTRIES = JSON.parse(
  readFileSync(join(root, 'src/data/countries.json'), 'utf8'),
)

function escapeSql(value) {
  return value.replace(/'/g, "''")
}

function buildStickers() {
  const stickers = []

  for (let number = 0; number <= 20; number += 1) {
    stickers.push({ section_type: 'fcw', section: 'FWC', number })
  }

  for (const { name } of COUNTRIES) {
    for (let number = 1; number <= 20; number += 1) {
      stickers.push({ section_type: 'pais', section: name, number })
    }
  }

  for (let number = 1; number <= 14; number += 1) {
    stickers.push({ section_type: 'cocacola', section: 'Coca-Cola', number })
  }

  return stickers
}

function toInsertRows(stickers) {
  return stickers.map(
    (sticker) =>
      `  ('${sticker.section_type}', '${escapeSql(sticker.section)}', ${sticker.number})`,
  )
}

const stickers = buildStickers()

const counts = stickers.reduce(
  (acc, sticker) => {
    acc.total += 1
    acc[sticker.section_type] = (acc[sticker.section_type] ?? 0) + 1
    return acc
  },
  { total: 0 },
)

const expectedTotal = 21 + COUNTRIES.length * 20 + 14

if (counts.total !== expectedTotal) {
  throw new Error(`Esperado ${expectedTotal} figurinhas, gerado ${counts.total}`)
}

const seedSql = `-- Gerado automaticamente por scripts/generate-seed.mjs
-- Total: ${counts.total} figurinhas (FWC 0-20, ${COUNTRIES.length} países × 1-20, Coca-Cola 1-14)

insert into stickers (section_type, section, number) values
${toInsertRows(stickers).join(',\n')}
on conflict (section, number) do update set
  section_type = excluded.section_type;
`

const jsonPath = join(root, 'src/data/stickers-meta.json')
const seedPath = join(root, 'supabase/seed.sql')

mkdirSync(dirname(jsonPath), { recursive: true })

writeFileSync(seedPath, seedSql)
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      total: counts.total,
      fcw: { from: 0, to: 20, count: counts.fcw },
      paises: { from: 1, to: 20, countries: COUNTRIES.length, count: counts.pais },
      cocacola: { from: 1, to: 14, count: counts.cocacola },
    },
    null,
    2,
  ),
)

console.log(`Gerado ${seedPath} (${counts.total} figurinhas)`)
console.log(`  FWC (0-20): ${counts.fcw}`)
console.log(`  Países (1-20 × ${COUNTRIES.length}): ${counts.pais}`)
console.log(`  Coca-Cola (1-14): ${counts.cocacola}`)
