import { SearchFunction, SearchResult } from "../lib/types";

export function diversityTest(searchImpl: SearchFunction) {
  const testData = [
    { input: { input: "best laptops 2024" } },
    { input: { input: "AI news" } },
  ];
  return {
    name: "Diversity",
    data: async () => testData,
    task: async (input: { input: string }) => searchImpl(input.input, 5),
    scorers: [
      {
        name: "Domain Diversity",
        scorer: ({
          output,
        }: {
          input: { input: string };
          output: SearchResult[];
        }) => {
          const domains = new Set(
            output.map((r) => {
              try {
                return new URL(r.url).hostname.replace(/^www\./, "");
              } catch {
                return "";
              }
            })
          );
          return {
            score: Math.min(domains.size / output.length, 1),
            name: "Domain Diversity",
          };
        },
      },
    ],
  };
}
