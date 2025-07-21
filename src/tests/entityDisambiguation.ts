import { SearchFunction, SearchResult } from "../lib/types";

export function entityDisambiguationTest(searchImpl: SearchFunction) {
  const testData = [
    { input: { input: "Apple", expected: "apple.com" }, expected: "apple.com" },
    {
      input: { input: "Apple fruit", expected: "wikipedia.org/wiki/Apple" },
      expected: "wikipedia.org/wiki/Apple",
    },
  ];
  return {
    name: "Entity Disambiguation",
    data: async () => testData,
    task: async (input: { input: string; expected: string }) =>
      searchImpl(input.input, 3),
    scorers: [
      {
        name: "Correct Entity in Top 3",
        scorer: ({
          output,
          expected,
        }: {
          input: { input: string; expected: string };
          output: SearchResult[];
          expected?: string;
        }) => ({
          score: output.some((r) => expected && r.url.includes(expected))
            ? 1
            : 0,
          name: "Correct Entity in Top 3",
        }),
      },
    ],
  };
}
