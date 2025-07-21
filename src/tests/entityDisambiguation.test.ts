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
  { query: "Apple", expected: "apple.com" },
  { query: "Apple fruit", expected: "wikipedia.org/wiki/Apple" },
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Entity Disambiguation`, () => {
    testCases.forEach(({ query, expected }) => {
      it(`should return a result containing '${expected}' for '${query}'`, async () => {
        const results = await search(query, 3);
        const urls = results.map((r) => r.url);
        expect(urls.join(" ")).toContain(expected);
      });
    });
  });
});
