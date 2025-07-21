import { describe, it, expect } from "vitest";
import {
  firecrawlSearch,
  exaSearch,
  braveSearch,
  linkupSearch,
} from "../lib/searchClients";

const trustedDomains = [
  "wikipedia.org",
  "nytimes.com",
  "bbc.com",
  "nature.com",
  "nasa.gov",
  "who.int",
  "python.org",
  "apple.com",
  "tesla.com",
  "jaguar.com",
];

const vendors = [
  { name: "firecrawl", search: firecrawlSearch },
  { name: "exa", search: exaSearch },
  { name: "brave", search: braveSearch },
  { name: "linkup", search: linkupSearch },
];

const testCases = [
  { query: "COVID-19 statistics" },
  { query: "Theory of relativity" },
  { query: "Tesla" },
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Link Quality`, () => {
    testCases.forEach(({ query }) => {
      it(`should return at least one trusted domain for '${query}'`, async () => {
        const results = await search(query, 5);
        const urls = results.map((r) => r.url);
        expect(
          trustedDomains.some((domain) => urls.join(" ").includes(domain))
        ).toBe(true);
      });
    });
  });
});
