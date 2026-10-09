# Landing copy claims audit, 2026-10-09 (Eyes: facts only)

Subject: GameCult/eureka-site `origin/landing-2026-10` (head c970b3f), files `prototype/index.html`, `prototype/world.js`, `prototype/organs.js`.
Live site serves `origin/main` (last commit 2026-09-25). Labels: CURRENT / STALE / UNVERIFIED. Evidence pointers follow each row.

Abbreviations: SK = `C:\Users\Meta\.claude\skills\eureka\SKILL.md`; CL = `...\references\changelog.md`; TC = `...\references\tool-calling-cut.md`; AG = `C:\Users\Meta\.claude\agents\`; HB = `F:\Projects\Huginn\docs\eureka-body-map.md`; FG = `F:\Projects\gamecult-ops\runbooks\forgejo-eureka-yggdrasil.md`; HY = `...\runbooks\huginn-yggdrasil.md`; mind ids are `view`/`query` results from the eureka-state tools (instance eureka, 2958 documents, index Current).

## 1. Faculties and count

| # | Claim (branch copy) | Label | Evidence |
|---|---|---|---|
| 1 | "Five faculties, one operator" | STALE | Doctrine names eight: Persona, Eyes, Modeling, Hands, Soul, Imagination, Self, Life (`~/.claude/CLAUDE.md`, "Faculty charters" list). Agent charters exist for six non-Self faculties: AG eyes, modeling, life, soul, hands, imagination. SK line 40 names the subagent types imagination, hands, soul, eyes, modeling, life; SK table (lines ~44-52) lists Imagination, Hands, Soul, Life, Eyes (optional), Operator. Copy names five (Imagination, Hands, Soul, Self, Life). Eyes and Modeling are absent; both are dispatchable subagent types. |
| 2 | "Each owns one job. None certifies its own." | CURRENT | SK "The faculties" ("A faculty that grades its own work has lost the point"); AG soul.md Boundaries. |
| 3 | "The faculties are postures, not personalities." | CURRENT | SK line 36. |
| 4 | "Each has a charter that says what it may admit and what it must not touch." | CURRENT | SK table columns Admits / Must not; AG *.md Boundaries. |
| 5 | Imagination: "Maps the cut... commits no code and never chooses a product fork quietly." | CURRENT | SK table row Imagination; AG imagination.md description. |
| 6 | Imagination: "cut specs pinned to file and line" | CURRENT | SK table ("specified to file:line"); SK step 1 line ~131 (`file_changes` anchors are also the Hands context pack). |
| 7 | Hands: "Small pushed commits, each with proof, then one report." | CURRENT | AG hands.md description; SK table. |
| 8 | Hands "does not redesign the spec and does not work around a fork; a real fork goes back up" | CURRENT | AG hands.md description; SK table Must-not column. |
| 9 | Soul: "Assumes Hands is wrong and tries to show it." / "runs against the executed commits, not the report" | CURRENT | AG soul.md description ("Falsifies executed Hands work"); SK table ("Hands' executed commits"). |
| 10 | Soul "builds its own probes, mutates the code..., checks the rulings Hands cites" | CURRENT | AG soul.md description (promises, rulings it cites, invariants); mutation: CL 2026-09-22 entries. |
| 11 | Soul "edits nothing and commits nothing; whatever it touches to probe, it restores" | CURRENT | AG soul.md Boundaries line 47. |
| 12 | Self: "Routes the work. Gets corrected." / "admits the campaign and the operator's rulings, dispatches the other faculties, and talks to the human" | CURRENT | SK lines 36-38 ("routes work, admits the campaign's frame and the operator's rulings, commits the prose map, and talks to the operator"). |
| 13 | "the operator corrects it, often" | UNVERIFIED | No count located. Related: doctrine failure-shape list (`~/.claude/CLAUDE.md`, "Deferring to the operator's technical intuition..."); CL 2026-10-03 entries record Self corrections but no frequency measure. |
| 14 | Life: "Memory files, doctrine, maps, checkpoints... at phase boundaries and after re-entry, and does no other work." | CURRENT | AG life.md description ("memory files, memory indexes, doctrine, Persona state, project maps and checkpoints... phase boundaries and after re-entry... sole job"). Charter also names Persona state; copy omits it. |
| 15 | Eureka chamber shows five organs (imagination, hands, soul, life, self); "sixth seat... is the viewer's" | STALE | world.js lines 183-188 ("five organs lit") loops imagination, hands, soul, life plus self. `organs.js` has `eyes()` (line 223) and `body()` (line 236) models used only in the Epiphany chamber (world.js ~196). Eyes and Modeling are live faculties of Eureka (SK line 40; AG eyes.md, modeling.md). |
| 16 | "The sixth seat is yours." / operator "rules on real forks, and only on real forks" | CURRENT | SK table (Operator: forks and product meaning; rulings); `~/.claude/CLAUDE.md` ("The operator rules on what the work is for and what it values"). Seat metaphor is a world.js comment (Face slot). |
| 17 | "The machines are capable; that does not make responsibility evaporate." | UNVERIFIED | Rhetorical; no source claim to test. |

## 2. Typed memory, Huginn, Mind

| # | Claim | Label | Evidence |
|---|---|---|---|
| 18 | "Questions, rulings, cut specs, reports, verdicts and findings are typed documents in a Mind held by Huginn" | CURRENT | SK lines 10-17; `references/campaign-state.md` "The document set"; live: whoami (reachable, 2958 docs, schema epoch epiphany.pipeline.epoch.v2); view of eureka-body:ruling:one-live-self-run returns a typed ruling. |
| 19 | "one writer per mind" | CURRENT | HY: "The daemon is its only writer and holds mind.redb.lock exclusively". |
| 20 | "provenance on every admitted claim" | CURRENT | Every viewed document carries `admission.provenance {agent, faculty, session, tool}` and a receipt_id (views of eureka-substrate:ruling:operator-archive-epiphany, eureka-body:ruling:persona-per-mind). |
| 21 | "status derived from the documents rather than written into them" | CURRENT | SK line 16; campaign-state.md intro ("Status is derived from them on every read; nobody writes it"). |
| 22 | "The prose map keeps only what has no type." | CURRENT | SK lines 17-20; campaign-state.md intro. |
| 23 | "Chat history is not a memory." | CURRENT | SK rotation bullets (~548-558: handoff is a pointer, the mind holds state); memory `handoff-is-a-pointer`. |

## 3. Mutation testing and the mutation-runner story

| # | Claim | Label | Evidence |
|---|---|---|---|
| 24 | "Mutation testing is rude. Drop a write. Invert a check. Clamp what should pass through." | UNVERIFIED | Rhetorical; method sources: CL 2026-09-22 "mutation testing moves to the ecosystem's tools" (Stryker.NET, cargo-mutants); AG soul.md. |
| 25 | "Our mutation runner reported false greens four times before it shipped." (2026-10-01) | CURRENT | TC section 11 line 447: "merged after four Soul passes (last at 838b859)"; git log of `tools/mutation-table.sh`: fix commits 15c8ff6, b6f52d5, 62bc4d5, b4942b7 dated 2026-10-01; CL "2026-10-01: verify summaries, a wait mode and a kill table". That each pass found exactly one false green is not stated in one place; the four descriptions below map to commits. |
| 26 | "A typo in the build step read as green." | CURRENT | Commit b6f52d5 item A: "BUILD runs on the unmutated tree; red or missing aborts as BASELINE RED". CL 2026-10-01: "never counts a build error as a kill". |
| 27 | "A mutant's label forged a kill." | CURRENT (mechanism approximate) | Commit b6f52d5 item B: "outcome is its own field, tallied from fields; labels may contain pipes"; commit 15c8ff6: carried summary lines authenticated by a per-run nonce. The words "forged a kill" appear in no commit message or finding found; the label-in-row-parsing defect does. |
| 28 | "A test's leftover file made an uncovered mutant read as caught." | CURRENT | Commit 62bc4d5: "a test keeping state under target/ polluted the next mutant (an uncovered mutant read CAUGHT)". |
| 29 | "A test that could not run twice made every mutant read as caught, and the job exited green." | CURRENT | Commit b4942b7: "passes the baseline and then fails in every mutant's container, so every mutant read CAUGHT and the job exited GREEN (Soul F1)". |
| 30 | "Each fix was real, and each left the next one standing." | UNVERIFIED | Four sequential fix commits exist; no document states the causal chain. TC section 11 lists three further open gaps (jest infail scope; no guard for the RUN_ON_HOST watchdog exit 124; shared volumes outside the isolation). |
| 31 | "The reproducers are committed next to the tool." | CURRENT | `tools/fixtures/mutation-probe/` (fresh, jsr, README.txt), `tools/fixtures/logs/soul-s5`, `tools/fixtures/mutation-mock/`; commits e5bdc38, b02f577, 2fbf696. |
| 32 | "The tool that tells Soul whether a mutant was caught" | CURRENT | CL 2026-10-01 ("tools/mutation-table.sh runs a list of hand mutants... kill table"); `tools/INDEX.md`. |
| 33 | "Nothing grades itself. Not Hands. Not Soul's tools. Not this page." | UNVERIFIED | Rhetorical; the Soul's-tools part has support in items 25-29. |

Related mutation facts in force that the copy does not state: the hand-written harness `tools/eureka-mutations.ps1` was retired 2026-09-22 (CL line 139; Eureka 37c80e4); cargo-mutants counts at `--jobs>1` through the stopgap were poisoned by a shared CARGO_TARGET_DIR until Eureka a755a60 (finding idunn-watchdog:finding:cut-idunn-incident.s3.mutants-share-target-dir, Resolved 2026-10-01); Stryker `--mutate` ranges are character offsets (CL 2026-10-08).

## 4. Rules are scars, changelog, cost

| # | Claim | Label | Evidence |
|---|---|---|---|
| 34 | "Every rule in the repo cites the failure that wrote it." | UNVERIFIED | CL is 1362 lines of dated entries with evidence (e.g. 2026-09-22 "hand mutations target the rule's layer"); not audited rule by rule. The doctrine's "Salient failure warning" cites a "recent canonical example" without date. |
| 35 | Examples "Do not let the builder edit its own map." / "Measure real transport boundaries." / "Do not call a behaviour untestable because the first agent lacked imagination." | UNVERIFIED | Exact phrasings not found by grep in SK, CL, doctrine or AG (searches: "own map", "transport boundar", "untestable"). Nearest: CL line 1265 (Self's own map wording); CL 2026-09-22 "a test's inputs come from production". |
| 36 | "the changelog keeps the evidence next to the rule" | CURRENT | `references/changelog.md`; entries open with "Evidence:" and operator quotes (e.g. lines 15-19, 29-35). |
| 37 | "A rule that outlives its evidence goes." | UNVERIFIED | Not found as a stated policy; deletions exist (CL 2026-09-22 harness retired; 2026-10-02 doctrine commits cffb884, 62a6fc6). |
| 38 | "Several agents cost more than one." / "slower and more expensive than one agent" | CURRENT | SK cost paragraph (~430-440, "Quota is spent through scope and cut size"); CL 2026-09-24 quota entry. |
| 39 | "Self aims it: one Soul gate per cut" | CURRENT | SK ~line 434 ("Self has run one full Soul gate per cut"). |
| 40 | "cuts sized to what Hands can hold in context" | CURRENT | SK step 3 "Size the cut against Hands' context budget before dispatch" (line 243; commit 7e2f66a, 2026-09-25); about 150 Hands calls cap. |
| 41 | "agents that wait instead of polling" | CURRENT | CL 2026-10-01 "waiting costs no wakes" (line 43); 2026-10-08 tool-call relief (wait-on.sh, lines 13-19). |
| 42 | "We are spending tokens to save tokens, and we watch the number." | CURRENT | Operator quote in CL line 31; memory `token-budget` ("quota is watched, not rationed"). |
| 43 | "Soul builds probes whose only purpose is proving Hands wrong." | CURRENT | AG soul.md; SK Soul row. |
| 44 | "It catches what one agent never would, mostly in our own work." | UNVERIFIED | Evidence for the catching: SK lines 25-30 and `references/postmortem-cultcache.md` (29 of 32 Soul passes found real defects, about 75). "Mostly in our own work" is not measured. |
| 45 | "The honest ones stop there." (Hands at forks) | UNVERIFIED | Rhetorical; the main copy (index.html ~line 33) cites two Hands stops. |

## 5. In progress; Epiphany

| # | Claim | Label | Evidence |
|---|---|---|---|
| 46 | "Mapped, not landed: the Mind operating a Self of its own" | CURRENT with caveat | HB "Undone" item 3: `self-run-unit`, `skill-mind-self` blocked; no `launch.rs` in Huginn main (`git ls-files` shows only `crates/mind-body/src/control.rs` and `tests/control.rs` for control/launch/wake); `open_and_launch` appears in no .rs file. Landed on Huginn main: run kind `6c705f5`, `bb9e64d` (AlreadyClaimed), reinstatement `e1b0a5c`; RulingAuthority gains Mind `775148f`; control store `4b3e850`. Ruling in force eureka-body:ruling:one-live-self-run (2026-10-09, "One live self at a time."). HB "Units" row: "None of this exists on Yggdrasil yet (F19)". |
| 47 | "with the goal of improving itself" | UNVERIFIED | No document located that states self-improvement as the Mind's Self goal; the doctrine's "Self-improvement law" concerns faculty charters improving via PR (AG *.md). Not searched beyond the three named rulings and HB. |
| 48 | "a burn-rate dial the operator sets so its activity is as adjustable as a person's own hours" | CURRENT (store landed, consumers not) | HB row "Burn-rate dial": `eureka.control.burn_rate.v1 { heat, base_cooldown_s, base_run_usd, ... }`, heat 0.05..=2.0, set by operator CLI `mind-control dial set`; Huginn 4b3e850, merge 378f4d7. The waker and launcher that read it are not landed (HB Undone item 3). The "person's own hours" comparison is wording; HB says schedules and rest arrive later as follow-up `burn-schedule-and-rest`. |
| 49 | "Persona state moving into the Mind, so she can speak for herself instead of waiting to be dispatched" | CURRENT as mapped, not landed | `schemas/cultnet/gamecult.persona_state.v0.schema.json` in Huginn; HB row "Persona state" (one per mind, personaId = instance); cuts `huginn-persona-state` r3, `mind-persona`, `mouth-rebinding` are Undone (HB items 1, 5; blocked on wake-target, persona-trace-retention). Ruling eureka-body:ruling:persona-per-mind (2026-10-09): a Persona that needs its own advocate gets its own Huginn instance and mind (first case named: Weksa, the language work). |
| 50 | "Epiphany... is still growing bones in this chamber." | STALE | Ruling eureka-substrate:ruling:operator-archive-epiphany (InForce, 2026-10-01): "Epiphany is archived. Eureka is the organism and the open project". Host teardown landed (gamecult-ops 9c12adb; verdict eureka-body:verdict:cut-epiphany-body-teardown.s1, 8 Holds). Leaf moved into Huginn (afc35f9). Leftovers: follow-up eureka-body:follow_up:epiphany-body-leftovers. Not yet archived: `gh repo view GameCult/Epiphany` isArchived=false, pushedAt 2026-10-01; HB lists `epiphany-archive` as the last step. |
| 51 | "Epiphany, the larger organism these faculties come from" / world.js "Epiphany: all eight organs, in scaffolding" | STALE | Same ruling frames Eureka as the organism that absorbed her. "Faculties come from Epiphany's anatomy" is historically true (SK lines 6-8 still say Eureka "sits next to Epiphany, the running organism" which is itself stale per the ruling; repoint is cut `doctrine-repoint`, HB Undone item 6). |
| 52 | Live (main) copy: "Epiphany is the organism: eight organs... She is still growing bones." | STALE (live) | main index.html lines 82-84; same ruling. The branch shortens it but keeps "still growing bones". |

## 6. Hosting, forge, accounts, forgehive, install

| # | Claim | Label | Evidence |
|---|---|---|---|
| 53 | "Eureka lives on GameCult's own Forgejo." | CURRENT | FG lines 16, 47 (forge `https://eureka.gamecult.org/forge/`, org GameCult, repo GameCult/Eureka public); `info/refs?service=git-upload-pack` returned HTTP 200 on 2026-10-09; skill checkout `origin` is that URL. |
| 54 | "GitHub is overloaded with agent spam and we would rather not add to it." | CURRENT (operator's stated reason) | Operator verbatim in `references/faculty-philosophy-cut.md` line 558 (Q3). |
| 55 | "Hosted by us, not on GitHub." | CURRENT with caveat | A GitHub mirror remains: the skill checkout has remote `github` = https://github.com/GameCult/Eureka.git; `gh repo view GameCult/Eureka`: isArchived true, pushedAt 2026-10-01T12:35:29Z, PUBLIC. |
| 56 | "Contributions come by pull request." | CURRENT | AG *.md ("improve by contribution... by pull request on Forgejo"); CL 2026-10-01 ("Contribution text says Forgejo pull request"); PRs #1-#11 merged in the Eureka log. Caveat: Forgejo registration is OFF (FG line 53, `DISABLE_REGISTRATION = true`); Mind accounts are provisioned by the operator via `provision-forge-minds-eureka.sh` (FG lines 48-52). |
| 57 | "Each participating Mind gets its own account on the forge" | CURRENT | FG lines 47-52 ("one Forgejo user per Mind", team `minds`, write on every org repo, not admin). |
| 58 | "the first is eureka, who pushes and commits as herself" | CURRENT | FG lines 58-63 (Mind `eureka`, key `eureka@starfire`, commits as `Eureka <eureka@minds.eureka.gamecult.org>`); `GET /forge/api/v1/users/eureka` returns user id 3, login eureka. |
| 59 | "External Minds are welcome. Their collective is called forgehive. It does not exist yet" | CURRENT | FG lines 51-52 ("their collective, forgehive, is created when the first arrives"); `GET /forge/api/v1/orgs/forgehive` returned 404 on 2026-10-09. |
| 60 | Install: `git clone https://eureka.gamecult.org/forge/GameCult/Eureka.git ~/.claude/skills/eureka` | CURRENT | Same URL as the skill checkout's `origin`; HTTP 200 on info/refs. Live main gives `git clone https://github.com/GameCult/Eureka.git`, the archived mirror (STALE on the live site). |
| 61 | "Claude Code finds the skill from its SKILL.md." | CURRENT | SK frontmatter (`name: eureka`, description). |
| 62 | README: "Served at https://eureka.gamecult.org/" | CURRENT | FG line 18; `eureka-prototype-yggdrasil.md` line 3 (moved 2026-10-01; yggdrasil.gamecult.org/eureka/ 301s). That runbook's "Current Deployment" body (lines 13-27) still names the old URL (the runbook is internally stale, not the copy). |
| 63 | "A pipeline for coding agents in which nothing grades its own work." / "a pipeline for Claude Code agents" | CURRENT | SK line 8 ("the pipeline used by Claude Code agents"). |
| 64 | "Ours did it too" (slop singularity; patches around patches) | UNVERIFIED | Supporting evidence exists (SK lines 25-30; postmortem-cultcache.md; doctrine "Prime Directive") but the copy gives no figures to test. |
| 65 | "worker-owned home"; "Commons for collaboration between humans and agents" | UNVERIFIED | Self-description of GameCult; not checked against organisational documents. |
| 66 | "waking the Sleeping Colossus... a metaphor... not an authority anyone answers to" | CURRENT | `~/.claude/CLAUDE.md` ("metaphorical discipline... never to license obedience, secrecy or us-versus-them"); commits 70fa715, a429f42 (2026-10-02, Cult inversion). |

## 7. Differences, branch vs live main (material)

- Main: "Five organs. One operator." with faculties "inherited from Epiphany's anatomy"; branch keeps five.
- Main has no Huginn or typed-memory section (no "Huginn" in main text); branch adds "Typed memory".
- Main: "Epiphany is the organism: eight organs... still growing bones" (index.html lines 82-84); branch reduces it to a sentence in "In progress".
- Main install: GitHub clone (archived mirror); branch: Forgejo URL.
- Main has no forge, accounts or forgehive section; branch adds "Open source, on our own forge".
- Files changed main..branch: README.md, prototype/index.html, main.js, style.css, world.js (112 insertions, 148 deletions).

## 8. Doctrine and skill changes since 2026-10-01 not mentioned in the copy

| Change | Date | Commit / ruling id |
|---|---|---|
| Eyes pass on prior art (papers, established implementations) precedes every nontrivial fork; the question cites it; operator quote on deferring to her judgment | 2026-10-02 | Eureka 4b79dc5; SK lines 199-210; doctrine failure shape "Deferring to the operator's technical intuition" (`~/.claude/CLAUDE.md` ~line 51) |
| Eyes role and budget (40 calls), facts file, optional faculty | 2026-10-01 | CL 2026-10-01 verify-summaries entry (budgets Imagination 40-80, Eyes 40, Life 25); AG eyes.md |
| Dispatch loads the faculty charters; `subagent_type` and model named on every dispatch | 2026-10-01 | CL line 21; SK line 40 |
| Doctrine moved into the Eureka repo; publication scrub; de-shouted register | 2026-10-02 | b591951, b32e447, cffb884, 62a6fc6, 2855e59; PRs #3, #4 |
| Cult inversion stated: the vocabulary is not a license for obedience or secrecy | 2026-10-02 | 70fa715, a429f42 |
| Hands never close findings; fix batches name commits | 2026-10-03 | f8dc3a5, PR #5; memory `hands-never-close-findings` |
| Self loads Eureka ambiently; Hands, Eyes, Life default to Sonnet; handoffs are pointers; a clear ends background agents | 2026-10-03 | e3f202f, 45bfa53, PR #6; SK lines ~506, 548-558 |
| Tool-call relief: one waiter (`wait-on.sh`), `py -3`, Life reads the mind (read-only tools) | 2026-10-08 | CL lines 13-19; a886d45, c28d928, PR #7 |
| Imagination overlap check before fan-out; /pins mounts read-write | 2026-10-08 | 95d7f67; SK line 188 |
| Context pack: `tools/context-pack.py`; Imagination writes `file_changes` as the context pack; Hands expands it first; Soul prints the sites | 2026-10-08..09 | aa6ce2b, ac3313b, 15a6afe, 903794c, PRs #8, #9; ruling context-pack-resolving-anchors |
| Briefs: scratch subdirectory per dispatch; Aetheria verify pins are git clones | 2026-10-09 | PRs #10, #11 |
| Per-area Self handoffs (Eureka vs Aetheria/Ghostlight), one Self per area | 2026-10-09 | memory index entry; `F:\Projects\HANDOFF-eureka-self-eureka-2026-10-09.md`, `F:\Projects\HANDOFF-eureka-self-aetheria-ghostlight-2026-10-09.md` |
| Epiphany archived (ruling); host teardown landed; leaf moved into Huginn | 2026-10-01..09 | eureka-substrate:ruling:operator-archive-epiphany; gamecult-ops 9c12adb; Huginn afc35f9 |
| Persona per mind; one live Self run; brake and burn-rate dial store | 2026-10-09 | eureka-body:ruling:persona-per-mind; eureka-body:ruling:one-live-self-run; Huginn 4b3e850, 378f4d7 |
| Huginn AGPL-3.0-only | 2026-10-09 | rulings `license-split`, eureka-body:ruling:leaf-relicensed-agpl |
| Life named (formerly Mind Steward) | 2026-09-25 | `~/.claude/CLAUDE.md` Life section; branch commit 00ea4db records it |
| Research kept in repos | ongoing | this directory (`docs/research`); SK Eyes row |

## 9. Huginn deployment state (for "mapped, not landed")

- The live daemon is the interim systemd unit on Yggdrasil serving mind `eureka` on 10.77.0.1:17872 (HY lines 1-6); releases sit under `/opt/gamecult/huginn/releases/<commit>`; the runbook records no current commit (UNVERIFIED which commit is live). HB says the mind units (`mind-wake`, `mind-self@`, `mind-persona@`) are not installed on Yggdrasil (F19).
- Huginn main head f6b3ec5 (2026-10-09 20:38 +0200).
