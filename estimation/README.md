# Capital House estimation

| Folder | Contents |
|---|---|
| `client/` | Client-facing documents, Version 2 dated 22 October 2026: the two-page Revised Estimate Summary and the detailed Scope of Work. Replace `[Vendor company name]` in both before sending. |
| `internal/` | Working files, not for the client: the hour calculation (Sections A, C, D with totals, phase split and internal notes) and the clauses for exclusions, lead times, hosting and assumptions. |
| `reference/` | The developer's updated estimation document that the revision was built from, plus a Markdown conversion of it. |
| `build/` | Script that generates the two client documents. |

## Regenerating the client documents

The script uses the `docx` npm package. From the repository root:

```bash
cd estimation/build
npm install docx
node build_docs.js
```

It writes both `.docx` files into `estimation/` (one level up from `build/`). Move them into `client/` after checking them. Edit the content arrays in the script, not the generated files, if the change should survive the next regeneration.

## Current numbers

| Line | Hours | Days |
|---|---|---|
| A. Scope from the initial estimate plus Notifications addition | 336 to 400 | 42 to 50 |
| C. Modules added since | 126 to 170 | 16 to 21 |
| Sum of lines | 462 to 570 | 58 to 71 |
| Consolidation for shared components | −22 to −50 | −3 to −6 |
| Quoted development total | 440 to 520 | 55 to 65 |
| Contingency, separate | 44 to 52 | 6 to 7 |

Per delivery phase: Phase 1 at 23 to 27 days, Phase 2 at 17 to 21, Phase 3 at 15 to 17.
