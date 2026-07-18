#!/usr/bin/env node
// @ts-check
/**
 * dashboard.mjs — Makilesh's career-ops control panel (local web UI).
 *
 * One file, zero new dependencies (uses the js-yaml already installed).
 * Binds to 127.0.0.1 only — never exposed to the network.
 *
 *   npm run dashboard      →  http://localhost:4646
 *
 * What it shows / controls:
 *   • Overview      — pipeline stats, status counts, emails, LLM usage
 *   • Applications  — every tracked application (data/applications.md)
 *   • Pipeline      — pending URLs waiting for evaluation (data/pipeline.md)
 *   • Q&A Bank      — view + EDIT the answers used to fill forms (data/qa-bank.yml)
 *   • Watchlist     — startups.yml + discovered-companies.yml companies
 *   • My details    — what profile info the system sends out (config/profile.yml)
 *   • Run scans     — trigger the zero-token scanners with a recency window
 *
 * Agent-driven modes (evaluate/apply/hunt with review cards) still run in
 * Claude Code chat — this panel is for visibility + data control.
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execFile } from 'child_process';
import yaml from 'js-yaml';

const PORT = process.env.DASHBOARD_PORT ? parseInt(process.env.DASHBOARD_PORT, 10) : 4646;
const HOST = '127.0.0.1';

// ── Data readers (all deterministic, no LLM) ─────────────────────────
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf-8') : '');
const readYaml = (p) => { try { return yaml.load(read(p)) || {}; } catch { return {}; } };
const readJson = (p) => { try { return JSON.parse(read(p)); } catch { return {}; } };

function parseApplications() {
  const text = read('data/applications.md');
  const rows = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^\|\s*(\d+)\s*\|(.+)\|\s*$/);
    if (!m) continue;
    const cells = line.split('|').map((c) => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
    if (cells.length < 8) continue;
    const [num, date, company, role, score, status, pdf, report, ...rest] = cells;
    if (num === '#') continue;
    const reportMatch = (report || '').match(/\((.*?)\)/);
    rows.push({
      num: parseInt(num, 10), date, company, role,
      score: score || '', status: status || '', pdf: pdf || '',
      report: reportMatch ? reportMatch[1] : '',
      notes: rest.join(' | '),
    });
  }
  rows.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.num - a.num);
  return rows;
}

function parsePipeline() {
  const text = read('data/pipeline.md');
  const pending = [];
  const done = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^- \[([ x])\]\s+(\S+)\s*\|?\s*([^|]*)\|?\s*(.*)$/);
    if (!m) continue;
    const item = { url: m[2], company: (m[3] || '').trim(), title: (m[4] || '').trim() };
    (m[1] === 'x' ? done : pending).push(item);
  }
  return { pending, done };
}

function watchlist() {
  const readList = (file, source) => {
    const cfg = readYaml(file);
    return (cfg.tracked_companies || []).map((c) => ({
      name: c.name, careers_url: c.careers_url, ats: c.ats || c.provider || 'auto',
      city: c.city || '', tier: c.tier || '', enabled: c.enabled !== false,
      status: c.status || '', hr_email: c.hr_email || '', source,
    }));
  };
  return {
    startups: readList('startups.yml', 'startups.yml'),
    discovered: readList('discovered-companies.yml', 'discovered-companies.yml'),
  };
}

function profileSummary() {
  const p = readYaml('config/profile.yml');
  return {
    candidate: p.candidate || {},
    compensation: p.compensation || {},
    location: p.location || {},
    location_tiers: p.location_tiers || {},
    email: { ...(p.email || {}), note: 'Never emails your own address.' },
    apply: p.apply || {},
    setup: p.setup || {},
    resume: p.apply?.resume_pdf || 'Makilesh_M_AI_Engineer_Resume.pdf',
  };
}

function overview() {
  const apps = parseApplications();
  const byStatus = {};
  let scoreSum = 0, scoreN = 0;
  for (const a of apps) {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    const s = parseFloat(a.score);
    if (!Number.isNaN(s)) { scoreSum += s; scoreN++; }
  }
  const pipeline = parsePipeline();
  const emails = readJson('data/email-log.json');
  const llm = readJson('data/llm-usage.json');
  const wl = watchlist();
  const gemToday = Object.entries(llm.models || {}).map(([id, m]) => ({ id, today: m.rpd?.count ?? 0, day: m.rpd?.day ?? '' }));
  return {
    total: apps.length,
    byStatus,
    avgScore: scoreN ? (scoreSum / scoreN).toFixed(2) : '—',
    pipelinePending: pipeline.pending.length,
    emailsSent: (emails.sent || []).length,
    watchlistCount: wl.startups.length,
    discoveredCount: wl.discovered.length,
    gemini: gemToday,
    routingLogged: (llm.routing_log || []).length,
    recent: apps.slice(0, 5),
  };
}

// ── Q&A bank editing ─────────────────────────────────────────────────
const QA_PATH = 'data/qa-bank.yml';
function qaLoad() { const b = readYaml(QA_PATH); if (!Array.isArray(b.entries)) b.entries = []; return b; }
function qaSave(bank) { writeFileSync(QA_PATH, yaml.dump(bank, { lineWidth: 100 }), 'utf-8'); }

// ── Scan runner ──────────────────────────────────────────────────────
const SCAN_CONFIGS = new Set(['portals.yml', 'portals-boards.yml', 'startups.yml', 'discovered-companies.yml']);
const POSTED = new Set(['1h', 'same-day', '24h', '3d', '7d']);
let scanRunning = false;

function runScan(config, posted, dryRun) {
  return new Promise((resolve) => {
    const args = ['scan.mjs', '--config', config, '--posted', posted];
    if (dryRun) args.push('--dry-run');
    execFile('node', args, { timeout: 180000, maxBuffer: 4 * 1024 * 1024 }, (err, stdout, stderr) => {
      resolve({ ok: !err, output: `${stdout || ''}${stderr ? '\n' + stderr : ''}`.trim() });
    });
  });
}

// ── HTTP helpers ─────────────────────────────────────────────────────
const json = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
const body = (req) => new Promise((r) => { let s = ''; req.on('data', (d) => (s += d)); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch { r({}); } }); });

// ── Server ───────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}`);
  const path = url.pathname;
  try {
    if (path === '/' || path === '/index.html') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(HTML); return; }
    if (path === '/api/overview') return json(res, 200, overview());
    if (path === '/api/applications') return json(res, 200, parseApplications());
    if (path === '/api/pipeline') return json(res, 200, parsePipeline());
    if (path === '/api/watchlist') return json(res, 200, watchlist());
    if (path === '/api/profile') return json(res, 200, profileSummary());
    if (path === '/api/emails') return json(res, 200, readJson('data/email-log.json'));
    if (path === '/api/qabank' && req.method === 'GET') return json(res, 200, qaLoad().entries);

    if (path === '/api/qabank' && req.method === 'POST') {
      const { action, index, q, a } = await body(req);
      const bank = qaLoad();
      if (action === 'update' && bank.entries[index]) { if (q) bank.entries[index].q = q; if (a) bank.entries[index].a = a; }
      else if (action === 'add' && q && a) bank.entries.push({ q, a, tags: ['manual'], added: new Date().toISOString().slice(0, 10) });
      else if (action === 'delete' && bank.entries[index]) bank.entries.splice(index, 1);
      else return json(res, 400, { error: 'bad request' });
      qaSave(bank);
      return json(res, 200, { ok: true, count: bank.entries.length });
    }

    if (path === '/api/scan' && req.method === 'POST') {
      const { config, posted, dryRun } = await body(req);
      if (!SCAN_CONFIGS.has(config) || !POSTED.has(posted)) return json(res, 400, { error: 'invalid config or posted window' });
      if (scanRunning) return json(res, 409, { error: 'a scan is already running' });
      scanRunning = true;
      const out = await runScan(config, posted, dryRun !== false);
      scanRunning = false;
      return json(res, 200, out);
    }

    json(res, 404, { error: 'not found' });
  } catch (err) {
    json(res, 500, { error: err.message });
  }
});

// ── UI (single page, vanilla JS, dark) ───────────────────────────────
const HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>career-ops — Makilesh</title>
<style>
:root{--bg:#0e1116;--panel:#161b22;--line:#242b36;--fg:#dbe2ea;--dim:#8b96a5;--acc:#4da3ff;--ok:#3fb970;--warn:#d4a72c;--bad:#f56b6b}
*{box-sizing:border-box;margin:0}body{background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,Segoe UI,sans-serif;padding:0 0 60px}
header{display:flex;align-items:center;gap:16px;padding:14px 22px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:5}
header h1{font-size:16px}header .sub{color:var(--dim);font-size:12px}
nav{display:flex;gap:4px;padding:10px 18px;flex-wrap:wrap}
nav button{background:none;border:1px solid transparent;color:var(--dim);padding:6px 12px;border-radius:8px;cursor:pointer;font-size:13px}
nav button.on{color:var(--fg);border-color:var(--line);background:var(--panel)}
main{padding:8px 22px;max-width:1200px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:10px 0 18px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}
.card b{font-size:22px;display:block}.card span{color:var(--dim);font-size:12px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{color:var(--dim);text-align:left;font-weight:500;padding:6px 8px;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:top}
tr:hover td{background:#1a212b}
.badge{display:inline-block;padding:1px 8px;border-radius:20px;font-size:11px;border:1px solid var(--line)}
.s-Applied{color:var(--ok);border-color:var(--ok)}.s-Evaluated{color:var(--acc);border-color:var(--acc)}
.s-SKIP,.s-Rejected,.s-Discarded{color:var(--dim)}.s-Interview,.s-Offer,.s-Responded{color:var(--warn);border-color:var(--warn)}
.dim{color:var(--dim)}.small{font-size:12px}
a{color:var(--acc);text-decoration:none}a:hover{text-decoration:underline}
select,input,textarea,button.act{background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 10px;font:inherit}
button.act{cursor:pointer}button.act:hover{border-color:var(--acc)}
button.act.primary{background:var(--acc);color:#04121f;border-color:var(--acc);font-weight:600}
pre{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px;overflow:auto;font-size:12px;margin-top:12px;white-space:pre-wrap}
.qa{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px;margin-bottom:10px}
.qa input{width:100%;margin-bottom:6px;font-weight:600}
.qa textarea{width:100%;min-height:64px;resize:vertical}
.qa .row{display:flex;gap:8px;margin-top:6px;align-items:center}
.note{background:#14202e;border:1px solid #1d3a5f;border-radius:10px;padding:10px 14px;margin:10px 0;font-size:13px}
h2{font-size:15px;margin:16px 0 8px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media(max-width:900px){.grid2{grid-template-columns:1fr}}
dl{display:grid;grid-template-columns:170px 1fr;gap:4px 10px;font-size:13px}dt{color:var(--dim)}dd{word-break:break-word}
.tag{font-size:11px;color:var(--dim)}
</style></head><body>
<header><h1>career-ops</h1><span class="sub">Makilesh's job-application control panel · local only</span></header>
<nav id="nav"></nav>
<main id="main">Loading…</main>
<script>
const TABS=["Overview","Applications","Pipeline","Q&A Bank","Watchlist","My details","Run scans"];
let tab="Overview";
const $=(s)=>document.querySelector(s);
const esc=(s)=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const api=(p,opt)=>fetch("/api/"+p,opt).then(r=>r.json());
function nav(){$("#nav").innerHTML=TABS.map(t=>\`<button class="\${t===tab?'on':''}" onclick="go('\${t}')">\${t}</button>\`).join("");}
window.go=(t)=>{tab=t;nav();render();};
async function render(){
  const m=$("#main");m.innerHTML="<p class='dim'>Loading…</p>";
  if(tab==="Overview"){const o=await api("overview");
    m.innerHTML=\`<div class="cards">
      <div class="card"><b>\${o.total}</b><span>applications tracked</span></div>
      <div class="card"><b>\${o.byStatus.Applied||0}</b><span>applied</span></div>
      <div class="card"><b>\${o.byStatus.Evaluated||0}</b><span>evaluated, pending</span></div>
      <div class="card"><b>\${o.pipelinePending}</b><span>URLs in pipeline</span></div>
      <div class="card"><b>\${o.avgScore}</b><span>average score</span></div>
      <div class="card"><b>\${o.emailsSent}</b><span>emails sent/drafted</span></div>
      <div class="card"><b>\${o.watchlistCount}+\${o.discoveredCount}</b><span>watchlist + discovered</span></div>
    </div>
    <h2>Recent applications</h2>\${appTable(o.recent)}
    <h2>Gemini usage today <span class="tag">(₹0 policy — local Qwen does the cheap work)</span></h2>
    \${o.gemini.length?"<table><tr><th>model</th><th>requests today</th></tr>"+o.gemini.map(g=>\`<tr><td>\${esc(g.id)}</td><td>\${g.today}</td></tr>\`).join("")+"</table>":"<p class='dim'>No Gemini calls logged yet.</p>"}\`;
  }
  if(tab==="Applications"){const a=await api("applications");
    m.innerHTML=\`<div class="note">Full tracker from <code>data/applications.md</code>. Status changes happen in chat ("mark #5 as Interview") — this view is read-only so the tracker stays consistent.</div>\`+appTable(a);}
  if(tab==="Pipeline"){const p=await api("pipeline");
    m.innerHTML=\`<div class="note">URLs found by scans, waiting for evaluation. Run <b>/career-ops hunt</b> (or <b>pipeline</b>) in Claude Code to evaluate them.</div>
    <h2>Pending (\${p.pending.length})</h2>\${listUrls(p.pending)}<h2>Processed (\${p.done.length})</h2>\${listUrls(p.done)}\`;}
  if(tab==="Q&A Bank"){const q=await api("qabank");
    m.innerHTML=\`<div class="note"><b>These are YOUR answers</b> — application forms are filled with this text verbatim (zero LLM tokens on a match). Edit anything and hit Save. {{company}} and {{role}} are filled per application.</div>
    <div class="row" style="margin-bottom:10px"><button class="act primary" onclick="addQA()">+ Add question</button></div>
    <div id="qalist">\`+q.map((e,i)=>\`<div class="qa" data-i="\${i}">
      <input value="\${esc(e.q)}" id="q\${i}">
      <textarea id="a\${i}">\${esc(e.a)}</textarea>
      <div class="row"><span class="tag">\${(e.tags||[]).join(", ")||"—"} · added \${esc(e.added||"")}</span>
      <span style="flex:1"></span>
      <button class="act" onclick="saveQA(\${i})">Save</button>
      <button class="act" onclick="delQA(\${i})">Delete</button></div></div>\`).join("")+\`</div>\`;}
  if(tab==="Watchlist"){const w=await api("watchlist");
    m.innerHTML=\`<div class="note">Companies whose own career sites get scanned. Add more by telling Claude: <b>"add Groq to my startups"</b> — or find new ones with <b>/career-ops discover</b>.</div>
    <h2>Your watchlist (\${w.startups.length}) — startups.yml</h2>\${wlTable(w.startups)}
    <h2>Auto-discovered (\${w.discovered.length}) — discovered-companies.yml</h2>\${w.discovered.length?wlTable(w.discovered):"<p class='dim'>Nothing discovered yet. Run /career-ops discover in Claude Code.</p>"}\`;}
  if(tab==="My details"){const p=await api("profile");
    m.innerHTML=\`<div class="note">Exactly what the system knows and sends about you. To change anything, edit <code>config/profile.yml</code> or just tell Claude.</div>
    <div class="grid2">
    <div class="card"><h2>Identity</h2><dl>\${dl(p.candidate)}</dl></div>
    <div class="card"><h2>Compensation</h2><dl>\${dl(p.compensation)}</dl></div>
    <div class="card"><h2>Location & priorities</h2><dl>\${dl({...p.location,...flat(p.location_tiers)})}</dl></div>
    <div class="card"><h2>Application settings</h2><dl>\${dl({resume:p.resume,...p.apply,...p.setup,email_cap:p.email.daily_cap,email_note:p.email.note})}</dl></div>
    </div>\`;}
  if(tab==="Run scans"){
    m.innerHTML=\`<div class="note">Zero-token scanners — they hit company ATS APIs directly (no LLM, no browser). New finds land in the Pipeline tab. Evaluating + applying stays in Claude Code (<b>/career-ops hunt</b>) where the review cards are.</div>
    <div class="card" style="max-width:560px">
      <div class="row" style="display:flex;gap:8px;flex-wrap:wrap">
      <select id="scfg"><option value="startups.yml">Startup watchlist</option><option value="discovered-companies.yml">Discovered companies</option><option value="portals.yml">Legacy portals</option></select>
      <select id="sposted"><option>24h</option><option>same-day</option><option>1h</option><option>3d</option><option selected>7d</option></select>
      <label class="small dim"><input type="checkbox" id="sdry" checked> dry run (preview only)</label>
      <button class="act primary" id="sgo" onclick="scan()">Run scan</button></div>
      <pre id="sout" style="display:none"></pre>
    </div>\`;}
}
function appTable(rows){if(!rows||!rows.length)return "<p class='dim'>No applications yet.</p>";
  return "<table><tr><th>#</th><th>date</th><th>company</th><th>role</th><th>score</th><th>status</th><th>notes</th></tr>"+
  rows.map(r=>\`<tr><td>\${r.num}</td><td class="small dim">\${esc(r.date)}</td><td><b>\${esc(r.company)}</b></td><td>\${esc(r.role)}</td><td>\${esc(r.score)}</td><td><span class="badge s-\${esc(r.status)}">\${esc(r.status)}</span></td><td class="small dim">\${esc(r.notes)}</td></tr>\`).join("")+"</table>";}
function listUrls(list){if(!list.length)return "<p class='dim'>None.</p>";
  return "<table><tr><th>company</th><th>title</th><th>link</th></tr>"+list.map(i=>\`<tr><td>\${esc(i.company)}</td><td>\${esc(i.title)}</td><td><a href="\${esc(i.url)}" target="_blank" rel="noopener">open ↗</a></td></tr>\`).join("")+"</table>";}
function wlTable(list){return "<table><tr><th>company</th><th>ats</th><th>city</th><th>tier</th><th>enabled</th><th>careers page</th></tr>"+
  list.map(c=>\`<tr><td><b>\${esc(c.name)}</b>\${c.status?' <span class="tag">'+esc(c.status)+'</span>':''}</td><td>\${esc(c.ats)}</td><td>\${esc(c.city)}</td><td>\${esc(c.tier)}</td><td>\${c.enabled?"✅":"—"}</td><td><a href="\${esc(c.careers_url)}" target="_blank" rel="noopener">open ↗</a></td></tr>\`).join("")+"</table>";}
function dl(o){return Object.entries(o||{}).filter(([k,v])=>v!==null&&v!==""&&typeof v!=="object").map(([k,v])=>\`<dt>\${esc(k)}</dt><dd>\${esc(v)}</dd>\`).join("");}
function flat(o){const r={};for(const [k,v] of Object.entries(o||{}))r[k]=Array.isArray(v)?v.join(", "):v;return r;}
window.saveQA=async(i)=>{await api("qabank",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"update",index:i,q:$("#q"+i).value,a:$("#a"+i).value})});go("Q&A Bank");};
window.delQA=async(i)=>{if(!confirm("Delete this question?"))return;await api("qabank",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"delete",index:i})});go("Q&A Bank");};
window.addQA=async()=>{const q=prompt("Question (as forms phrase it):");if(!q)return;const a=prompt("Your answer ({{company}}/{{role}} allowed):");if(!a)return;
  await api("qabank",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"add",q,a})});go("Q&A Bank");};
window.scan=async()=>{const b=$("#sgo");b.disabled=true;b.textContent="Running…";const out=$("#sout");out.style.display="block";out.textContent="Scanning — this can take up to a couple of minutes…";
  const r=await api("scan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({config:$("#scfg").value,posted:$("#sposted").value,dryRun:$("#sdry").checked})});
  out.textContent=r.output||r.error||"(no output)";b.disabled=false;b.textContent="Run scan";};
nav();render();
</script></body></html>`;

server.listen(PORT, HOST, () => {
  console.log(`career-ops dashboard → http://localhost:${PORT}  (local only, Ctrl+C to stop)`);
});
