import { SearchFunction, SearchResult } from "../lib/types";

export function citationQualityTest(searchImpl: SearchFunction) {
  const testData = [
    {
      input: { input: "Theory of relativity", expected: "wikipedia.org" },
      expected: "wikipedia.org",
    },
    {
      input: { input: "COVID-19 statistics", expected: "who.int" },
      expected: "who.int",
    },
    {
      input: { input: "Python programming language", expected: "python.org" },
      expected: "python.org",
    },
  ];
  return {
    name: "Citation Quality",
    data: async () => testData,
    task: async (input: { input: string; expected: string }) =>
      searchImpl(input.input, 5),
    scorers: [
      {
        name: "Citation Quality",
        scorer: ({
          output,
          expected,
        }: {
          input: { input: string; expected: string };
          output: SearchResult[];
          expected?: string;
        }) => {
          const found = output.some((r) => r.url.includes(expected ?? ""));
          return { score: found ? 1 : 0, name: "Citation Quality" };
        },
      },
    ],
  };
}
