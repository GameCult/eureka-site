# Eureka

## Your coding agent passed its own tests.

How reassuring.

Eureka is an open workflow for agentic software engineering where the agent that writes the code does not get to certify that the code works.

One agent maps the change.
One implements it.
Another arrives afterward and tries to prove it wrong.

The last one is called **Soul**.

For reasons that became increasingly obvious.

---

## First there was Epiphany

The first week GameCult encountered modern coding agents, one thing became difficult to ignore.

They were fast.

Alarmingly fast.

An agent could cross enough of a codebase in an afternoon to create architectural consequences that used to require several humans, several meetings, and at least enough elapsed time for somebody to become suspicious.

This was presented, reasonably enough, as a productivity improvement.

The inconvenient question was what happened when local productivity outran global understanding.

An agent can make a locally sensible change, then another locally sensible change, then another, while the architecture quietly stops making sense.

Tests pass.

Tasks close.

Progress reports remain excellent.

The project acquires an adapter around a compensator around a cache and everyone involved has receipts proving that each individual decision was perfectly reasonable.

This is **global coherence collapse**.

GameCult started building **Epiphany** almost immediately.

Epiphany is an organizational layer above frontier workers: shared governed state, bounded authority, durable memory, explicit ownership, coordinated action, evidence, receipts, and independent verification for work that must remain coherent beyond one prompt, one agent, or one session.

The premise is simple:

**A project needs a Mind that survives the workers thinking about it.**

Prompts are not that Mind.

Chat history is not that Mind.

A larger context window is still not that Mind.

Epiphany is.

Or will be.

She is still under construction.

She is, after all, very particular about her body.

---

## Eureka is her sister

Unfortunately, GameCult still had software to ship while Epiphany was acquiring organs.

The process Epiphany was being built to embody was already how we increasingly worked:

separate understanding from execution;

map authority before moving it;

preserve decisions;

make promises explicit;

keep evidence;

let implementation proceed without constant human pulse maintenance;

and then send in somebody who did not write the thing to find out whether any of it was actually true.

For a while this existed as practice rather than product.

Agents were given parts of Epiphany's process ad hoc.

Different arrangements were tried.

Verification was separated from implementation.

Migration state was made durable.

Behavioral promises were written down.

Agents were told to attack each other's work.

The failures were recorded.

The shape got less hypothetical.

Eventually an agent was asked to formalize what we were already doing into a pipeline and run it against a real migration.

That pipeline became Eureka.

The migration did not invent the method.

It was the first time the method was forced to explain itself.

Reality was helpful.

---

## Green is a color

An agent that plans a change, implements it, writes the tests, runs the tests, and reports success has produced a very coherent account of events.

Unfortunately, coherence is not correctness.

The tests may pin the implementation instead of the requirement.

The requirement may have been interpreted incorrectly.

The implementation and its tests may share the same blind spot.

The report is written by the party with the strongest reason to believe the work is finished.

This is commonly called an agentic development workflow.

Eureka adds another step.

**Prove it.**

---

## Nothing grades itself

Eureka separates the work into independent faculties inherited from Epiphany's model of coordinated work.

### Imagination

Maps the change before implementation begins.

It identifies behavioral promises, ownership boundaries, deletions, affected surfaces, verification obligations, and the decisions that actually require a human.

The point is not to generate a large specification.

The point is to make it difficult for implementation to quietly redefine the task.

### Hands

Implements one bounded cut.

Hands follows the map.

It does not update the map afterward so that the route taken mysteriously becomes the route intended.

Small commits. Explicit scope. No convenient retroactive theology.

### Soul

Receives the completed work and assumes something is wrong with it.

Soul does not trust the implementation report.

It does not trust green tests merely because they are green.

It builds its own probes.

It attacks the behavioral promises.

It mutates implementations where useful and asks whether the existing evidence can distinguish correct behavior from a plausible wrong one.

Soul's job is not to review the code sympathetically.

Soul's job is to make the code regret making promises.

This tends to be educational.

### Self

Coordinates the campaign, preserves continuity, and brings genuine product decisions back to the operator.

Not every ambiguity deserves autonomy.

Not every inconvenience deserves a meeting.

### Mind Steward

Keeps the durable state honest at phase boundaries.

Because memory that quietly rewrites itself is generally considered a feature until the moment it matters.

