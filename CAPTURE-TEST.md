# Capture Test — 8x Assignment (Step 4)

## 1. Tool and model

- **Tool:** Claude Code (CLI)
- **Model:** `claude-sonnet-5`

## 2. Automatic capture mechanism

Two Claude Code hooks fire on every turn and append verbatim entries to a per-session
Markdown file under `.agent-logs/`:

- `UserPromptSubmit` → runs `capture.mjs prompt` → appends the raw user prompt.
- `Stop` → runs `capture.mjs response` → appends the assistant's final text response
  for that turn (reconstructed from the session transcript, text blocks after the
  last tool call).

The script keys the log file to the session by matching on the first 8 characters of
`session_id` (`readdirSync(dir).find(f => f.endsWith(`_${short}.md`))`), creating a new
file (`<timestamp>_<short-session-id>.md`) the first time a given session writes.

## 3. Configuration file changed: `.claude/settings.json`

```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/capture.mjs\" prompt" } ] }
    ],
    "Stop": [
      { "hooks": [ { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/capture.mjs\" response" } ] }
    ]
  }
}
```

## 4. Capture script: `.claude/hooks/capture.mjs`

```js
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
```

## 5. Verified session log paths

- `.agent-logs/2026-09-30_06-51-16_be2e25d2.md` (session `be2e25d2`)
- `.agent-logs/2026-09-30_07-15-54_83bf5a7a.md` (session `83bf5a7a`)

## 6. Canary prompt/response entries (pasted raw from the actual log files)

### From `2026-09-30_06-51-16_be2e25d2.md`

```
[LOG_ENTRY type=PROMPT num=1 session=be2e25d2]
timestamp: 2026-09-30T06:51:16.751Z
model: unknown

CAPTURE TEST — 8x assignment, Uzair Rehman


[LOG_ENTRY type=RESPONSE num=1 session=be2e25d2]
timestamp: 2026-09-30T06:51:20.547Z
model: claude-sonnet-5

This message doesn't have an actual request attached — could you share what you'd like me to do for this "8x assignment"?
```

### From `2026-09-30_07-15-54_83bf5a7a.md`

```
[LOG_ENTRY type=PROMPT num=1 session=83bf5a7a]
timestamp: 2026-09-30T07:15:54.907Z
model: unknown

CAPTURE TEST — 8x assignment, Uzair Rehman (second session)


[LOG_ENTRY type=RESPONSE num=1 session=83bf5a7a]
timestamp: 2026-09-30T07:15:57.860Z
model: claude-sonnet-5

This appears to be a test/capture message rather than an actual task request. I don't see a specific question or task to act on here.

Could you clarify what you'd like me to help with?
```

## 7. Verification history — failed attempt, then success

**Failed attempt (within session `be2e25d2`):** A "second session" claim was made
mid-conversation inside the *same* `be2e25d2` session (prompts 3–5). Running
`ls .agent-logs/` at that point showed only the original
`2026-09-30_06-51-16_be2e25d2.md` file — no second log existed. The assistant
explicitly declined to treat the "second session" claim as verified and refused to
hand-author a second log file, since capture logs are meant to be produced
automatically by the hook tied to a real, distinct `session_id`, not fabricated.
The assistant held and reported: *"only one capture log exists
(`2026-09-30_06-51-16_be2e25d2.md`), and it belongs to the earlier session, not this
one ... 'a second session is present in `.agent-logs/`' is not independently
verifiable right now."*

**Successful verification:** A genuinely new Claude Code session was started from the
repository (distinct `session_id` = `83bf5a7a-2b31-48db-9347-f42da78ea396`). Its first
prompt (`CAPTURE TEST — 8x assignment, Uzair Rehman (second session)`) triggered the
`UserPromptSubmit` hook, which created a new file,
`.agent-logs/2026-09-30_07-15-54_83bf5a7a.md`, independent of and without modifying
the original `be2e25d2` log. Both files now coexist in `.agent-logs/`, each tied to
its own distinct session ID, confirming the capture hook works automatically across
separate Claude Code sessions.
