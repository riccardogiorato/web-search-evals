import { SearchFunction, SearchResult } from "../lib/types";

export function intentUnderstandingTest(searchImpl: SearchFunction) {
  const testData = [
    { input: { input: "Apple" }, expected: "apple.com" },
    { input: { input: "Jaguar" }, expected: "jaguar.com" },
    { input: { input: "Mercury" }, expected: "nasa.gov" },
  ];
  return {
    name: "Query Intent Understanding",
    data: async () => testData,
    task: async (input: { input: string }) => searchImpl(input.input, 3),
    scorers: [
      {
        name: "Intent Understanding",
        scorer: ({
          output,
          expected,
        }: {
          input: { input: string };
          output: SearchResult[];
          expected?: string;
        }) => {
          // Score 1 if the top result matches the expected disambiguation
          return {
            score: output[0]?.url.includes(expected ?? "") ? 1 : 0,
            name: "Intent Understanding",
          };
        },
      },
    ],
  };
}
