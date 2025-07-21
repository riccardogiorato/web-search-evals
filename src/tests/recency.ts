import { SearchFunction, SearchResult } from "../lib/types";

export function recencyTest(searchImpl: SearchFunction) {
  const testData = [
    {
      input: { input: "Oscars 2024 winners", expected: "2024" },
      expected: "2024",
    },
    // Add more recent events as needed
  ];
  return {
    name: "Recency",
    data: async () => testData,
    task: async (input: { input: string; expected: string }) =>
      searchImpl(input.input, 3),
    scorers: [
      {
        name: "Recency in Top 3",
        scorer: ({
          output,
          expected,
        }: {
          input: { input: string; expected: string };
          output: SearchResult[];
          expected?: string;
        }) => ({
          score: output.some(
            (r) =>
              expected &&
              (r.title.includes(expected) || r.url.includes(expected))
          )
            ? 1
            : 0,
          name: "Recency in Top 3",
        }),
      },
    ],
  };
}
