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
  { query: "Nike", expected: "nike.com" },
  { query: "Apple", expected: "apple.com" },
  { query: "Tesla", expected: "tesla.com" },
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Brand Homepage Retrieval`, () => {
    testCases.forEach(({ query, expected }) => {
      it(`should return homepage '${expected}' for '${query}'`, async () => {
        const results = await search(query, 3);
        expect(results[0]?.url).toContain(expected);
      });
    });
  });
});
