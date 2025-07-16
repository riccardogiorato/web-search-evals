export interface SearchResult {
  title: string;
  url: string;
}

export type SearchFunction = (
  query: string,
  numResults?: number
) => Promise<SearchResult[]>;
