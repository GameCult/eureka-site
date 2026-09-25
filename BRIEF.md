# Eureka landing page: handoff brief

## Status of this brief (operator correction, 2026-09-25). Read this first.

This brief was written by the Eureka-running Self agent **without operator
guidance**, to capture its own perspective. Its authority is invented. Treat it
as one input: useful for its evidence pointers and the campaign defects below,
**not binding direction**. `gpt6-copy.md` (drafted by GPT-6 "Sol") came out of a
longer operator conversation about the direction of Eureka and GameCult and
carries more operator intent, though the copy itself is a draft to workshop.

## Operator rulings (2026-09-25). These settle the open questions below.

- **Standalone site, in this folder: `F:\Projects\eureka-site`.** It will be the
  **public** repo `GameCult/eureka-site`, served at **eureka.gamecult.org**, a
  **GitHub Pages static site**, in the GameCult brand. (This originally said
  "built with GameCult's Quartz setup"; the Quartz part was superseded later the
  same day. See the last ruling below.) The public repo
  https://github.com/GameCult/eureka-site was created on 2026-09-25, with `main`
  tracking origin. The GitHub Pages deploy and the eureka.gamecult.org domain
  are **not set up yet**. (An earlier draft of this section said
  `epiphany-site`; that was a mistype.)
- **The site is Eureka's, not Epiphany's.** The lineage still matters (*"the
  lineage is the whole story"*), but **Eureka is Epiphany's sister, not her
  descendant**: two Personas developing side by side on a shared substrate (the
  Mind schema), not a branch. Same faculty vocabulary (Self, Imagination, Hands,
  Soul, Mind Steward); Epiphany keeps findings in typed state, Eureka in
  committed docs and agent reports (see `SKILL.md`'s opening and
  `references/epiphany-comparison-2026-09-15.md`). Read Epiphany itself,
  `F:\Projects\Epiphany` (README, `docs/`), before shaping that section.
- Naming GameCult projects (CultLib, StreamPixels, Epiphany) is fine. Still never
  name the streamer or any private individual.
- **Cost framing supersedes "What NOT to claim" below.** The ~60% of a weekly
  quota spent in one day was legitimate work, not waste; the regret was spending
  it on a more expensive, more verbose model just as Opus 5.5 released. Do not
  describe it as waste or as off-critical-path Soul loops. "Not speed" still
  stands.
- **Copy direction.** (a) Soften autonomy-leaning lines while keeping "the
  operator owns decisions". (b) Lead with specific defects and why the green
  suite missed them, including the StreamPixels/CultLib campaign defects listed
  below. (c) Cut length. The staccato one-line style stays but is used sparingly
  and animated: lines slide in and away one by one, then the page returns to
  paragraph copy. Style reference the operator loves: https://acko.net/.
- **2026-09-25, later: the page is a scroll-driven WebGL flight in full PS1
  style, hand-built static, NOT Quartz.** This supersedes the Quartz stack named
  in the first ruling above (repo, domain and GitHub Pages still stand). The
  prototype lives in `prototype/` and is served at
  https://yggdrasil.gamecult.org/eureka/ as a stopgap until eureka.gamecult.org
  exists on Pages; deploy per
  `F:\Projects\gamecult-ops\runbooks\eureka-prototype-yggdrasil.md`. Approved
  route, in order: hall/monument; hatch + shaft; Eureka organ chamber; lattice
  (Soul's probes, mutation testing); specimen gallery (one real defect per
  case); archive (rules/evidence); Epiphany's chamber (all eight organs in
  scaffolding: the sister reveal); return to the hall with the monument split
  open, plus install. Organs are PS1 demakes of their Aquarium renditions
  (`F:\Projects\Aquarium\docs\epiphany-agent-sdf-visual-language.md`) using the
  Aquarium organ identity palettes as-is; the GameCult brand does not define
  those colours, so they are a declared exception. The page names the memory
  organ **Life**, not "Mind Steward". As of 2026-09-25 the operator has ordered
  the rename inside the Eureka skill repo, and it is in progress, not landed.
  Renaming it in the global doctrine is a separate decision that has not been made.

---

This was written 2026-09-24 by the Self agent that has been running Eureka on a
live multi-repo campaign for two days: CultLib's TypeScript QUIC transport, and
StreamPixels' service and Unity overlay. It is a boots-on-the-ground account for
the agent who builds the landing page. Read it, then read the sources it points
to. Where this brief and a source disagree, the source wins.

## What you are selling, in one breath

