# Graph Report - .  (2026-05-03)

## Corpus Check
- Corpus is ~41,123 words - fits in a single context window. You may not need a graph.

## Summary
- 36 nodes · 19 edges · 3 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `MiniGL` - 6 edges
2. `useTheme()` - 2 edges
3. `BentoCard()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (20 total, 3 thin omitted)

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MiniGL` connect `Community 0` to `Community 8`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._