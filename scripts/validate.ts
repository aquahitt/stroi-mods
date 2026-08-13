/**
 * Standalone validator for mods in this repository.
 *
 * Walks every `mods/<slug>/` directory and checks:
 *   1. `stroi-mod.json` parses against the vendored manifest schema
 *      (see manifest-schema.ts for provenance).
 *   2. The manifest's `id` field matches the directory name (slug).
 *   3. If `runtime` is `"declarative"`, a `declaration.json` file exists,
 *      is non-empty and is valid JSON.
 *
 * Prints one line of status per mod, then a summary. Exits 0 only if every
 * mod passed every check; exits 1 otherwise, having printed *all* collected
 * errors (not just the first one encountered).
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ManifestSchema } from './manifest-schema.ts';

const modsDir = join(process.cwd(), 'mods');

function listModDirs(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir)
    .filter((name) => statSync(join(dir, name)).isDirectory())
    .sort();
}

const slugs = listModDirs(modsDir);

if (slugs.length === 0) {
  console.error(`No mod directories found under ${modsDir}`);
  process.exit(1);
}

let failureCount = 0;
const allErrors: string[] = [];

for (const slug of slugs) {
  const modDir = join(modsDir, slug);
  const modErrors: string[] = [];

  const manifestPath = join(modDir, 'stroi-mod.json');
  let manifest: unknown = null;

  if (!existsSync(manifestPath)) {
    modErrors.push(`missing stroi-mod.json`);
  } else {
    try {
      const raw = readFileSync(manifestPath, 'utf-8');
      manifest = JSON.parse(raw);
    } catch (err) {
      modErrors.push(`stroi-mod.json is not valid JSON: ${(err as Error).message}`);
    }
  }

  let parsed: ReturnType<typeof ManifestSchema.parse> | null = null;
  if (manifest !== null) {
    const result = ManifestSchema.safeParse(manifest);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        modErrors.push(`schema violation at "${path}": ${issue.message}`);
      }
    } else {
      parsed = result.data;
    }
  }

  if (parsed) {
    if (parsed.id !== slug) {
      modErrors.push(`manifest id "${parsed.id}" does not match directory name "${slug}"`);
    }

    if (parsed.runtime === 'declarative') {
      const declarationPath = join(modDir, 'declaration.json');
      if (!existsSync(declarationPath)) {
        modErrors.push(`runtime is "declarative" but declaration.json is missing`);
      } else {
        const raw = readFileSync(declarationPath, 'utf-8');
        if (raw.trim().length === 0) {
          modErrors.push(`declaration.json is empty`);
        } else {
          try {
            const declaration = JSON.parse(raw);
            if (
              declaration === null ||
              typeof declaration !== 'object' ||
              Array.isArray(declaration) ||
              Object.keys(declaration).length === 0
            ) {
              modErrors.push(`declaration.json must be a non-empty JSON object`);
            }
          } catch (err) {
            modErrors.push(`declaration.json is not valid JSON: ${(err as Error).message}`);
          }
        }
      }
    }
  }

  if (modErrors.length === 0) {
    console.log(`OK   ${slug}`);
  } else {
    failureCount += 1;
    console.log(`FAIL ${slug}`);
    for (const err of modErrors) {
      console.log(`       - ${err}`);
      allErrors.push(`${slug}: ${err}`);
    }
  }
}

console.log('');
console.log(`Validated ${slugs.length} mod(s): ${slugs.length - failureCount} OK, ${failureCount} failed.`);

if (failureCount > 0) {
  console.log('');
  console.log('Errors:');
  for (const err of allErrors) {
    console.log(`  - ${err}`);
  }
  process.exit(1);
}

process.exit(0);
