// main.ts — builds the entry dossier for the GTA 6 trophy guide.
// Node 22, standard library only. Copies app/ and screenshots/ into the
// output directory (default /output, or MAKEFUN_OUTPUT_DIR outside the
// grader) and writes /output/dossier.json with the make.fun dossier library.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function main() {
  // Start clean so stale files can never leak into the dossier.
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
  console.log('dossier written:', join(outDir, 'dossier.json'), dossier.length, 'bytes');
}

main();
