import { describe, it, expect } from "vitest";
import {
  firecrawlSearch,
  exaSearch,
  braveSearch,
  linkupSearch,
} from "../lib/searchClients";

const vendors = [
  { name: "firecrawl", search: firecrawlSearch },
  { name: "exa", search: exaSearch },
  { name: "brave", search: braveSearch },
  { name: "linkup", search: linkupSearch },
];

const testCases = [
  { query: "mejores portátiles", contains: ["mejores", "mejor"] }, // Spanish for 'best laptops 2024'
  { query: "AI news", contains: ["AI", "AI news"] }, // English for 'AI news'
  { query: "AI 뉴스", contains: ["AI", "AI 뉴스"] }, // Korean for 'AI news'
  { query: "AI ニュース", contains: ["AI", "AI ニュース"] }, // Japanese for 'AI news'
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Multilingual/Non-English Support`, () => {
    testCases.forEach(({ query, contains }) => {
      it(`should return a majority of results containing any of [${contains.join(
        ", "
      )}] for "${query}"`, async () => {
        const results = await search(query, 5);

        console.log("results", results);

        const matchCount = results.filter((r) =>
          contains.some((word) =>
            r.title.toLowerCase().includes(word.toLowerCase())
          )
        ).length;
        expect(matchCount).toBeGreaterThanOrEqual(
          Math.ceil(results.length * 0.6)
        );
      });
    });
  });
});