### The operator

Owns decisions that are actually decisions.

Machines are very capable.

This does not require pretending responsibility disappeared.

---

## The first formal campaign went badly

Which is to say: usefully.

In the migration where Eureka's pipeline was first formalized, **29 of 32 independent falsification passes found real defects after the implementing agent's own tests had passed.**

Roughly 75 defects in total.

Among them:

* deadlocks;
* lost writes;
* cross-runtime wire incompatibilities;
* behavioral rules everyone had agreed were effectively untestable;
* tests proving only that one particular wrong constant had not been used;
* verification evidence that existed only in an agent's vanished scratchpad;
* states admitted by one boundary that another boundary could never transport.

One rule required three independent verification passes before the tests finally pinned the behavior they claimed to pin.

Another supposedly untestable rule took about fifteen lines and a millisecond to falsify.

A document could be accepted by the system while being 86,751 bytes too large for the transport required to return it.

All tests were passing.

Naturally.

---

## It did not stop happening

That first campaign was not an exceptional disaster preserved for marketing purposes.

Eureka now accompanies most non-trivial changes in GameCult's repositories.

Imagination maps the behavior.

The operator and the agents argue through the awkward details.

Hands implements the result.

Hands tests it.

Then Soul arrives.

Something is wrong.

Not occasionally enough to dismiss the process as paranoia.

Reliably enough that removing the independent verification step is difficult to contemplate.

The defects change.

The pattern does not.

This is why Eureka exists.

---

## Better prompts are lovely

Eureka assumes competent agents.

Imagination can spend substantial effort specifying behavior.

The operator can resolve ambiguities.

Hands can implement carefully.

The test suite can pass.

Something still breaks.

The problem is not simply insufficient instruction.

Implementation and verification performed through the same reasoning path are correlated.

The interpretation that produced the code tends to produce the tests that approve the code.

The assumptions that shaped the implementation tend to survive into the implementation's explanation of itself.

Asking the same system to look harder is useful.

Giving another system the explicit job of proving it wrong is more useful.

---

## Mutation testing is rude

This is one of its better qualities.

A test suite is supposed to distinguish correct behavior from incorrect behavior.

Mutation testing asks it to demonstrate this rather than merely wearing the uniform.

Change the implementation in a plausible way.

Clamp something that should pass through unchanged.

Drop a write.

Invert an authority check.

Break one side of a protocol.

Preserve the implementation's shape while violating the promise.

If the tests remain green, the tests have learned something about themselves.

Soul uses this aggressively because ordinary review has an unfortunate habit of accepting code that looks exactly like the code everyone expected to see.

Incorrect software is under no obligation to look suspicious.

---

## Expensive, unfortunately

Eureka uses substantially more inference than allowing one agent to do everything.

There are several agents.

They repeat work.

Soul frequently creates tests and probes that exist mainly to establish that Hands was wrong.

This would be terribly inefficient if defects were free.

They are not.

Neither are regressions.

Neither are architectural misunderstandings.

Neither is spending three months building on top of a promise that was never actually true.

Eureka optimizes for software that survives contact with reality.

Token efficiency is considered afterward.

We remain devastated by the expense of discovering bugs before shipping them.

---

## Evidence survives the session

A claim such as:

> this migration preserves behavior

is not evidence.

Neither is:

> all tests pass

Neither is a paragraph explaining why the implementation is obviously correct.

Eureka keeps the artifacts required to inspect what happened:

* behavioral promises;
* authority maps;
* migration maps;
* operator rulings;
* verification plans;
* independent probes;
* mutation results;
* implementation commits;
* surviving failures;
* postmortems;
* the evidence behind changes to the workflow itself.

A process whose history has been cleaned up is difficult to learn from.

So we don't clean it up.

The scars stay.

---

## Every rule should have a body count

Eureka is not a methodology assembled from preferences about what software engineering ought to look like.

Its rules are accumulated damage.

A rule exists because some apparently reasonable alternative failed.

Prefer deletion before compatibility clutter.

Preserve verification artifacts.

Do not let implementation edit its own map.

Verify caller-controlled values against transformations, not one representative constant.

Measure real transport boundaries.

Separate authorities.

Make operator decisions explicit.

Do not call a behavior untestable merely because the first agent lacked imagination.

