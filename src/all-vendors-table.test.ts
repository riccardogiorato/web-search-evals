import { describe, it, expect, afterAll } from "vitest";
import {
  firecrawlSearch,
  exaSearch,
  braveSearch,
  linkupSearch,
  firecrawlSearchImpl,
  exaSearchImpl,
  braveSearchImpl,
  linkupSearchImpl,
} from "./lib/searchClients";
import { brandHomepageTest } from "./tests/brandHomepage";
import { diversityTest } from "./tests/diversity";
import { entityDisambiguationTest } from "./tests/entityDisambiguation";
import { latencyTest } from "./tests/latency";
import { recencyTest } from "./tests/recency";
import { spamAvoidanceTest } from "./tests/spamAvoidance";
import { factualityTest } from "./tests/factuality";
import { citationQualityTest } from "./tests/citationQuality";
import { intentUnderstandingTest } from "./tests/intentUnderstanding";
import { linkQualityTest } from "./tests/linkQuality";

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
    name: "Factuality/Accuracy",
    factory: factualityTest,
    needsExpected: true,
    isLatency: false,
  },
  {
    name: "Citation Quality",
    factory: citationQualityTest,
    needsExpected: true,
    isLatency: false,
  },
  {
    name: "Query Intent Understanding",
    factory: intentUnderstandingTest,
    needsExpected: true,
    isLatency: false,
  },
  {
    name: "Link Quality",
    factory: linkQualityTest,
    needsExpected: false,
    isLatency: false,
  },
  {
    name: "Latency (s)",
    factory: (vendor) => {
      // Use the non-cached implementation for latency
      if (vendor === firecrawlSearch) return latencyTest(firecrawlSearchImpl);
      if (vendor === exaSearch) return latencyTest(exaSearchImpl);
      if (vendor === braveSearch) return latencyTest(braveSearchImpl);
      if (vendor === linkupSearch) return latencyTest(linkupSearchImpl);
      return latencyTest(vendor);
    },
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
  // Print table with Test as first column, then vendors as columns
  const testNames = tests.map((t) => t.name);
  const vendorNames = vendors.map((v) => v.name);
  const table = testNames.map((testName) => {
    const row: Record<string, string> = { Test: testName };
    for (const vendor of vendorNames) {
      row[vendor] = results[vendor]?.[testName] ?? "-";
    }
    return row;
  });

  // Add overall row (average percentage per vendor, excluding non-percentage tests)
  const percentageTestNames = tests
    .filter((t) => !t.isLatency)
    .map((t) => t.name);
  const overallRow: Record<string, string> = { Test: "Overall" };
  for (const vendor of vendorNames) {
    let sum = 0;
    let count = 0;
    for (const testName of percentageTestNames) {
      const value = results[vendor]?.[testName];
      if (typeof value === "string" && value.endsWith("%")) {
        const num = parseFloat(value.replace("%", ""));
        if (!isNaN(num)) {
          sum += num;
          count++;
        }
      }
    }
    overallRow[vendor] = count > 0 ? `${Math.round(sum / count)}%` : "-";
  }
  table.push(overallRow);

  // eslint-disable-next-line no-console
  console.table(table);
});
