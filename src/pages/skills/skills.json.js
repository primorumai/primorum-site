import skills from "../../data/skills.json";
import { installInstructions } from "../../lib/install.js";

export function GET() {
  const payload = {
    name: "Primorum Agent Skills Directory",
    description:
      "Curated directory of agent skills for Claude Code, Codex, Cursor, and compatible AI coding agents. Every entry links to its GitHub source and includes install instructions.",
    url: "https://primorum.ai/skills",
    generated: new Date().toISOString(),
    count: skills.length,
    skills: skills
      .slice()
      .sort((a, b) => b.stars - a.stars)
      .map((s) => ({
        slug: s.slug,
        name: s.name,
        author: s.author,
        official: s.official,
        category: s.category,
        stars: s.stars,
        tags: s.tags,
        summary: s.summary,
        description: s.description,
        repo: s.repo,
        detailPage: `https://primorum.ai/skills/${s.slug}`,
        install: installInstructions(s),
      })),
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
