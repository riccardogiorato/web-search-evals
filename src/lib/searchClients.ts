import { SearchFunction } from "./types";
import {
  firecrawlClient,
  exaClient,
  braveSearchClient,
  linkupClient,
} from "./apiClients";

// Firecrawl search implementation
export const firecrawlSearch: SearchFunction = async (
  query,
  numResults = 5
) => {
  const response = await firecrawlClient.search(query, { limit: numResults });
  if (!response?.data || !Array.isArray(response.data)) return [];
  return response.data.map((item) => ({
    title: item.metadata?.title || "",
    url: item.url || "",
  }));
};

// Exa search implementation
export const exaSearch: SearchFunction = async (query, numResults = 5) => {
  const response = await exaClient.search(query, { numResults });
  if (!response?.results || !Array.isArray(response.results)) return [];
  return response.results.map((item) => ({
    title: item.title || "",
    url: item.url || "",
  }));
};

// Brave search implementation
export const braveSearch: SearchFunction = async (query, numResults = 5) => {
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
export const linkupSearch: SearchFunction = async (query, numResults = 5) => {
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
