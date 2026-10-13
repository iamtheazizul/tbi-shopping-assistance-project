import fs from "node:fs";
import { planFromCSV } from "./storeRoute.js";

const result = planFromCSV(
  fs.readFileSync("store_layout.csv", "utf8"),
  fs.readFileSync("shopping_list.csv", "utf8"),
  { start: "Entrance (Grocery)", end: "Checkout" }
);

console.log("Graph:", result.graph.nodes.length, "nodes,", result.graph.edges.length, "edges");
console.log("Warnings:", result.warnings);

console.log("\nProduct → section matches:");
for (const m of result.matches) {
  const how = m.type === "exact" ? "" : `  [${m.type} match → "${m.matchedItem}"]`;
  const alt = m.alternatives.length ? `  (also in: ${m.alternatives.join(", ")})` : "";
  console.log(`  ${m.product.padEnd(15)} → ${m.section}${how}${alt}`);
}
console.log("\nNot found:", result.unmatched);

console.log("\nTotal distance:", result.totalDistance, "m\n");
result.steps.forEach((s, i) => console.log(`${i + 1}. ${s}`));
