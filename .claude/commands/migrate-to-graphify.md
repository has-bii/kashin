---
description: Migrate from code-review-graph to graphify. Removes code-review-graph config, installs graphify, and builds the knowledge graph.
allowed-tools: Bash, Read, Edit, Write
---

# Migrate from code-review-graph to graphify

You are migrating this project from [code-review-graph](https://github.com/tirth8205/code-review-graph) to [graphify](https://github.com/safishamsi/graphify).

## Step 1: Confirm current setup

Check what code-review-graph left behind:

1. Check for `.code-review-graph/` directory (SQLite graph data)
2. Check for `.code-review-graphignore` file
3. Check for MCP config referencing code-review-graph in:
   - `.mcp.json` (project-level)
   - `~/.claude/mcp.json` (user-level)
   - `.cursor/mcp.json` (Cursor)
   - `.windsurf/mcp.json` (Windsurf)
   - `.continue/config.json` (Continue)
4. Check for git hooks installed by code-review-graph in `.git/hooks/`
5. Check `CLAUDE.md` for any references to code-review-graph

Present findings:

```
Found code-review-graph artifacts:

- [x/✗] .code-review-graph/ directory
- [x/✗] .code-review-graphignore
- [x/✗] MCP config in [location]
- [x/✗] Git hooks
- [x/✗] References in CLAUDE.md

Proceed with migration?
```

Wait for user confirmation.

## Step 2: Clean up code-review-graph

After confirmation:

1. **Remove data directory:**

   ```
   rm -rf .code-review-graph/
   ```

2. **Convert ignore file** (if `.code-review-graphignore` exists):
   - Read its contents
   - Create `.graphifyignore` with the same patterns (same syntax — both use gitignore format)
   - Remove `.code-review-graphignore`

3. **Remove MCP config:**
   - Read the relevant MCP config file(s)
   - Remove the `code-review-graph` server entry
   - Keep all other MCP servers intact
   - If the MCP config file becomes empty (no other servers), remove it

4. **Remove git hooks:**
   - Check `.git/hooks/post-commit` and `.git/hooks/post-checkout` for code-review-graph references
   - If the hook ONLY contains code-review-graph commands, remove the hook file
   - If the hook contains OTHER commands too, only remove the code-review-graph lines

5. **Uninstall the package:**
   ```
   pip uninstall code-review-graph -y
   ```
   If that fails, try:
   ```
   pipx uninstall code-review-graph
   ```

## Step 3: Install graphify

```
pip install graphifyy
graphify install
```

This auto-detects Claude Code (and other supported tools) and writes the correct skill config.

## Step 4: Build the knowledge graph

```
/graphify .
```

Or if running via CLI:

```
graphify .
```

This generates:

```
graphify-out/
├── graph.html       # Interactive graph visualization
├── GRAPH_REPORT.md  # God nodes, connections, suggested questions
├── graph.json       # Persistent queryable graph
└── cache/           # SHA256 cache for incremental re-runs
```

## Step 5: Update project references

1. **Update CLAUDE.md** — replace any code-review-graph references:

   Replace lines like:

   ```
   Use code-review-graph MCP tools to understand existing code structure and dependencies.
   ```

   With:

   ```
   Use graphify to understand existing code structure and dependencies.
   Run `/graphify .` to build the knowledge graph if not already built.
   Query `graphify-out/graph.json` for code relationships, or open `graphify-out/graph.html` for interactive exploration.
   Do NOT read files to "explore" or "understand" the project.
   ```

2. **Update .gitignore** — if `.code-review-graph/` was listed, replace with:

   ```
   graphify-out/
   ```

3. **Update `.claude/docs/`** — if any generated docs reference code-review-graph, update them to reference graphify.

## Step 6: Verify

1. Confirm `.code-review-graph/` is gone
2. Confirm no MCP config references code-review-graph
3. Confirm `graphify-out/` exists with graph files
4. Confirm CLAUDE.md references graphify

Tell the user:

```
Migration complete!

Removed:
- .code-review-graph/ directory
- MCP config for code-review-graph
- Git hooks from code-review-graph
- code-review-graph package

Installed:
- graphify (pip install graphifyy)
- Knowledge graph built in graphify-out/

Key differences:
- code-review-graph used MCP tools → graphify uses /graphify slash command
- code-review-graph stored in SQLite → graphify stores in graph.json + graph.html
- code-review-graph updated via git hooks → graphify re-run with /graphify . (uses SHA256 cache, only processes changed files)
- graphify also supports docs, images, PDFs, and videos — not just code

Run /graphify . anytime to rebuild after significant changes.
```
