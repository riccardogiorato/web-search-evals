import { Reporter } from "vitest";

function parseVendorAndTestType(suiteName: string) {
  // Example: [firecrawl] Brand Homepage Retrieval
  const match = suiteName.match(/^\[(.+?)\] (.+)$/);
  if (!match) return { vendor: "unknown", testType: suiteName };
  return { vendor: match[1], testType: match[2] };
}

export default class VendorTableReporter implements Reporter {
  results: Record<string, Record<string, { passed: number; total: number }>> =
    {};

  async onTestCaseResult(testCase) {
    // testCase.suite is the parent suite
    let suite = testCase.suite;
    while (suite && suite.parent) suite = suite.parent; // get top-level suite
    const suiteName = suite?.name || "unknown";
    const { vendor, testType } = parseVendorAndTestType(suiteName);
    if (!this.results[vendor]) this.results[vendor] = {};
    if (!this.results[vendor][testType])
      this.results[vendor][testType] = { passed: 0, total: 0 };
    if (testCase.result?.state === "pass")
      this.results[vendor][testType].passed++;
    this.results[vendor][testType].total++;
  }

  onFinished() {
    const vendors = Object.keys(this.results);
    const testTypes = Array.from(
      new Set(Object.values(this.results).flatMap((v) => Object.keys(v)))
    );
    const table: Record<string, string>[] = [];
    for (const testType of testTypes) {
      const row: Record<string, string> = { Test: testType };
      for (const vendor of vendors) {
        const res = this.results[vendor][testType];
        if (!res) {
          row[vendor] = "-";
        } else {
          const pct = Math.round((res.passed / res.total) * 100);
          row[vendor] = `${pct}%`;
        }
      }
      table.push(row);
    }
    // Add overall row
    const overall: Record<string, string> = { Test: "Overall" };
    for (const vendor of vendors) {
      let sum = 0,
        count = 0;
      for (const testType of testTypes) {
        const res = this.results[vendor][testType];
        if (res) {
          sum += Math.round((res.passed / res.total) * 100);
          count++;
        }
      }
      overall[vendor] = count ? `${Math.round(sum / count)}%` : "-";
    }
    table.push(overall);
    // eslint-disable-next-line no-console
    console.table(table);
  }
}
