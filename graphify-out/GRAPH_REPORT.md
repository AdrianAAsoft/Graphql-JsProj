# Graph Report - .  (2026-07-08)

## Corpus Check
- Corpus is ~2,533 words - fits in a single context window. You may not need a graph.

## Summary
- 108 nodes · 123 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `GraphQL Type Definitions` - 5 edges
2. `Item Resolvers` - 5 edges
3. `User Resolvers` - 5 edges
4. `Resolvers` - 4 edges
5. `Merged Resolvers` - 4 edges
6. `Apollo Server Setup` - 4 edges
7. `GalaxyHUD()` - 4 edges
8. `scripts` - 3 edges
9. `repository` - 3 edges
10. `pool` - 3 edges

## Surprising Connections (you probably didn't know these)
- `GraphQL-JsProj README` --cites--> `Apollo Server`  [EXTRACTED]
  README.md → package.json
- `GraphQL-JsProj README` --cites--> `PostgreSQL`  [EXTRACTED]
  README.md → package.json
- `Apollo Server` --references--> `Server Entry Point`  [EXTRACTED]
  package.json → server/server.ts
- `GalaxyHUD()` --calls--> `useClock()`  [INFERRED]
  GalaxyHUD.jsx → useClock.js
- `GalaxyHUD()` --calls--> `useFlyTo()`  [INFERRED]
  GalaxyHUD.jsx → useFlyTo.js

## Hyperedges (group relationships)
- **GraphQL Data Resolution Flow** — schemas_typedefs, mutations_resolvers, userres_resolvers, itemres_resolvers [EXTRACTED 1.00]
- **Subscription and Event Publishing** — subres_subscriptions, pubsub_eventbus, itemres_resolvers, userres_resolvers [EXTRACTED 1.00]
- **Server Infrastructure and Services** — server_apolloserver, apollo_express_integration, websocket_subscriptions, postgres_service [INFERRED 0.85]

## Communities (14 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (21): author, bugs, url, description, homepage, keywords, license, main (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (13): Itemresolvers, pubsub, SubRes, Userresolvers, inDb(), pool, resolvers, app (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (7): COLORS, ICONS, ORBITS, GalaxyHUD(), useClock(), useFlyTo(), useItems()

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (13): Apollo Server Express Integration, Database Connection Pool, Item Resolvers, Merged Resolvers, PubSub Event Bus, GraphQL Schema Type Definitions, Apollo Server Setup, Subscription Resolvers (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (12): dependencies, @apollo/server, @as-integrations/express5, express, graphql, graphql-subscriptions, @graphql-tools/merge, @graphql-tools/schema (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.36
Nodes (8): GraphQL Type Definitions, Item GraphQL Type, Mutation Operations, Query Operations, Resolvers, Server Entry Point, Type Definitions, User GraphQL Type

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (4): Application Service, Docker Compose Configuration, Docker Compose Orchestration, PostgreSQL Database Service

## Knowledge Gaps
- **33 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.