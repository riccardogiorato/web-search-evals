import { SearchFunction, SearchResult } from "../lib/types";

export function brandHomepageTest(searchImpl: SearchFunction) {
  const testData = [
    { input: { input: "Nike", expected: "nike.com" }, expected: "nike.com" },
    { input: { input: "Apple", expected: "apple.com" }, expected: "apple.com" },
    { input: { input: "Tesla", expected: "tesla.com" }, expected: "tesla.com" },
  ];
  return {
    name: "Brand Homepage Retrieval",
    data: async () => testData,
    task: async (input: { input: string; expected: string }) =>
      searchImpl(input.input, 3),
    scorers: [
      {
        name: "Homepage in Top 1",
        scorer: ({
          output,
          expected,
        }: {
          input: { input: string; expected: string };
          output: SearchResult[];
          expected?: string;
        }) => ({
          score: output[0]?.url.includes(expected ?? "") ? 1 : 0,
          name: "Homepage in Top 1",
        }),
      },
    ],
  };
}
