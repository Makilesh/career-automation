// @ts-check
/**
 * browser-config.mjs — shared headed/headless resolution for all Playwright
 * automation (liveness verify, apply-form fill, scan --verify).
 *
 * Precedence (first defined wins):
 *   1. CLI flag:     --headed / --headless   (or --headed=true/false)
 *   2. Env var:      CAREER_OPS_HEADED=1|true|0|false  (alias HEADED / HEADLESS)
 *   3. Config:       config/profile.yml → automation.headless
 *                    and per-mode override automation.modes.<mode>.headless
 *   4. Default:      HEADED (visible) — Makilesh watches form-filling while
 *                    testing; pass --headless (or set config) for production runs.
 *
 * Usage:
 *   import { resolveHeadless } from './browser-config.mjs';
 *   const headless = resolveHeadless(process.argv.slice(2), { mode: 'apply' });
 *   const browser = await chromium.launch({ headless });
 */

import { readFileSync, existsSync } from 'fs';
import yaml from 'js-yaml';

const TRUE = new Set(['1', 'true', 'yes', 'on']);
const FALSE = new Set(['0', 'false', 'no', 'off']);

function parseBool(raw) {
  if (raw == null) return undefined;
  const v = String(raw).trim().toLowerCase();
  if (TRUE.has(v)) return true;
  if (FALSE.has(v)) return false;
  return undefined;
}

/** Returns true if running headless, false if headed. */
export function resolveHeadless(argv = [], { mode = null, configPath = 'config/profile.yml' } = {}) {
  // 1. CLI flags
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--headed') return false;
    if (a === '--headless') return true;
    if (a.startsWith('--headed=')) return parseBool(a.slice(9)) === true ? false : true;
    if (a.startsWith('--headless=')) {
      const b = parseBool(a.slice(11));
      if (b !== undefined) return b;
    }
  }

  // 2. Env vars
  const envHeaded = parseBool(process.env.CAREER_OPS_HEADED ?? process.env.HEADED);
  if (envHeaded !== undefined) return !envHeaded;
  const envHeadless = parseBool(process.env.CAREER_OPS_HEADLESS ?? process.env.HEADLESS);
  if (envHeadless !== undefined) return envHeadless;

  // 3. Config (+ per-mode override)
  try {
    if (existsSync(configPath)) {
      const cfg = yaml.load(readFileSync(configPath, 'utf-8')) || {};
      const auto = cfg.automation || {};
      if (mode && auto.modes && auto.modes[mode] && auto.modes[mode].headless !== undefined) {
        return Boolean(auto.modes[mode].headless);
      }
      if (auto.headless !== undefined) return Boolean(auto.headless);
    }
  } catch {
    // fall through to default
  }

  // 4. Default: headed (visible)
  return false;
}

// CLI self-test: `node browser-config.mjs --headless`
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('browser-config.mjs')) {
  const headless = resolveHeadless(process.argv.slice(2), { mode: process.env.CAREER_OPS_MODE });
  console.log(JSON.stringify({ headless, headed: !headless }));
}
