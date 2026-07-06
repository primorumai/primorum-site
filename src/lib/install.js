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
