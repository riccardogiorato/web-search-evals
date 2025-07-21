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
  { query: "Oscars 2024 winners", expected: "2024" },
  // Add more recent events as needed
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Recency`, () => {
    testCases.forEach(({ query, expected }) => {
      it(`should return a result containing '${expected}' for '${query}'`, async () => {
        const results = await search(query, 3);
        expect(results.map((r) => r.title + r.url).join(" ")).toContain(
          expected
        );
      });
    });
  });
});
