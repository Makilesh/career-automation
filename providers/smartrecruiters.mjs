// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

// SmartRecruiters provider: public postings API (zero-token).
// Many Indian startups use SmartRecruiters (e.g. Juspay, Freshworks).
//   List: https://api.smartrecruiters.com/v1/companies/{slug}/postings?limit&offset
//   Apply page: https://jobs.smartrecruiters.com/{slug}/{postingId}

function resolveSlug(entry) {
  if (entry.sr_slug) return entry.sr_slug;
  const url = entry.careers_url || '';
  // jobs.smartrecruiters.com/{slug}  OR  careers.smartrecruiters.com/{slug}
  const m = url.match(/smartrecruiters\.com\/([^/?#]+)/i);
  if (m) return m[1];
  // api.smartrecruiters.com/v1/companies/{slug}/postings
  const a = url.match(/api\.smartrecruiters\.com\/v1\/companies\/([^/?#]+)/i);
  return a ? a[1] : null;
}

/** @type {Provider} */
export default {
  id: 'smartrecruiters',

  detect(entry) {
    const slug = resolveSlug(entry);
    return slug ? { url: `https://api.smartrecruiters.com/v1/companies/${slug}/postings` } : null;
  },

  async fetch(entry, ctx) {
    const slug = resolveSlug(entry);
    if (!slug) throw new Error(`smartrecruiters: cannot derive slug for ${entry.name}`);

    const out = [];
    const LIMIT = 100;
    // Paginate up to ~500 postings (5 pages) — plenty for one company.
    for (let offset = 0; offset < 500; offset += LIMIT) {
      const api = `https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=${LIMIT}&offset=${offset}`;
      const json = await ctx.fetchJson(api);
      const items = Array.isArray(json?.content) ? json.content : [];
      for (const j of items) {
        out.push({
          title: j.name || '',
          url: `https://jobs.smartrecruiters.com/${slug}/${j.id}`,
          company: entry.name,
          location: [j.location?.city, j.location?.country].filter(Boolean).join(', '),
          posted: j.releasedDate || null,   // ISO — good for --posted recency
        });
      }
      if (items.length < LIMIT) break;      // last page
    }
    return out;
  },
};
