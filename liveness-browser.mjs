/**
 * Playwright-driven liveness check for a single URL.
 *
 * Shared by check-liveness.mjs and scan.mjs --verify.
 */

import { classifyLiveness } from './liveness-core.mjs';

const NAVIGATE_TIMEOUT_MS = 15_000;
const HYDRATION_WAIT_MS = 2_000;

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fe80:/i,
];

function rejectPrivateOrInvalid(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { code: 'invalid_url', reason: 'invalid URL' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { code: 'unsupported_protocol', reason: `unsupported protocol ${parsed.protocol}` };
  }

  if (PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname))) {
    return { code: 'blocked_host', reason: `blocked host ${parsed.hostname}` };
  }

  return null;
}

export async function checkUrlLiveness(page, url) {
  const guardError = rejectPrivateOrInvalid(url);
  if (guardError) {
    return { result: 'uncertain', code: guardError.code, reason: guardError.reason };
  }

  try {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATE_TIMEOUT_MS,
    });
    const status = response?.status() ?? 0;

    await page.waitForTimeout(HYDRATION_WAIT_MS);

    const finalUrl = page.url();
    const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
    const applyControls = await page.evaluate(() => {
      const candidates = Array.from(
        document.querySelectorAll('a, button, input[type="submit"], input[type="button"], [role="button"]')
      );

      return candidates
        .filter((element) => {
          if (element.closest('nav, header, footer')) return false;
          if (element.closest('[aria-hidden="true"]')) return false;

          const style = window.getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (!element.getClientRects().length) return false;

          return Array.from(element.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0);
        })
        .map((element) => {
          return [
            element.innerText,
            element.value,
            element.getAttribute('aria-label'),
            element.getAttribute('title'),
          ]
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        })
        .filter(Boolean);
    });

    return classifyLiveness({ status, finalUrl, bodyText, applyControls });
  } catch (err) {
    return {
      result: 'uncertain',
      code: 'navigation_error',
      reason: `navigation error: ${err.message.split('\n')[0]}`,
    };
  }
}
