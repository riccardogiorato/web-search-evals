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

const TEST_VENDORS = Object.keys(vendors); // or subset

const testData = [
  { input: "Nike", expected: "nike.com" },
  { input: "Apple", expected: "apple.com" },
  { input: "Tesla", expected: "tesla.com" },
];

for (const vendor of TEST_VENDORS) {
  evalite(`${vendor} - Brand Homepage Retrieval`, {
    data: async () => testData,
    task: async (input) => vendors[vendor](input, 3),
    scorers: [
      {
        name: "Homepage in Top 1",
        scorer: ({ output, expected }) => ({
          score: output[0]?.url.includes(expected) ? 1 : 0,
          name: "Homepage in Top 1",
        }),
      },
    ],
  });
}