The changelog records why these rules exist.

This is deliberate.

A rule without evidence is merely another opinion in a repository already full of them.

---

## Built for real repositories

Eureka is not a benchmark harness for toy tasks.

It is used for migrations, architectural changes, protocol work, persistence changes, state ownership transfers, cross-runtime behavior, and ordinary maintenance where plausible local success can leave the larger machine incorrect.

A non-trivial change is usually enough reason to invoke it.

Not because every change is catastrophic.

Because discovering which ones were catastrophic afterward is tedious.

---

## Epiphany and Eureka

Epiphany is the larger answer.

She is being built to give projects durable governed cognition: shared state, role separation, bounded authority, continuity, evidence, receipts, verification pressure, and the ability to coordinate frontier workers without requiring a human to spend the day typing `Continue`.

Eureka is narrower.

She can run now.

She takes the part of Epiphany's process concerned with changing software and packages it into a workflow that existing agent harnesses can execute today.

Epiphany is the organism.

Eureka is the field kit we built while waiting for the organism to finish growing bones.

They share the same faculties because they share the same problem.

Capable workers are not enough.

The work must remain coherent.

---

## Open by design

Eureka is open source.

Use it.

Fork it.

Read every rule.

Replace the vocabulary if the vocabulary bothers you.

Keep the parts that work.

If your use of Eureka discovers a failure mode we have not seen before, that is more interesting.

The intended ecosystem is simple:

**run the workflow on real work;
find real failures;
keep the evidence;
improve the workflow;
share the scar if you choose.**

Eureka should eventually be able to prepare a sanitized evidence contribution after a campaign and ask the operator whether to submit it upstream.

Not the repository.

Not the private session.

Not whatever an agent helpfully decided was probably fine to upload.

The scar:

what was promised;

what evidence passed;

what was actually wrong;

what falsified it;

and what the workflow had to learn.

The operator sees the payload.

The operator decides whether it leaves.

No background telemetry.

No quiet harvesting.

Consent continues to work even when data would be useful.

A niche position.

---

## The commons gets better when it is used

GameCult does not need Eureka to remain obscure for Eureka to remain valuable.

The opposite is preferable.

More users mean more repositories.

More repositories mean more environments.

More environments mean more ways apparently sensible engineering can fail.

Those failures can become evidence.

The evidence can become rules.

The rules can prevent somebody else paying for the same lesson.

The machinery is public.

Stewardship is the work.

If another team can take Eureka, learn from it, improve its own process, and never need GameCult, good.

Dependency is a strange success metric for infrastructure intended to empower people.

If they later need help adapting the process, challenging it, or independently determining whether their own agentic system is telling them the truth, that is useful work too.

---

## For engineering teams

If your organization is introducing coding agents, you probably already have a workflow.

The useful questions begin afterward.

Who verifies the work?

Did the verifier inherit the implementer's assumptions?

What exactly do your tests prove?

Can verification evidence be reproduced after the session ends?

What happens when a dependency changes underneath a mocked contract?

What happens when an agent satisfies the wording while violating the behavior?

Who owns architectural truth after five agents have edited five different surfaces?

Can you distinguish increased output from increased correct output?

Can you prove that distinction to yourselves without asking the system producing the work?

If the answers are mostly dashboards, confidence scores, and a large green checkmark, Eureka may be relevant.

---

## For people who would rather just install it

Eureka is an open engineering workflow packaged for agent harnesses.

The Claude Code implementation can be installed directly from:

`GameCult/Eureka`

Point it at something sufficiently unpleasant.

It will ask more questions of your code than your code would prefer.

That is the idea.

If you want the larger machine she came from:

`GameCult/Epiphany`

Bring patience.

She is still choosing organs.

---

## GameCult

GameCult builds open infrastructure for coordinated work between humans, projects, communities, and agents.

We prefer inspectable machinery, explicit authority, durable evidence, local agency, and systems whose continued existence does not depend on keeping their users helpless.

Eureka is one result.

Epiphany is another.

The software is available because useful infrastructure becomes more valuable when more people can use it.

GameCult also works with engineering organizations that need help applying these methods to their own agentic development processes: architecture, workflow design, independent verification, evidence systems, migration discipline, and finding out whether the impressive thing they have built is real.

The workflow is free.

Learning every lesson personally remains available at market rates.
