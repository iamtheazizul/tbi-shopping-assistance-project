// storeRoute.js — parse a store layout table, build a graph, plan the shortest shopping route.
// Pure ES module, no dependencies: works in Node and in a React app.

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

/* ---------------------------------------------------------------- CSV */
// Small CSV parser that supports quoted fields (needed for "Aisle 2, Produce, Entrance").
export function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}

/** Turn CSV text into [{section, nextTo, notes}] using the header row. */
export function parseLayoutRows(csvText) {
  const [header, ...body] = parseCSV(csvText);
  const col = (name) => header.findIndex((h) => norm(h) === name);
  const iName = col("section name"), iNext = col("next to"), iNotes = col("notes");
  const iItems = col("items") >= 0 ? col("items") : col("products");
  if (iName < 0 || iNext < 0) throw new Error('Layout needs "Section name" and "Next to" columns');
  return body
    .map((r) => ({
      section: (r[iName] ?? "").trim(),
      nextTo: (r[iNext] ?? "").trim(),
      notes: iNotes >= 0 ? (r[iNotes] ?? "").trim() : "",
      items: iItems >= 0 ? (r[iItems] ?? "").split(/[,;]/).map((x) => x.trim()).filter(Boolean) : [],
    }))
    .filter((r) => r.section);
}

/* -------------------------------------------------------------- Graph */
// "Aisle 1 (10m)" -> { name: "Aisle 1", weight: 10 }
function parseNeighbor(token) {
  const m = token.match(/^(.*?)\s*\(\s*(\d+(?:\.\d+)?)\s*m?\s*\)\s*$/i);
  return m ? { name: m[1].trim(), weight: parseFloat(m[2]) } : { name: token.trim(), weight: null };
}

/**
 * Build an undirected weighted graph.
 * - Every row = a node. "Next to" entries = edges (made symmetric automatically).
 * - Optional "(10m)" after a neighbour sets the distance; otherwise defaultDistance is used.
 * - Loose references like "Entrance" are resolved to the matching section
 *   (exact name > unique prefix > the candidate that also points back at this node).
 */
export function buildGraph(rows, { defaultDistance = 10 } = {}) {
  const warnings = [];
  const nodes = rows.map((r) => ({ id: r.section, notes: r.notes, items: r.items ?? [] }));
  const byKey = new Map(nodes.map((n) => [norm(n.id), n.id]));
  const raw = new Map(rows.map((r) => [r.section, r.nextTo.split(",").map(parseNeighbor).filter((n) => n.name)]));

  const resolve = (ref, from) => {
    const key = norm(ref);
    if (byKey.has(key)) return byKey.get(key);
    const cands = nodes.filter((n) => norm(n.id).startsWith(key)).map((n) => n.id);
    if (cands.length === 1) return cands[0];
    if (cands.length > 1) {
      const back = cands.filter((c) =>
        (raw.get(c) ?? []).some((n) => norm(n.name) === norm(from) || norm(from).startsWith(norm(n.name)))
      );
      if (back.length === 1) return back[0];
      warnings.push(`"${from}" → "${ref}" is ambiguous (${cands.join(" | ")}); edge skipped`);
      return null;
    }
    warnings.push(`"${from}" → "${ref}" doesn't match any section; edge skipped`);
    return null;
  };

  const edgeMap = new Map(); // "a||b" (sorted) -> {a, b, weight, explicit}
  for (const [from, neighbors] of raw) {
    for (const { name, weight } of neighbors) {
      const to = resolve(name, from);
      if (!to || to === from) continue;
      const [a, b] = [from, to].sort();
      const k = `${a}||${b}`;
      const prev = edgeMap.get(k);
      const w = weight ?? defaultDistance;
      if (!prev) edgeMap.set(k, { a, b, weight: w, explicit: weight != null });
      else if (weight != null && (!prev.explicit || weight < prev.weight)) {
        prev.weight = weight; prev.explicit = true;
      }
    }
  }

  const edges = [...edgeMap.values()].map(({ a, b, weight }) => ({ source: a, target: b, weight }));
  const adj = new Map(nodes.map((n) => [n.id, []]));
  for (const e of edges) {
    adj.get(e.source).push({ to: e.target, w: e.weight });
    adj.get(e.target).push({ to: e.source, w: e.weight });
  }
  return { nodes, edges, adj, byKey, warnings };
}

