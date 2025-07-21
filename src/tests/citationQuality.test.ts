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
  { query: "Theory of relativity", expectedDomain: "wikipedia.org" },
  { query: "COVID-19 statistics", expectedDomain: "who.int" },
  { query: "Python programming language", expectedDomain: "python.org" },
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Citation Quality`, () => {
    testCases.forEach(({ query, expectedDomain }) => {
      it(`should return a result from ${expectedDomain} for "${query}"`, async () => {
        const results = await search(query, 5);
        const urls = results.map((r) => r.url);
        expect(urls.join(" ")).toContain(expectedDomain);
      });
    });
  });
});
