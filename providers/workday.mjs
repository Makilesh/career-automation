// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

// Workday provider: public "cxs" jobs API (zero-token). Used by larger
// startups / scaleups (e.g. Fractal). careers_url looks like:
//   https://{tenant}.{shard}.myworkdayjobs.com/{site}
//   → POST https://{tenant}.{shard}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs
// Posting page: https://{tenant}.{shard}.myworkdayjobs.com/{site}{externalPath}

function parseWorkday(entry) {
  const url = entry.careers_url || '';
  const m = url.match(/^https?:\/\/([^.]+)\.([^.]+)\.myworkdayjobs\.com\/([^/?#]+)/i);
  if (!m) return null;
  const [, tenant, shard, site] = m;
  return {
    tenant, shard, site,
    host: `https://${tenant}.${shard}.myworkdayjobs.com`,
    api: `https://${tenant}.${shard}.myworkdayjobs.com/wday/cxs/${tenant}/${site}/jobs`,
  };
}

// Workday exposes a relative "postedOn" string ("Posted 3 Days Ago",
// "Posted Today", "Posted 30+ Days Ago"). Convert to an approx ISO date so
// the --posted recency filter works. "30+" → 31 days (older than any window).
function approxPostedDate(postedOn) {
  if (!postedOn) return null;
  const s = postedOn.toLowerCase();
  const now = Date.now();
  const DAY = 86400000;
  if (s.includes('today')) return new Date(now).toISOString();
  if (s.includes('yesterday')) return new Date(now - DAY).toISOString();
  const plus = s.match(/(\d+)\+?\s*day/);
  if (plus) return new Date(now - (parseInt(plus[1], 10) + (s.includes('+') ? 1 : 0)) * DAY).toISOString();
  const wk = s.match(/(\d+)\+?\s*week/);
  if (wk) return new Date(now - parseInt(wk[1], 10) * 7 * DAY).toISOString();
  const mo = s.match(/(\d+)\+?\s*month/);
  if (mo) return new Date(now - parseInt(mo[1], 10) * 30 * DAY).toISOString();
  return null; // unknown format → undated (kept by recency filter)
}

/** @type {Provider} */
export default {
  id: 'workday',

  detect(entry) {
    const wd = parseWorkday(entry);
    return wd ? { url: wd.api } : null;
  },

  async fetch(entry, ctx) {
    const wd = parseWorkday(entry);
    if (!wd) throw new Error(`workday: cannot parse careers_url for ${entry.name}`);

    const out = [];
    const LIMIT = 20;
    for (let offset = 0; offset < 200; offset += LIMIT) {
      const json = await ctx.fetchJson(wd.api, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ appliedFacets: {}, limit: LIMIT, offset, searchText: '' }),
      });
      const items = Array.isArray(json?.jobPostings) ? json.jobPostings : [];
      for (const j of items) {
        const path = j.externalPath || '';
        out.push({
          title: j.title || '',
          url: path ? `${wd.host}/${wd.site}${path}` : wd.host,
          company: entry.name,
          location: j.locationsText || '',
          posted: approxPostedDate(j.postedOn),
        });
      }
      if (items.length < LIMIT) break;
    }
    return out;
  },
};
