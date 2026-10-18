#!/usr/bin/env node
// fsd-guard: проверка направлений импортов между слоями Feature-Sliced Design.
// Запуск: node .agents/skills/fsd-guard/scripts/check-fsd.mjs [--json] [--strict]
// Код выхода 1 — есть нарушения уровня error (в --strict любые нарушения).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const root = process.cwd()
const srcDir = join(root, 'src')
const strict = process.argv.includes('--strict')
const json = process.argv.includes('--json')

const LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app']
const rank = (layer) => LAYERS.indexOf(layer)

/**
 * Конфиг проекта: что считается нарушением.
 * - shared: внутренние сегменты (lib/ui/config/api) — одна библиотека, ссылки между ними легальны.
 * - widgets: кросс-импорт между виджетами легален (декомпозиция страницы), циклический — нет.
 * - state-path: публичный путь стора приложения (единственный документированный кросс-слойный вход).
 */
const RULES = {
  sharedSegmentIsolation: false,
  widgetCrossImport: 'allow',
  statePaths: ['@/shared/lib/store', '@/app/store/store'],
  allowDeepIn: [],
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })

const files = walk(srcDir).filter((file) => /\.(ts|tsx)$/.test(file))
const IMPORT_RE = /(?:from\s+|import\s*\(\s*|require\(\s*)['"]([^'"]+)['"]/g

const parseAlias = (spec) => {
  if (!spec.startsWith('@/')) return null
  const parts = spec.slice(2).split('/')
  const [layer, slice, ...rest] = parts
  return { layer, slice, rest }
}

const localParts = (file) => {
  const rel = relative(srcDir, file).split(sep)
  return { layer: rel.length > 1 ? rel[0] : null, slice: rel[1] }
}

const violations = []
const edge = (file, dep) => {
  const from = localParts(file)
  return from.layer === 'widgets' && dep.layer === 'widgets' ? `${from.slice}->${dep.slice}` : null
}
const edges = new Set()

for (const file of files) {
  const relFile = relative(root, file).replaceAll(sep, '/')
  const here = localParts(file)
  const hereRank = rank(here.layer)
  if (hereRank === -1) continue // src/main.tsx — точка входа

  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const match of line.matchAll(IMPORT_RE)) {
      const spec = match[1]
      const target = parseAlias(spec)
      if (!target) continue

      const at = `${relFile}:${index + 1}`
      const isTypeOnly = /import\s+type\s/.test(line)
      const report = (kind, severity, hint) => violations.push({ at, spec, kind, severity, hint })

      if (!LAYERS.includes(target.layer)) {
        report('unknown-layer', 'error', `слой «${target.layer}» не входит в FSD`)
        continue
      }

      // app/types/global.d.ts — глобальные объявления типов, легально из любого слоя
      if (target.layer === 'app' && target.slice === 'types' && isTypeOnly) continue
      if (RULES.statePaths.includes(spec)) continue // хук стора / стор: документированный вход в app

      if (rank(target.layer) > hereRank) {
        report('upward', 'error', `${here.layer} не может импортировать ${target.layer}`)
        continue
      }

      const sameLayer = target.layer === here.layer
      const sameSlice = !sameLayer || target.slice === here.slice
      const dep = edge(file, target)
      if (dep) edges.add(dep)

      // shared: сегменты не изолированы
      if (here.layer === 'shared' && RULES.sharedSegmentIsolation === false) continue

      // widgets: межвиджетные импорты разрешены, но не циклические
      if (here.layer === 'widgets' && !sameSlice) {
        const back = `${target.slice}->${here.slice}`
        if (edges.has(back)) report('widget-cycle', 'error', `цикл виджетов ${dep} ⇄ ${back}`)
        else if (RULES.widgetCrossImport === 'allow') continue
        else report('sideways', 'warn', `межвиджетный импорт ${dep}`)
        continue
      }

      const isBarrel = target.rest.length === 0
      const isXImport = target.rest[0] === '@x'

      if (sameLayer && !sameSlice && !isBarrel) {
        if (isXImport) {
          const xFile = join(srcDir, target.layer, target.slice, '@x', `${target.rest[1]}.ts`)
          if (!existsSync(xFile)) {
            report('missing-x', 'error', `нет файла ${relative(root, xFile).replaceAll(sep, '/')}`)
          }
        } else if (!isTypeOnly) {
          report('sideways', 'error', `кросс-импорт ${here.slice} → ${target.slice} только через @x`)
        }
        continue
      }

      if (!isBarrel && !isXImport && !RULES.allowDeepIn.includes(spec)) {
        report('deep', 'warn', `используй публичный API @/${target.layer}/${target.slice}`)
      }
    }
  })
}

const KINDS = ['upward', 'sideways', 'widget-cycle', 'missing-x', 'deep', 'unknown-layer']
const errors = violations.filter((v) => v.severity === 'error')

if (json) {
  console.log(JSON.stringify({ files: files.length, total: violations.length, errors: errors.length, violations }, null, 2))
} else {
  for (const kind of KINDS) {
    const list = violations.filter((v) => v.kind === kind)
    if (!list.length) continue
    console.log(`\n${kind} (${list.length})`)
    for (const v of list) console.log(`  ${v.severity === 'error' ? '✗' : '·'} ${v.at}  ${v.spec}\n      ${v.hint}`)
  }
  if (!violations.length) console.log(`fsd-guard: OK — ${files.length} файлов, нарушений нет`)
  else console.log(`\nfsd-guard: error ${errors.length}, warn ${violations.length - errors.length}, файлов ${files.length}`)
}

process.exit(strict ? (violations.length ? 1 : 0) : errors.length ? 1 : 0)
