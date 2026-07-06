/**
 * Install instructions for a skill entry, keyed by agent.
 * Single source of truth — used by the detail pages (static HTML),
 * the WebMCP tools, and the window.__skillsDirectoryTools fallback.
 */
export function installInstructions(skill) {
  const gh = skill.repo.replace("https://github.com/", "");
  const shortName = gh.split("/")[1];

  if (skill.installKind === "list") {
    return {
      note: `${skill.name} is a curated directory of links to other skill repos, not an installable skill collection. Browse it to find skills, then install those from their own repositories.`,
      steps: [
        { label: "Browse the list", command: `open ${skill.repo}` },
        {
          label: "Fetch the README as markdown (for agents)",
          command: `curl -sL https://raw.githubusercontent.com/${gh}/main/README.md`,
        },
      ],
    };
  }

  if (skill.installKind === "marketplace") {
    return {
      note: `${skill.name} is a Claude Code plugin marketplace. Register it once, then install individual plugins/skills from it. For other agents, clone and copy the skill folders you need.`,
      steps: [
        {
          label: "Claude Code — register marketplace",
          command: `/plugin marketplace add ${gh}`,
        },
        {
          label: "Claude Code — then browse & install",
          command: `/plugin`,
        },
        {
          label: "Any agent — clone and copy a skill folder",
          command: `git clone ${skill.repo} && cp -r ${shortName}/<skill-name> ~/.claude/skills/`,
        },
      ],
    };
  }

  // installKind === "skills": plain SKILL.md folders
  return {
    note: `${skill.name} ships skills as folders containing SKILL.md. Copy the folders you want into your agent's skills directory (Claude Code: ~/.claude/skills/ for personal, .claude/skills/ for project scope; other agents: their SKILL.md directory).`,
    steps: [
      { label: "Clone the repo", command: `git clone ${skill.repo}` },
      {
        label: "Copy a skill into Claude Code (personal scope)",
        command: `cp -r ${shortName}/<skill-name> ~/.claude/skills/`,
      },
      {
        label: "Read a skill without installing",
        command: `curl -sL https://raw.githubusercontent.com/${gh}/main/<skill-name>/SKILL.md`,
      },
    ],
  };
}

/**
 * A self-contained prompt a user can paste into any AI agent to have it
 * install this skill collection. Written to work for Claude Code, Codex,
 * Cursor, and generic SKILL.md-compatible agents.
 */
export function installPrompt(skill) {
  const gh = skill.repo.replace("https://github.com/", "");

  if (skill.installKind === "list") {
    return `Please help me find and install agent skills from the curated list "${skill.name}".

1. Fetch the list: https://raw.githubusercontent.com/${gh}/main/README.md (source: ${skill.repo})
2. Summarize the skills most relevant to my work and ask me which I want.
3. For each one I pick, install it from its own repository: clone the repo, then copy the skill folder (the one containing SKILL.md) into your skills directory — for Claude Code that's ~/.claude/skills/ (personal) or .claude/skills/ (project); for other agents use their SKILL.md directory.
4. Confirm each installed skill loads (list your available skills afterwards).

More details: https://primorum.ai/skills/${skill.slug}`;
  }

  if (skill.installKind === "marketplace") {
    return `Please install the "${skill.name}" agent skills collection (${skill.repo}) for me.

If you are Claude Code:
1. Run: /plugin marketplace add ${gh}
2. Show me the available plugins from this marketplace and ask which I want, then install them.

If you are another agent that supports SKILL.md skills (Codex, Cursor, etc.):
1. Run: git clone ${skill.repo}
2. List the skill folders in the repo (each contains a SKILL.md) and ask me which I want.
3. Copy the chosen skill folders into your skills directory (e.g. ~/.claude/skills/ or your agent's equivalent).
4. Confirm the skills load (list your available skills afterwards).

More details: https://primorum.ai/skills/${skill.slug}`;
  }

  return `Please install skills from the "${skill.name}" collection (${skill.repo}) for me.

1. Run: git clone ${skill.repo}
2. List the skill folders in the repo (each contains a SKILL.md file) and ask me which I want — or install the ones most relevant to my current project.
3. Copy the chosen skill folders into your skills directory: ~/.claude/skills/ for Claude Code personal scope, .claude/skills/ for project scope, or your agent's equivalent SKILL.md directory.
4. Confirm the skills load (list your available skills afterwards).

More details: https://primorum.ai/skills/${skill.slug}`;
}
