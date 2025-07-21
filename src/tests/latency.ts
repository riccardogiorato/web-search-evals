import { SearchFunction } from "../lib/types";

export function latencyTest(searchImpl: SearchFunction) {
  const testData = [
    { input: { input: "Oscars 2024 winners" } },
    { input: { input: "AI news" } },
    { input: { input: "Nike" } },
  ];
  return {
    name: "Latency (s)",
    data: async () => testData,
    task: async (input: { input: string }) => {
      const start = Date.now();
      await searchImpl(input.input, 3);
      const end = Date.now();
      return (end - start) / 1000; // seconds
    },
    scorers: [
      {
        name: "Latency (s)",
        scorer: ({ output }: { input: { input: string }; output: number }) => ({
          score: output,
          name: "Latency (s)",
        }),
      },
    ],
  };
}
