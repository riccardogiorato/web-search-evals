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
  {
    query: "Who is the president of the United States?",
    expected: "United States",
  },
  { query: "Capital of France", expected: "Paris" },
  { query: "Largest planet in the solar system", expected: "Jupiter" },
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Factuality/Accuracy`, () => {
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
