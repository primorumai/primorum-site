/**
 * WebMCP tool registration for the Primorum Skills Directory.
 *
 * Registers three read-only tools with the browser's model context so
 * browser-driving agents (Chrome built-in AI, extension agents) can query
 * the directory as functions instead of scraping the DOM.
 *
 * Spec: https://webmachinelearning.github.io/webmcp (W3C CG draft)
 * - Chrome 150+: document.modelContext
 * - Chrome 146-149 (flagged): navigator.modelContext
 * - Everything else: tools also exposed on window.__skillsDirectoryTools so
 *   any script-capable agent can call them today, and headless agents can
 *   use the static endpoint at /skills/skills.json instead.
 */
import skillsData from "../data/skills.json";
import { installInstructions, installPrompt } from "../lib/install.js";

const skills = skillsData
  .slice()
  .sort((a, b) => b.stars - a.stars)
  .map((s) => ({ ...s, detailPage: `https://primorum.ai/skills/${s.slug}` }));

const publicEntry = (s) => ({
  slug: s.slug,
  name: s.name,
  author: s.author,
  official: s.official,
  category: s.category,
  stars: s.stars,
  tags: s.tags,
  summary: s.summary,
  repo: s.repo,
  detailPage: s.detailPage,
});

const tools = [
  {
    name: "search_skills",
    description:
      "Search the Primorum agent skills directory. Returns matching skill collections for Claude Code, Codex, Cursor and compatible agents, each with its GitHub repo URL. Empty query returns all skills. Optional category filter: Official, Development Workflows, Directories, Business & Operations, Writing.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Free-text search over name, author, tags, and summary. Empty returns all.",
        },
        category: {
          type: "string",
          enum: [
            "Official",
            "Development Workflows",
            "Directories",
            "Business & Operations",
            "Writing",
          ],
          description: "Optional category filter.",
        },
      },
    },
    annotations: { readOnlyHint: true },
    execute: ({ query, category } = {}) => {
      const q = (query || "").toLowerCase().trim();
      const results = skills.filter((s) => {
        const matchCat = !category || s.category === category;
        const hay =
          `${s.name} ${s.author} ${s.category} ${s.tags.join(" ")} ${s.summary} ${s.description}`.toLowerCase();
        return matchCat && (!q || hay.includes(q));
      });
      return { count: results.length, skills: results.map(publicEntry) };
    },
  },
  {
    name: "get_skill",
    description:
      "Get full details for one skill collection in the directory by its slug (from search_skills), including description, GitHub repo, and install instructions.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The skill slug, e.g. 'superpowers' or 'anthropic-agent-skills'.",
        },
      },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
    execute: ({ slug }) => {
      const s = skills.find((x) => x.slug === slug);
      if (!s)
        return {
          error: `No skill with slug '${slug}'. Use search_skills to list valid slugs.`,
        };
      return { ...publicEntry(s), description: s.description, install: installInstructions(s), installPrompt: installPrompt(s) };
    },
  },
  {
    name: "get_install_instructions",
    description:
      "Get exact install commands for a skill collection, for a given agent (claude-code, codex, cursor, or generic). Returns copy-paste-ready shell or slash commands.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The skill slug from search_skills.",
        },
        agent: {
          type: "string",
          enum: ["claude-code", "codex", "cursor", "generic"],
          description:
            "Which agent to install into. claude-code gets plugin/marketplace commands where available; others get clone-and-copy instructions.",
        },
      },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
    execute: ({ slug, agent } = {}) => {
      const s = skills.find((x) => x.slug === slug);
      if (!s)
        return {
          error: `No skill with slug '${slug}'. Use search_skills to list valid slugs.`,
        };
      const inst = installInstructions(s);
      const isClaude = !agent || agent === "claude-code";
      const steps = isClaude
        ? inst.steps
        : inst.steps.filter((st) => !st.label.startsWith("Claude Code"));
      return {
        skill: s.name,
        repo: s.repo,
        note: inst.note,
        steps: steps.length ? steps : inst.steps,
      };
    },
  },
];

// WebMCP registration (Chrome 150+: document.modelContext; earlier flagged builds: navigator.modelContext)
const ctx =
  (typeof document !== "undefined" && document.modelContext) ||
  (typeof navigator !== "undefined" && navigator.modelContext) ||
  null;

if (ctx && typeof ctx.registerTool === "function") {
  for (const tool of tools) {
    try {
      ctx.registerTool(tool);
    } catch (e) {
      // Duplicate registration on SPA-style navigation — safe to ignore.
    }
  }
}

// Fallback registry: lets extension agents and page scripts call the same
// tools today, and lets us test the tool surface without a WebMCP browser.
window.__skillsDirectoryTools = Object.fromEntries(
  tools.map((t) => [
    t.name,
    { description: t.description, inputSchema: t.inputSchema, execute: t.execute },
  ]),
);