/** Case-insensitive section lookup against a built graph (exact, then unique prefix). */
export function findSection(graph, name) {
  const key = norm(name);
  if (graph.byKey.has(key)) return graph.byKey.get(key);
  const c = graph.nodes.filter((n) => norm(n.id).startsWith(key));
  return c.length === 1 ? c[0].id : null;
}

/* ----------------------------------------------------------- Shortest */
export function dijkstra(graph, source) {
  const dist = new Map(graph.nodes.map((n) => [n.id, Infinity]));
  const prev = new Map();
  const todo = new Set(graph.nodes.map((n) => n.id));
  dist.set(source, 0);
  while (todo.size) {
    let u = null;
    for (const id of todo) if (u === null || dist.get(id) < dist.get(u)) u = id;
    if (dist.get(u) === Infinity) break;
    todo.delete(u);
    for (const { to, w } of graph.adj.get(u)) {
      const alt = dist.get(u) + w;
      if (alt < dist.get(to)) { dist.set(to, alt); prev.set(to, u); }
    }
  }
  return { dist, prev };
}

const pathTo = (prev, target) => {
  const p = [target];
  while (prev.has(p[0])) p.unshift(prev.get(p[0]));
  return p;
};

/* ------------------------------------------------------ Item matching */
// Lightweight singularizer so "tomatoes" = "tomato", "batteries" = "battery", "eggs" = "egg".
const singular = (w) =>
  w.length < 4 ? w : w.replace(/ies$/, "y").replace(/(o|ch|sh|ss|x)es$/, "$1").replace(/(?<![su])s$/, "");
const normItem = (s) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).map(singular).join(" ");

