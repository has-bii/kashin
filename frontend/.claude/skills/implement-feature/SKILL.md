---
name: implement-feature
description: >
  Main entry point for implementing a new feature in the kashin frontend.
  Invoke this skill whenever the user asks to create, build, add, develop,
  or implement any feature — even if they don't say "feature" explicitly.
  This skill collects the feature name, scope, and layout, then lets the user
  choose how to execute: parallel agents (one per area), inline step-by-step,
  or a custom workflow. It loads the appropriate area-scoped child skills.
user-invocable: true
---

# Implement Feature

You are the orchestrator for feature development in the kashin frontend. Two layouts are available — choose based on complexity before selecting areas.

## Step 1: Collect Context

Ask the user:
1. **Feature name** — what is it called? (e.g. "budget", "report", "notification")
2. **Brief description** — what does it do? (CRUD? read-only? form-heavy? how many dialogs?)

## Step 2: Choose Layout

Based on the description, recommend a layout and confirm with the user:

**Minimal layout** — `api/`, `types/`, `validations/`, `hooks/`, `components/`
- Use when: single dialog or read-only, simple state, no shared selected-item state across siblings

**Extended layout** — adds `query/`, `mutations/`, `context/`, `provider/` on top of minimal
- Use when: two or more dialogs (create, edit, delete) share selected-item state across sibling components

Default areas per layout:

| Layout | Default areas |
|--------|--------------|
| Minimal | `types`, `validations`, `api`, `hooks`, `components` |
| Extended | `types`, `validations`, `api`, `query`, `mutations`, `context`, `provider`, `hooks`, `components` |

Let the user narrow down if needed (e.g. "just the form and hooks").

## Step 3: Present Execution Options

Once layout and areas are confirmed, present exactly these three options:

---

**How would you like to implement this feature?**

**Option 1 — Multi-agent** *(recommended for full features)*
Spawn one parallel agent per area. Each agent loads its area skill and implements that part independently. All agents run in parallel and finish faster. Best when all areas are needed.

**Option 2 — Inline**
Load all area skills sequentially. Create an ordered task list and implement everything in this session, one area at a time. Best for small or focused features where you want full control.

**Option 3 — Custom**
Describe your preferred workflow and I'll adapt accordingly.

---

## Step 4: Execute

### If Option 1 (Multi-agent)

Spawn parallel agents. For each area the user needs, instruct the agent to:
- Load its area skill from `.claude/skills/feature-<area>/SKILL.md`
- Implement that area for the given feature name and description
- Follow all patterns in the loaded skill exactly

Spawn all agents in a single message for true parallelism. Example agent prompt template:

```
Load the skill at .claude/skills/feature-<area>/SKILL.md and implement the <area> layer for the "<feature-name>" feature.

Feature description: <description>
Feature name (used for naming files, functions, types): <feature-name>
Layout: <minimal|extended>

Follow the skill exactly. Create all files in src/features/<feature-name>/<area>/.
```

### If Option 2 (Inline)

Load each area skill in order using the Skill tool, then implement that area before moving to the next.

**Minimal layout order:**
1. `feature-types` — interfaces first so everything else can reference them
2. `feature-validations` — Zod schemas depend on types
3. `feature-api` — raw HTTP functions + queryOptions (minimal)
4. `feature-hooks` — form + mutation wiring
5. `feature-components` — UI, depends on all of the above

**Extended layout order:**
1. `feature-types`
2. `feature-validations`
3. `feature-api` — raw HTTP functions only
4. `feature-query` — queryOptions + QUERY_KEY
5. `feature-mutations` — useMutation hooks
6. `feature-context` — context type + createContext
7. `feature-provider` — provider with dialog state
8. `feature-hooks` — useXxxContext, useXxxForm, useXxxFilter
9. `feature-components`

Create a task list before starting so the user can track progress.

### If Option 3 (Custom)

Ask the user to describe what they want. Listen carefully, then adapt — you may load only a subset of area skills, combine areas, or skip the skill system entirely.

## Area Skill Paths

### Shared (both layouts)

| Area | Skill path |
|------|-----------|
| Types | `.claude/skills/feature-types/SKILL.md` |
| Validations | `.claude/skills/feature-validations/SKILL.md` |
| API | `.claude/skills/feature-api/SKILL.md` |
| Hooks | `.claude/skills/feature-hooks/SKILL.md` |
| Components | `.claude/skills/feature-components/SKILL.md` |

### Extended layout only

| Area | Skill path |
|------|-----------|
| Query | `.claude/skills/feature-query/SKILL.md` |
| Mutations | `.claude/skills/feature-mutations/SKILL.md` |
| Context | `.claude/skills/feature-context/SKILL.md` |
| Provider | `.claude/skills/feature-provider/SKILL.md` |
