import { Reporter } from "vitest";

type TestMeta = {
  file: string;
  vendor: string;
  testType: string;
  testName: string;
  id: string;
  result?: { state: string };
};

export default class VendorTableReporter implements Reporter {
  allTests: Map<string, TestMeta> = new Map();

  onCollected(files: any) {
    function parseVendorAndTestType(suiteName: string) {
      const match = suiteName.match(/^\[(.+?)\] (.+)$/);
      if (!match) return { vendor: "unknown", testType: suiteName };
      return { vendor: match[1], testType: match[2] };
    }
    function walkSuite(this: VendorTableReporter, suite: any, file: string) {
      if (suite.tasks) {
        for (const task of suite.tasks) {
          if (task.type === "suite") {
            walkSuite.call(this, task, file);
          } else if (task.type === "test") {
            const parentSuite = suite;
            const { vendor, testType } = parseVendorAndTestType(
              parentSuite.name
            );
            this.allTests.set(task.id, {
              file,
              vendor,
              testType,
              testName: task.name,
              id: task.id,
            });
          }
        }
      }
    }
    for (const fileSuite of files) {
      walkSuite.call(this, fileSuite, fileSuite.name);
    }
  }

  onTaskUpdate(task: any) {
    if (task.type === "test" && this.allTests.has(task.id)) {
      this.allTests.get(task.id)!.result = task.result;
    }
  }

  onFinished() {
    // Group by testType (row) and vendor (column)
    const testData = Array.from(this.allTests.values());
    const vendors = Array.from(new Set(testData.map((t) => t.vendor)));
    let testTypes = Array.from(new Set(testData.map((t) => t.testType)));
    testTypes = testTypes.sort((a, b) => a.localeCompare(b));
    // Build table rows
    const table: Array<Record<string, string>> = [];
    for (const testType of testTypes) {
      const row: Record<string, string> = { Test: testType };
      for (const vendor of vendors) {
        const tests = testData.filter(
          (t) => t.vendor === vendor && t.testType === testType
        );
        if (tests.length === 0) {
          row[vendor] = "-";
        } else if (tests.length === 1) {
          const state = tests[0].result?.state;
          row[vendor] = state === "pass" ? "✓" : state === "fail" ? "✗" : "?";
        } else {
          // Multiple tests per cell: show percent passed
          const passed = tests.filter((t) => t.result?.state === "pass").length;
          row[vendor] = `${passed}/${tests.length} (${Math.round(
            (passed / tests.length) * 100
          )}%)`;
        }
      }
      table.push(row);
    }
    // Print table without index column
    const columns = ["Test", ...vendors];
    // eslint-disable-next-line no-console
    console.table(table, columns);
  }
}