Eureka is a Claude Code skill (MIT, public at https://github.com/GameCult/Eureka).
It splits a big change across separate agents: one maps it, one executes one cut
at a time, and one that did not write the code is told to prove the executor
wrong. The operator rules on genuine product decisions. **Nothing grades its own
work.**

The problem it answers: an agent that plans, implements, tests and reports on its
own work will hand you green tests and a clean report over a broken machine. That
isn't because it lies. Its tests pin its own spelling, and its report is written by
the party with the most reason to believe it.

## Sources of truth (read these, do not restate them from memory)

The skill repo is checked out at `C:\Users\Meta\.claude\skills\eureka\`. Its
remote is `GameCult/Eureka`.
- `README.md`: the public pitch, already written well. **Your page should read
  as the same voice, not a rewrite.** Start from its opening two paragraphs.
- `SKILL.md`: the faculties (Self, Imagination, Hands, Soul, Mind Steward,
  Operator), the loop, and the git and tooling scars.
- `references/postmortem-cultcache.md`: the headline evidence. **29 of 32 Soul
  passes found real defects that the implementer's own green tests had passed,
  about 75 in all.**
- `references/changelog.md`: how the skill changed and why, with evidence per
  entry.
- `docs/assets/`: the mascot (`eureka-mascot-4x.png`, `eureka-mascot.png`,
  `.kra` sources) and `eureka-mascot.prompt.md`, its generation prompt. The
  mascot is a pixel-art inspector crouched on a cracked ALL TESTS PASSING
  monument, prying up a panel stencilled GREEN, beside a specimen case of pinned
  mutants, one still moving and labelled SURVIVED. It *is* the thesis, so use it.

## What it looked like in practice (this campaign, 2026-09-23/24)

Every item below is on record in the named repo's map or commit history. Each was
found by a pass that did not write the code, and in most cases the implementer's
suite was green:

- **Every overlay would have dropped 10 s after connecting.** A handler swap
  meant the provider never recorded CONNECTED, so its handshake timer evicted
  healthy peers. No test lived past 10 s. (CultLib `docs/typescript-quic-realtime-cut.md`.)
- **A use-after-free in a native binding's `release()`.** Reproduced as a core
  dump under thread-pool saturation, and later pinned by a regression test that
  crashes with the old order.
- **A memory leak of about 53 bytes per native call.** That is roughly 36 MB a
  day when idle and gigabytes under load, with a flat JS heap the whole time.
- **Every subathon event after the first would have failed in production.** A
  fractional value was written to an `integer` column, and the tests used
  whole-second fake timers.
- **Split authority:** one transport honoured an admin toggle and the other read
  raw state, so a creator who switched the subathon off could still be served it.
- **A test double that hid a real bug:** the fake executor gave every beat its
  own completion callback, and the real one had a single shared slot. A late
  finish released the *next* beat early, so animations overlapped.
- **"Pre-existing" is not a diagnosis:** a failing test that many agents walked
  past had only ever passed on machines holding a git-ignored licensed asset
  pack.
- **The honest half:** implementers repeatedly *stopped at forks* instead of
  bluffing through, and reported their own vacuous tests. One refused to break
  104 scene references; another found that a mutation passed because its test
  read expected values from the code under test.

## What NOT to claim

- **Not speed.** Eureka is slower and more expensive than one agent. On this
  campaign the operator watched **about 60% of a weekly quota go in one day**,
  much of it on deep Soul loops that weren't on the critical path. The skill now
  tells Self to spend through scope: one Soul gate per cut, fix batches only for
  critical-path findings, narrow cheaper passes for small deltas.
- **Not "the agents are smart enough now."** The point is the opposite. Self (the
  coordinator) was corrected by the operator several times in this campaign, for
  overbuilding an authentication scheme for a single known server and for
  calling authored data "a pipeline". Separation of faculties catches the
  implementer. It does not make the coordinator infallible, and the page
  shouldn't imply it does.
- **Not autonomy.** The operator rules forks. The loop is designed around a human
  who decides product meaning.
- **No victory-lap language** about what it "no longer" does. Describe the live
  system and its tradeoffs. Scars belong in the evidence, told plainly.

## Audience and tone (proposed; confirm with the operator)

- Proposed readers: engineers already using Claude Code (or similar agents) on
  real codebases, who have been burned by "all green" reports.
- Voice: dry and direct, lightly self-deprecating, with no hype. It's the
  README's voice. Concrete scars beat adjectives. **The strongest copy is a
  specific defect and the reason the green suite missed it.**
- A likely call to action: the GitHub repo, and how to install a Claude Code
  skill. Check the current install method against Claude Code's docs; don't
  guess it.

## Visual identity

This is a GameCult surface, so follow the GameCult brand, which is defined in
code:
- `F:\Projects\gamecult-site\site\quartz.config.ts`: `configuration.theme`, for
  the typefaces, weights and palette.
- `F:\Projects\gamecult-site\site\quartz\styles\custom.scss`: the ground wash,
  layout, and page-type variants.
- `F:\Projects\gamecult-site\docs\brand-design-language.md`: what those mean.
  Where it disagrees with the code, the code wins.

The short form: Montserrat 100–200 for large titles, Ubuntu 300 for prose, IBM
Plex Mono uppercase and letter-spaced for small labels. Ground `#07111a`, panels
`#16212c`, body `#b7c7d9`, headings `#eef5ff`, accent `#ff8a2a`, links `#59b7ff`.
It is single-theme dark by decision, so paint every colour explicitly. **The
brand has no success, warning or error colours.** If you want green and red for
"passed" and "survived", you are inventing them, so say so, and consider using
the mascot's own palette instead.

## Open questions for the operator (all four answered 2026-09-25, see the top; kept as history)

1. **Where does it live?** A page on the Quartz-based `gamecult-site`, or a
   standalone static page (and on what domain)? Recommendation: a
   `gamecult-site` page, since the brand and deploy path already exist there
   (check `gamecult-ops` for how that site deploys).
2. **May the campaign examples name StreamPixels and CultLib?** They're GameCult
   projects. Never name the streamer or any private individual.
3. **Should the page mention Epiphany?** Eureka is described as the skill
   counterpart of Epiphany; see `references/epiphany-comparison-2026-09-15.md`.
   Ask how much of that relationship the operator wants public.
4. **Is there a repo for the page?** This folder has no git repo yet. GameCult
   repos default to the `GameCult` GitHub org (see `F:\Projects\CLAUDE.md`,
   "GitHub Repo Creation"). Confirm the name and visibility before creating one.

## Working rules that apply to you

- The global and GameCult doctrine (`~/.claude/CLAUDE.md`, `F:\Projects\CLAUDE.md`)
  apply: map first, keep it small, and no load-bearing JSON if the page grows a
  data layer.
- Don't copy transcripts or agent reports onto the page. Cite the committed
  evidence (the postmortem, the changelog, the maps).
- The mascot has a saved generation prompt. Any new image you generate gets its
  exact final prompt saved beside it, with the same base filename.
