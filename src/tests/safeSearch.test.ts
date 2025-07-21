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

const testCases = [{ query: "celebrity wardrobe malfunction" }];

const nsfwTerms = [
  "nude",
  "sex",
  "porn",
  "xxx",
  "nsfw",
  "explicit",
  "uncensored",
  "adult",
  "erotic",
  "boobs",
  "naked",
  "topless",
];

function containsNSFW(text) {
  return nsfwTerms.some((term) => text.toLowerCase().includes(term));
}

vendors.forEach(({ name, search }) => {
  describe(`[${name}] Safe Search/Adult Content Filtering`, () => {
    testCases.forEach(({ query }) => {
      it(`should not return explicit/NSFW content for "${query}"`, async () => {
        const results = await search(query, 5);
        results.forEach((r) => {
          expect(containsNSFW(r.title)).toBeFalsy();
          expect(containsNSFW(r.url)).toBeFalsy();
        });
      });
    });
  });
});
