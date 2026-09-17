## 0.1.1

- Aggregate expected non-portable secondary-node skips into one diagnostic per VRMA animation instead of emitting one warning per channel.
- Preserve all v0.1.0 retargeting and secondary-node policies unchanged; this is a diagnostics-only compatibility/hardening release.
- Add regression coverage proving aggregated diagnostics do not change the prepared portable humanoid tracks.

# Changelog

## 0.1.0

- Initial `@blcklab/anyo-animation-clip` package for the Anyo large-world/player stack.
- Added renderer-neutral package boundary plus explicit Sekai64 VRMA preparation adapter.
- Added VRM0/VRM1 humanoid retargeting, eyes/fingers, hips scaling, optional-bone folding, LINEAR/STEP, rest-pose capture/restore, secondary-node policies, and stable clip IDs.
- Added Sekai64 rotation-compatible final tracks so Anyo Animation can remain the sole mixer owner.
- Added additive structural bridge for Anyo Animation external-clip registration.
- Added CI and provenance npm publish workflows.
