import { SearchFunction, SearchResult } from "../lib/types";

// Recency Test
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

// Diversity Test
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

// Spam/Ad Avoidance Test
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

// Entity Disambiguation Test
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

// Brand Homepage Retrieval Test
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

// Latency Test
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
