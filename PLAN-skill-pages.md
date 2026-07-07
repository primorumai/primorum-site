# Primorum /skills — Individual Skill Pages + Guides: Page Plan

Generated 2026-07-07 from: autocomplete mining (1,152 relevant queries,
/tmp/query-mine.json) + SKILL.md ingestion (195 skills from 10 repos,
/tmp/individual-skills.json).

## Architecture

```
/skills                          directory index (exists)
/skills/<collection>             16 collection pages (exist)
/skills/s/<skill-slug>           195 individual skill pages  ← NEW
/skills/guides/<guide-slug>      6 guide pages               ← NEW
/skills/skills.json              collection API (exists)
/skills/skills-index.json        individual-skill API        ← NEW
```

Why `/skills/s/<slug>`: avoids collision with collection slugs in the same
namespace; keeps URLs short; slug = skill name (verified zero collisions).

## Individual skill pages (195)

Each page targets: "<skill name> claude code skill" + its task-intent query.
Template contents (all data already ingested):
- H1: skill name + one-line role ("test-driven-development — a Claude Code
  skill for TDD workflow enforcement")
- Frontmatter description (the skill's own words)
- Collection context: parent repo, author, stars, official badge
- Install: copy-install-prompt scoped to the INDIVIDUAL skill (clone repo,
  copy that one folder) + Claude Code marketplace command where applicable
- Read-without-installing: raw SKILL.md link
- JSON-LD: SoftwareSourceCode + BreadcrumbList (3 levels)
- Related skills: same topic across collections (cross-linking mesh)
- Canonical: /skills/s/<slug>; parent collection page links to its children

Query coverage (mined query -> example target pages):
- "claude code skill for code review"    -> code-review skills (21 match "review")
- "claude code tdd skill"                -> superpowers/test-driven-development
- "claude code skill for ui design"      -> design skills (36 match)
- "claude code skill for powerpoint"     -> anthropics/pptx
- "claude code skill for excel"          -> anthropics/xlsx
- "claude code skill for writing"        -> humanizer + writing skills (20)
- "claude code skill for debugging"      -> systematic-debugging + 24 others
- "agent skills for frontend testing"    -> testing skills (29)
- "academic research skill for claude"   -> research skills

## Guide pages (6) — comparison + how-to queries

1. /skills/guides/what-are-agent-skills
   Queries: "agent skills", "agent skills standard", "skill.md file",
   "agent skills docs", "agent skills open standard"
   Content: expanded from existing index section; the spec, history, ecosystem.

2. /skills/guides/skills-vs-plugins-vs-mcp
   Queries: "claude code plugin vs skill", "claude code plugin vs skill vs mcp",
   "claude code plugin vs skill vs agent", "agent skills vs tools",
   "claude code skills vs agents" — HIGH VALUE, both engines suggest, nobody
   owns the answer.

3. /skills/guides/how-to-install-claude-code-skills
   Queries: "how to install claude code skills (from github/globally)",
   "add skills to claude code", "claude code skills install"
   Content: personal vs project scope, marketplaces, plugins, manual copy,
   our copy-paste prompts.

4. /skills/guides/how-to-write-a-skill
   Queries: "how to create a claude code skill", "skill.md format",
   "skill.md frontmatter", "agent skills how to write", "skill.md examples"
   Content: SKILL.md anatomy, frontmatter reference, progressive disclosure
   pattern, template, validation checklist, link to agentskills.io.

5. /skills/guides/best-claude-code-skills
   Queries: "best claude code skills (for developers/web development/reddit)",
   "top claude code skills", "claude code skills recommended"
   Content: opinionated shortlist by use case, drawn from directory data
   (stars + our verification). Updated monthly.

6. /skills/guides/skills-for-other-agents
   Queries: "cursor skills", "codex skills", "gemini cli skills",
   "codex skills vs claude skills", "agent skills cursor"
   Content: the same SKILL.md standard across agents; per-agent install paths;
   compatibility table.

## SEO plumbing

- All 201 new pages in sitemap with real lastmod (frontmatter date)
- skills-index.json: flat API of all 195 skills (name, desc, collection, repo,
  raw SKILL.md URL, install prompt) — advertised in llms.txt; this is the
  machine-readable payoff: agents can search INDIVIDUAL skills, not just repos
- WebMCP search_skills extended to cover individual skills
- Index page gains a "Browse individual skills" section + topic clusters
  (testing, code review, design, documents, ...) linking to filtered views
- Guide pages cross-link to relevant skill pages and vice versa ("Learn how
  to install" -> guide; guide examples -> skill pages)

## Anti-thin-content measures

Pages are generated but not thin: each carries the skill's own full
description, install variants, related-skills mesh, and collection context —
comparable to what a human would assemble. Skills with empty/short
descriptions (< 40 chars) get EXCLUDED from sitemap + noindexed until
enriched (est. ~10 pages) — quality gate against "Crawled - not indexed".

## Build order

1. skills-index.json data file into repo (from /tmp/individual-skills.json)
2. [slug].astro template for /skills/s/ + slugify + exclusion gate
3. Guide pages 2, 3, 4 first (highest query value), then 1, 5, 6
4. Index page topic clusters + nav
5. WebMCP + llms.txt updates
6. Build, verify locally (page count, canonicals, JSON-LD, sitemap), deploy
7. Verify live, submit sitemap to GSC, spot-check indexing after 48h
