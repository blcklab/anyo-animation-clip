# anyo-animation-clip repository memory

## 2026-09-23 — published baseline → frozen S24 reconciliation
- Supplied published baseline: `(no supplied published baseline)`.
- Frozen S24 implementation baseline: `0.1.1`.
- Runtime/source behavior follows the frozen S24 handoff; target-only useful docs/examples/tests and repository release identity were preserved where a target baseline was supplied.
- No post-S24 Web Surface/browser features were added.
- Development pins between BLCKLAB packages were aligned to the reconciled S24 versions; release packages remain peer-dependency based.
- `.internal/` is repository-only and must remain excluded from npm package contents.
- Validation status for this reconciliation is recorded in the final validation report; real GPU/browser/VRM checks remain a separate real-machine gate.
## 2026-09-23 — S24 published-baseline reconciliation validation
- No older published/source baseline was supplied for this package; frozen S24 `0.1.1` is carried as the first reconciliation baseline and no old→new patch is fabricated.
- Runtime `src/` remains byte-identical to frozen S24. Minimal repository tooling was added because the supplied clean package manifest referenced scripts that were absent from the lean handoff.
- Automated validation: typecheck/build PASS; 2/2 repository/package tests PASS; boundary/package verification PASS; final `npm pack --dry-run` PASS.
- Real VRMA/retargeting visual validation remains a real-machine gate.
