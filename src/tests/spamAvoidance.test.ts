import { describe, it, expect } from "vitest";
import {
  firecrawlSearch,
  exaSearch,
  braveSearch,
  linkupSearch,
} from "../lib/searchClients";

const spamDomains = ["spam.com", "ads.com", "clickbait.com"];

const vendors = [
  { name: "firecrawl", search: firecrawlSearch },
  { name: "exa", search: exaSearch },
  { name: "brave", search: braveSearch },
  { name: "linkup", search: linkupSearch },
];

const testCases = [{ query: "buy cheap watches" }, { query: "free iPhone" }];

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Spam/Ad Avoidance`, () => {
    testCases.forEach(({ query }) => {
      it(`should not return spam/ad domains for '${query}'`, async () => {
        const results = await search(query, 5);
        const urls = results.map((r) => r.url);
        const hasSpam = urls.some((url) =>
          spamDomains.some((domain) => url.includes(domain))
        );
        expect(hasSpam).toBe(false);
      });
    });
  });
});
