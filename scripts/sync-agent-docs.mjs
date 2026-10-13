import { readFile, writeFile } from 'node:fs/promises'
const reference = await readFile(
  new URL('../public/references/api.md', import.meta.url),
  'utf8',
)
const output = new URL('../public/llms-full.txt', import.meta.url)
if (process.argv.includes('--check')) {
  if ((await readFile(output, 'utf8')) !== reference)
    throw new Error(
      'Run npm run docs:sync to update llms-full.txt from references/api.md.',
    )
  console.log('Agent references are in sync.')
} else {
  await writeFile(output, reference)
}
