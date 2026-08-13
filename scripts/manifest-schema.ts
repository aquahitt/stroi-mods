/**
 * Vendored copy of the manifest zod schema from the platform repo:
 * `packages/mod-cli/src/manifest-schema.ts` (aquahitt/stroi-homes, private).
 *
 * This copy is intentionally frozen at the time it was vendored. Any schema
 * drift between this file and the platform's source of truth is caught at
 * sync time — the platform's `sync-mods` step re-validates every manifest
 * against its own (possibly newer) schema before vendoring mods into a
 * release build, so an out-of-date copy here fails closed rather than
 * silently accepting an invalid manifest.
 *
 * In the future this hand-maintained copy will be replaced by importing the
 * schema from a published npm package, `@stroi/mod-cli`, once the platform
 * team ships one. Until then, keep this file in sync manually when the
 * upstream schema changes.
 */
import { z } from 'zod';

const InputSpecSchema = z.object({
  type: z.string(),
  transform: z.string().optional(),
  validate: z.string().optional(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

export const ManifestSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  runtime: z.enum(['declarative', 'sandboxed-js']),
  engine: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  platforms: z.array(z.string()).min(1),
  author: z.object({
    name: z.string().min(1),
    contact: z.string().optional(),
    repo: z.string().optional(),
  }),
  trigger: z.object({ event: z.string().min(1), developer: z.string().optional() }),
  permissions: z.array(z.string()),
  category: z.enum(['automation', 'notifications', 'utilities', 'integrations']),
  tags: z.array(z.string()).optional().default([]),
  inputs: z.record(z.string(), InputSpecSchema).optional(),
  ui: z.unknown().optional(),
  qg: z.unknown().optional(),
  limits: z.unknown().optional(),
});

export type Manifest = z.infer<typeof ManifestSchema>;

export function parseManifest(json: unknown): Manifest {
  return ManifestSchema.parse(json);
}
