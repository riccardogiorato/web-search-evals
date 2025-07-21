import { describe, it, expect, afterAll } from "vitest";
import {
  firecrawlSearch,
  exaSearch,
  braveSearch,
  linkupSearch,
} from "./lib/searchClients";
import {
  recencyTest,
  diversityTest,
  spamAvoidanceTest,
  entityDisambiguationTest,
  brandHomepageTest,
  latencyTest,
} from "./tests/sharedTestTypes";

const vendors = [
  { name: "firecrawl", search: firecrawlSearch },
  { name: "exa", search: exaSearch },
  { name: "brave", search: braveSearch },
  { name: "linkup", search: linkupSearch },
];

const tests = [
  {
    name: "Recency",
    factory: recencyTest,
    needsExpected: true,
    isLatency: false,
  },
  {
    name: "Diversity",
    factory: diversityTest,
    needsExpected: false,
    isLatency: false,
  },
  {
    name: "Spam/Ad Avoidance",
    factory: spamAvoidanceTest,
    needsExpected: false,
    isLatency: false,
  },
  {
    name: "Entity Disambiguation",
    factory: entityDisambiguationTest,
    needsExpected: true,
    isLatency: false,
  },
  {
    name: "Brand Homepage Retrieval",
    factory: brandHomepageTest,
    needsExpected: true,
    isLatency: false,
  },
  {
    name: "Latency (s)",
    factory: latencyTest,
    needsExpected: false,
    isLatency: true,
  },
];

const results: Record<string, Record<string, any>> = {};

vendors.forEach((vendor) => {
  describe(`${vendor.name}`, () => {
    results[vendor.name] = { Vendor: vendor.name };
    tests.forEach((test) => {
      it(`${test.name}`, async () => {
        const testDef = test.factory(vendor.search);
        const scores: number[] = [];
        const data = await testDef.data();
        for (const inputObj of data) {
          let inputWithExpected;
          let output;
          if (test.isLatency) {
            // Latency test expects { input: string; expected: string }
            inputWithExpected = { ...inputObj.input, expected: "" };
            output = await testDef.task(inputWithExpected);
            for (const scorer of testDef.scorers) {
              const res = await scorer.scorer({
                input: inputWithExpected,
                output,
              });
              scores.push(res.score);
            }
          } else {
            if (test.needsExpected) {
              inputWithExpected = inputObj.input;
            } else {
              inputWithExpected = { ...inputObj.input, expected: "" };
            }
            output = await testDef.task(inputWithExpected);
            for (const scorer of testDef.scorers) {
              const res = await scorer.scorer({
                input: inputWithExpected,
                output,
                expected: inputWithExpected.expected,
              });
              scores.push(res.score);
            }
          }
        }
        let resultValue;
        if (test.isLatency) {
          // Show average latency in seconds, rounded to two decimals
          const avg = scores.length
            ? scores.reduce((a, b) => a + b, 0) / scores.length
            : 0;
          resultValue = `${avg.toFixed(2)}s`;
        } else {
          // Format as percentage string
          const avg = scores.length
            ? scores.reduce((a, b) => a + b, 0) / scores.length
            : 0;
          resultValue = `${Math.round(avg * 100)}%`;
        }
        results[vendor.name][test.name] = resultValue;
        expect(scores.length).toBeGreaterThan(0); // Dummy assertion for Vitest
      });
    });
  });
});

afterAll(() => {
  // Print table with Vendor as first column
  const table = Object.values(results).map((row) => {
    const out: Record<string, string> = { Vendor: row.Vendor as string };
    for (const test of tests) {
      out[test.name] = row[test.name] as string;
    }
    return out;
  });
  // eslint-disable-next-line no-console
  console.table(table);
});
