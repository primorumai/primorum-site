import individualSkills from "../../data/individual-skills.json";
import collections from "../../data/skills.json";

export function GET() {
  const byCollection = Object.fromEntries(collections.map((c) => [c.slug, c]));
  const payload = {
    name: "Primorum Individual Skills Index",
    description:
      "Flat index of individual agent skills (SKILL.md) across the collections tracked by the Primorum skills directory. Each entry has the skill description, source repo, raw SKILL.md URL, and detail page.",
    url: "https://primorum.ai/skills",
    generated: new Date().toISOString(),
    count: individualSkills.length,
    skills: individualSkills.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description,
      collection: s.collection,
      collectionName: byCollection[s.collection]?.name || s.collection,
      official: byCollection[s.collection]?.official || false,
      repo: `https://github.com/${s.repo}`,
      skillFolder: s.path.replace(/\/SKILL\.md$/, ""),
      rawSkillMd: s.rawUrl,
      github: s.githubUrl,
      detailPage: `https://primorum.ai/skills/s/${s.slug}`,
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
