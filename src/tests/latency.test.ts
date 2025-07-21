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
  { query: "Oscars 2024 winners" },
  { query: "AI news" },
  { query: "Nike" },
];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Latency (s)`, () => {
    testCases.forEach(({ query }) => {
      it(`should measure latency for '${query}'`, async () => {
        const start = Date.now();
        await search(query, 3);
        const end = Date.now();
        const latency = (end - start) / 1000;
        expect(typeof latency).toBe("number");
        expect(latency).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
