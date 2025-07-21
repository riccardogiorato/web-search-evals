import { SearchFunction, SearchResult } from "../lib/types";

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

export function linkQualityTest(searchImpl: SearchFunction) {
  const testData = [
    { input: { input: "COVID-19 statistics" } },
    { input: { input: "Theory of relativity" } },
    { input: { input: "Tesla" } },
  ];
  return {
    name: "Link Quality",
    data: async () => testData,
    task: async (input: { input: string }) => searchImpl(input.input, 5),
    scorers: [
      {
        name: "Link Quality",
        scorer: ({
          output,
        }: {
          input: { input: string };
          output: SearchResult[];
        }) => {
          const trusted = output.filter((r) =>
            trustedDomains.some((domain) => r.url.includes(domain))
          );
          return {
            score: Math.min(trusted.length / output.length, 1),
            name: "Link Quality",
          };
        },
      },
    ],
  };
}
