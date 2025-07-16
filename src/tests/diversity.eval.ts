import { evalite } from "evalite";
import {
  firecrawlSearch,
  exaSearch,
  braveSearch,
  linkupSearch,
} from "../lib/searchClients";

const vendors = {
  firecrawl: firecrawlSearch,
  exa: exaSearch,
  brave: braveSearch,
  linkup: linkupSearch,
};

const TEST_VENDORS = Object.keys(vendors);

const testData = [{ input: "best laptops 2024" }, { input: "AI news" }];

for (const vendor of TEST_VENDORS) {
  evalite(`${vendor} - Diversity`, {
    data: async () => testData,
    task: async (input) => vendors[vendor](input, 5),
    scorers: [
      {
        name: "Domain Diversity",
        scorer: ({ output }) => {
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
  });
}
