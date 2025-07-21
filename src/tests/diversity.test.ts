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

const testCases = [{ query: "best laptops 2024" }, { query: "AI news" }];

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Diversity`, () => {
    testCases.forEach(({ query }) => {
      it(`should return results from multiple domains for "${query}"`, async () => {
        const results = await search(query, 5);
        const domains = Array.from(
          new Set(results.map((r) => getDomain(r.url)))
        ).filter(Boolean);

        console.log("query", query);
        console.log("domains", domains);

        expect(domains.length).toBeGreaterThan(1);
      });
    });
  });
});
