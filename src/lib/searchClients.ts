import { SearchFunction } from "./types";
import {
  firecrawlClient,
  exaClient,
  braveSearchClient,
  linkupClient,
} from "./apiClients";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

const storage = createStorage({
  driver: (fsDriver as any)({
    base: "./search-cache.local",
  }),
});

const CACHE_TTL_SECONDS = 86400; // 24 hours

function makeCacheKey(vendor: string, query: string, numResults: number = 5) {
  return `${vendor}:${query}:${numResults}`;
}

function withCache(vendor: string, fn: SearchFunction): SearchFunction {
  return async (query, numResults = 5) => {
    const key = makeCacheKey(vendor, query, numResults);
    const cached = await storage.getItem(key);
    if (cached) {
      return cached as Awaited<ReturnType<SearchFunction>>;
    }
    const result = await fn(query, numResults);
    await storage.setItem(key, result, { ttl: CACHE_TTL_SECONDS });
    return result;
  };
}

// Firecrawl search implementation
const firecrawlSearchImpl: SearchFunction = async (query, numResults = 5) => {
  const response = await firecrawlClient.search(query, { limit: numResults });
  if (!response?.data || !Array.isArray(response.data)) return [];
  return response.data.map((item) => ({
    title: item.metadata?.title || "",
    url: item.url || "",
  }));
};

// Exa search implementation
const exaSearchImpl: SearchFunction = async (query, numResults = 5) => {
  const response = await exaClient.search(query, { numResults });
  if (!response?.results || !Array.isArray(response.results)) return [];
  return response.results.map((item) => ({
    title: item.title || "",
    url: item.url || "",
  }));
};

// Brave search implementation
const braveSearchImpl: SearchFunction = async (query, numResults = 5) => {
  const response = await braveSearchClient.webSearch(query, {
    count: numResults,
  });
  const results = response.web?.results;
  if (!results || !Array.isArray(results)) return [];
  return results.slice(0, numResults).map((item) => ({
    title: item.title || "",
    url: item.url || "",
  }));
};

// Linkup search implementation
const linkupSearchImpl: SearchFunction = async (query, numResults = 5) => {
  const response = await linkupClient.search({
    query,
    depth: "standard",
    outputType: "searchResults",
  });
  if (!response?.results || !Array.isArray(response.results)) return [];
  // Only take up to numResults
  return response.results.slice(0, numResults).map((item) => ({
    title: item.name || "",
    url: item.url || "",
  }));
};

export const firecrawlSearch = withCache("firecrawl", firecrawlSearchImpl);
export const exaSearch = withCache("exa", exaSearchImpl);
export const braveSearch = withCache("brave", braveSearchImpl);
export const linkupSearch = withCache("linkup", linkupSearchImpl);