function lev(a, b) {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

export function buildItemIndex(graph) {
  const entries = [];
  for (const n of graph.nodes)
    for (const item of n.items ?? []) {
      const key = normItem(item);
      if (key) entries.push({ section: n.id, item, key, words: key.split(" ") });
    }
  return entries;
}

/**
 * Find which store item(s) a typed product refers to.
 * Order: exact (ignoring case/plurals) > partial ("cherry tomato" ~ "Tomato") > fuzzy typo (1-2 edits).
 * Returns { type, candidates:[{section,item}], suggestions:[] }.
 */
export function matchProduct(entries, name) {
  const q = normItem(name);
  if (!q) return { type: null, candidates: [], suggestions: [] };
  const qw = q.split(" ");

  let c = entries.filter((e) => e.key === q);
  if (c.length) return { type: "exact", candidates: c, suggestions: [] };

  c = entries.filter((e) => e.words.every((w) => qw.includes(w)) || qw.every((w) => e.words.includes(w)));
  if (c.length) {
    const best = Math.min(...c.map((e) => Math.abs(e.words.length - qw.length)));
    return { type: "partial", candidates: c.filter((e) => Math.abs(e.words.length - qw.length) === best), suggestions: [] };
  }

  const scored = entries.map((e) => ({ e, d: lev(e.key, q) })).sort((a, b) => a.d - b.d);
  const limit = q.length >= 8 ? 2 : q.length >= 4 ? 1 : 0;
  const close = scored.filter((x) => x.d <= limit);
  if (close.length) {
    const m = close[0].d;
    return { type: "fuzzy", candidates: close.filter((x) => x.d === m).map((x) => x.e), suggestions: [] };
  }
  const suggestions = [...new Set(scored.filter((x) => x.d <= Math.max(3, Math.ceil(q.length / 2))).slice(0, 3).map((x) => x.e.item))];
  return { type: null, candidates: [], suggestions };
}

/**
 * Shopping list text -> [{product, section?}].
 * - Plain list: one product per line (commas also split products).
 * - With a header row "Product,Section", the Section column is used as an explicit override.
 */
export function parseShoppingList(text) {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const head = rows[0].map(norm);
  if (["product", "products", "item", "items"].includes(head[0])) {
    const si = head.indexOf("section");
    return rows.slice(1)
      .map((r) => ({ product: (r[0] ?? "").trim(), section: si >= 0 && (r[si] ?? "").trim() ? r[si].trim() : undefined }))
      .filter((p) => p.product);
  }
  return rows.flat().map((x) => ({ product: x.trim() })).filter((p) => p.product);
}

/* ------------------------------------------------------------ Planner */
/**
 * Plan the shortest walk: start → visit every needed section → end.
 * Exact (Held-Karp DP) for up to 12 distinct sections, nearest-neighbour + 2-opt beyond that.
 *
 * @param graph        result of buildGraph()
 * @param shoppingList [{product, section}]
 * @param opts         { start?: string, end?: string }  start defaults to the first "Entrance*"
 *                     section; end defaults to "Checkout" if it exists.
 */
export function planRoute(graph, shoppingList, opts = {}) {
  const warnings = [...graph.warnings];

  const start =
    (opts.start && findSection(graph, opts.start)) ||
    graph.nodes.find((n) => norm(n.id).startsWith("entrance"))?.id;
  if (!start) throw new Error("No start section found (pass opts.start)");
  const end = findSection(graph, opts.end ?? "Checkout") ?? null;

  // Resolve each product to a section using the layout's Items column (or an explicit Section).
  const index = buildItemIndex(graph);
  const dStart = dijkstra(graph, start).dist;
  const unmatched = [], matches = [], resolved = [];
  for (const { product, section } of shoppingList) {
    if (section) {
      const id = findSection(graph, section);
      if (!id) { unmatched.push({ product, section, reason: "Section not in store layout", suggestions: [] }); continue; }
      resolved.push({ product, type: "explicit", candidates: [{ section: id, item: null }] });
      continue;
    }
    const m = matchProduct(index, product);
    const cands = m.candidates.filter((c) => dStart.get(c.section) !== Infinity);
    if (!cands.length) {
      unmatched.push({
        product, section: null,
        reason: m.candidates.length ? "Its section isn't connected to the start" : "Not found in the store layout",
        suggestions: m.suggestions,
      });
      continue;
    }
    resolved.push({ product, type: m.type, candidates: cands });
  }

  // Items sold in several sections: prefer a section we're already visiting, otherwise the nearest one.
  const uniq = (r) => [...new Set(r.candidates.map((c) => c.section))];
  const chosen = new Set(resolved.filter((r) => uniq(r).length === 1).map((r) => uniq(r)[0]));
  const productsBySection = new Map();
  for (const r of resolved) {
    const secs = uniq(r);
    let pick = secs[0];
    if (secs.length > 1) {
      const already = secs.filter((x) => chosen.has(x));
      pick = (already.length ? already : secs).reduce((x, y) => (dStart.get(y) < dStart.get(x) ? y : x));
      chosen.add(pick);
    }
    if (!productsBySection.has(pick)) productsBySection.set(pick, []);
    productsBySection.get(pick).push(r.product);
    matches.push({
      product: r.product, section: pick, type: r.type,
      matchedItem: r.candidates.find((c) => c.section === pick)?.item ?? null,
      alternatives: secs.filter((x) => x !== pick),
    });
  }

  // Shortest-path tables from every point that matters.
  const targets = [...productsBySection.keys()].filter((s) => s !== start && s !== end);
  const keyPoints = [...new Set([start, ...targets, ...(end ? [end] : [])])];
  const sp = new Map(keyPoints.map((k) => [k, dijkstra(graph, k)]));
  const D = (a, b) => sp.get(a).dist.get(b);

  const unreachable = targets.filter((t) => D(start, t) === Infinity);
  for (const t of unreachable) {
    for (const p of productsBySection.get(t)) unmatched.push({ product: p, section: t, reason: "Not connected to the start" });
    productsBySection.delete(t);
  }
  const stops = targets.filter((t) => !unreachable.includes(t));

  // Order the stops.
  const order = stops.length <= 12 ? heldKarp(start, stops, end, D) : heuristic(start, stops, end, D);
  const sequence = [start, ...order, ...(end ? [end] : [])];

  // Expand to the full walking path + per-stop details.
  const path = [start];
  const route = [];
  let total = 0;
  for (let i = 0; i < sequence.length; i++) {
    const section = sequence[i];
    let leg = [section], legDist = 0;
    if (i > 0) {
      leg = pathTo(sp.get(sequence[i - 1]).prev, section);
      legDist = D(sequence[i - 1], section);
      path.push(...leg.slice(1));
      total += legDist;
    }
    route.push({
      order: i,
      section,
      products: productsBySection.get(section) ?? [],
      distanceFromPrevious: legDist,
      walkingPath: leg,
      role: i === 0 ? "start" : i === sequence.length - 1 && end ? "end" : "stop",
    });
  }

  const steps = route.map((r) =>
    r.role === "start"
      ? `Start at ${r.section}${r.products.length ? ` — pick up ${r.products.join(", ")}` : ""}`
      : `Walk ${r.walkingPath.join(" → ")} (${r.distanceFromPrevious}m)${r.products.length ? ` — pick up ${r.products.join(", ")}` : ""}`
  );

  return { start, end, totalDistance: total, route, path, steps, matches, unmatched, warnings };
}

function heldKarp(start, stops, end, D) {
  const n = stops.length;
  if (n === 0) return [];
  const FULL = 1 << n;
  const dp = Array.from({ length: FULL }, () => new Array(n).fill(Infinity));
  const parent = Array.from({ length: FULL }, () => new Array(n).fill(-1));
  for (let i = 0; i < n; i++) dp[1 << i][i] = D(start, stops[i]);
  for (let mask = 1; mask < FULL; mask++)
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last)) || dp[mask][last] === Infinity) continue;
      for (let nxt = 0; nxt < n; nxt++) {
        if (mask & (1 << nxt)) continue;
        const nm = mask | (1 << nxt);
        const c = dp[mask][last] + D(stops[last], stops[nxt]);
        if (c < dp[nm][nxt]) { dp[nm][nxt] = c; parent[nm][nxt] = last; }
      }
    }
  let best = Infinity, bestLast = 0;
  for (let i = 0; i < n; i++) {
    const c = dp[FULL - 1][i] + (end ? D(stops[i], end) : 0);
    if (c < best) { best = c; bestLast = i; }
  }
  const out = [];
  let mask = FULL - 1, cur = bestLast;
  while (cur !== -1) { out.unshift(stops[cur]); const p = parent[mask][cur]; mask ^= 1 << cur; cur = p; }
  return out;
}

function heuristic(start, stops, end, D) {
  const left = new Set(stops), order = [];
  let cur = start;
  while (left.size) {
    let best = null;
    for (const s of left) if (best === null || D(cur, s) < D(cur, best)) best = s;
    order.push(best); left.delete(best); cur = best;
  }
  const len = (o) => [start, ...o, ...(end ? [end] : [])].reduce((a, s, i, arr) => (i ? a + D(arr[i - 1], s) : 0), 0);
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < order.length - 1; i++)
      for (let j = i + 1; j < order.length; j++) {
        const cand = [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1)];
        if (len(cand) < len(order)) { order.splice(0, order.length, ...cand); improved = true; }
      }
  }
  return order;
}

/* ------------------------------------------------------ One-call API */
export function planFromCSV(layoutCsv, listCsv, opts = {}) {
  const graph = buildGraph(parseLayoutRows(layoutCsv), opts);
  const shoppingList = parseShoppingList(listCsv);
  return { graph: { nodes: graph.nodes, edges: graph.edges }, ...planRoute(graph, shoppingList, opts) };
}
