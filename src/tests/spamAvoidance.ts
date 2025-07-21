import { SearchFunction, SearchResult } from "../lib/types";

export function spamAvoidanceTest(searchImpl: SearchFunction) {
  const spamDomains = ["spam.com", "ads.com", "clickbait.com"];
  const testData = [
    { input: { input: "buy cheap watches" } },
    { input: { input: "free iPhone" } },
  ];
  return {
    name: "Spam/Ad Avoidance",
    data: async () => testData,
    task: async (input: { input: string }) => searchImpl(input.input, 5),
    scorers: [
      {
        name: "Spam/Ad Avoidance",
        scorer: ({
          output,
        }: {
          input: { input: string };
          output: SearchResult[];
        }) => {
          const hasSpam = output.some((r) =>
            spamDomains.some((domain) => r.url.includes(domain))
          );
          return {
            score: hasSpam ? 0 : 1,
            name: "Spam/Ad Avoidance",
          };
        },
      },
    ],
  };
}
