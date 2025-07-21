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
  { query: "Jaguar", expected: "jaguarusa.com" },
  { query: "Nasa sls", expected: "nasa.gov" },
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Query Intent Understanding`, () => {
    testCases.forEach(({ query, expected }) => {
      it(`should return a first result containing '${expected}' for '${query}'`, async () => {
        const results = await search(query, 3);
        expect(results[0]?.url).toContain(expected);
      });
    });
  });
});
