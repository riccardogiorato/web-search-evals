import { SearchFunction, SearchResult } from "../lib/types";

export function factualityTest(searchImpl: SearchFunction) {
  const testData = [
    {
      input: {
        input: "Who is the president of the United States?",
        expected: "Trump",
      },
      expected: "Trump",
    },
    {
      input: { input: "Capital of France", expected: "Paris" },
      expected: "Paris",
    },
    {
      input: {
        input: "Largest planet in the solar system",
        expected: "Jupiter",
      },
      expected: "Jupiter",
    },
  ];
  return {
    name: "Factuality/Accuracy",
    data: async () => testData,
    task: async (input: { input: string; expected: string }) =>
      searchImpl(input.input, 3),
    scorers: [
      {
        name: "Factuality/Accuracy",
        scorer: ({
          output,
          expected,
        }: {
          input: { input: string; expected: string };
          output: SearchResult[];
          expected?: string;
        }) => {
          const found = output.some(
            (r) =>
              r.title.toLowerCase().includes((expected ?? "").toLowerCase()) ||
              r.url.toLowerCase().includes((expected ?? "").toLowerCase())
          );
          return { score: found ? 1 : 0, name: "Factuality/Accuracy" };
        },
      },
    ],
  };
}
