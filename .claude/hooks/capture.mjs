// 8x agent capture: appends verbatim PROMPT / RESPONSE entries to .agent-logs/.
// Wired to UserPromptSubmit ("prompt") and Stop ("response") in .claude/settings.json.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const mode = process.argv[2];
const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const dir = path.join(root, '.agent-logs');
fs.mkdirSync(dir, { recursive: true });

const sid = input.session_id;
const short = sid.slice(0, 8);
const now = new Date().toISOString();

function readTranscript() {
  try {
    return fs.readFileSync(input.transcript_path, 'utf8').trim().split('\n')
      .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
function lastModel(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    const m = entries[i].message?.model;
    if (entries[i].type === 'assistant' && m && m !== '<synthetic>') return m;
  }
  return process.env.ANTHROPIC_MODEL || 'unknown';
}
function author() {
  try { return execSync('gh api user -q .login', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
  try { return execSync('git config user.name', { encoding: 'utf8' }).trim(); } catch {}
  return 'unknown';
}

// One file per session; find an existing one by short session id.
let file = fs.readdirSync(dir).map((f) => path.join(dir, f)).find((f) => f.endsWith(`_${short}.md`));
if (!file) {
  const stamp = now.replace(/[:]/g, '-').replace('T', '_').slice(0, 19);
  file = path.join(dir, `${stamp}_${short}.md`);
}

let body = '';
let meta = { first: now, model: 'unknown' };
if (fs.existsSync(file)) {
  const raw = fs.readFileSync(file, 'utf8');
  body = raw.slice(raw.indexOf('[LOG_ENTRY'));
  meta.first = /first_prompt_time: (\S+)/.exec(raw)?.[1] || now;
}
const entries = readTranscript();
const model = lastModel(entries);
const prompts = (body.match(/type=PROMPT/g) || []).length;

if (mode === 'prompt') {
  const n = prompts + 1;
  body += `${body ? '\n\n' : ''}[LOG_ENTRY type=PROMPT num=${n} session=${short}]\ntimestamp: ${now}\nmodel: ${model}\n\n${input.prompt}\n`;
} else if (mode === 'response') {
  // Final response = text blocks after the last tool call of this turn.
  let idx = entries.length - 1;
  const texts = [];
  for (; idx >= 0; idx--) {
    const e = entries[idx];
    if (e.isSidechain) continue;
    if (e.type === 'user') break;
    if (e.type !== 'assistant') continue;
    const c = e.message?.content;
    if (!Array.isArray(c)) continue;
    if (c.some((b) => b.type === 'tool_use') && texts.length) break;
    const t = c.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
    if (t) texts.unshift(t);
  }
  body += `\n\n[LOG_ENTRY type=RESPONSE num=${prompts} session=${short}]\ntimestamp: ${now}\nmodel: ${model}\n\n${texts.join('\n\n')}\n`;
}

const project = path.basename(root);
const date = meta.first.slice(0, 10);
const who = author();
const responses = (body.match(/type=RESPONSE/g) || []).length;
const head = `---\nsession_id: ${sid}\ndate: ${date}\nauthor: ${who}\nmodel: ${model}\ntool: claude-code\nproject: ${project}\ntotal_exchanges: ${Math.max(prompts + (mode === 'prompt' ? 1 : 0), responses)}\nfirst_prompt_time: ${meta.first}\nlast_prompt_time: ${now}\n---\n\n# Session Log - ${date}\n\nSession: \`${short}\` | Project: \`${project}\` | Author: \`${who}\`\n\n---\n\n`;
fs.writeFileSync(file, head + body);
