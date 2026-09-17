# @blcklab/anyo-animation-clip

Animation-asset preparation for the Anyo large-world/player stack.

`anyo-animation-clip` answers one question: **how does an external animation asset become a correct playable clip for this character?** It does not own player movement, state machines, or the render loop.

```text
@blcklab/anyo-player      movement / physics telemetry
          ↓
@blcklab/anyo-animation   states / transitions / root-motion policy
          ↓
@blcklab/anyo-animation-clip   load + retarget + prepare clips
          ↓
@blcklab/sekai64          mixer / sampling / rendering
```

The package is intentionally independent from `@blcklab/anyo-avatar`, `@blcklab/anyo-avatar-viewer`, and `@blcklab/anyo-avatar-vue`. Their proven VRM/VRMA behavior was used as a reference, but the working viewer stack does not need to change.

## Install

```bash
npm install @blcklab/anyo-animation-clip @blcklab/anyo-animation @blcklab/sekai64
```

## VRMA + Sekai64

Capture the authored target **before application display-normalization pivots are inserted**:

```ts
import { createSekai64AnimationClipLoader, createSekai64VrmTarget } from '@blcklab/anyo-animation-clip/sekai64'

const target = createSekai64VrmTarget(vrmModel)
const clips = createSekai64AnimationClipLoader({
  secondaryNodes: 'compatible',
  unsupportedFeatures: 'skip',
  onDiagnostic: console.warn,
})

const walk = await clips.prepare({
  id: 'walk',
  src: '/assets/animations/walk.vrma',
  target,
})
```

The target factory reapplies authored glTF quaternion rest rotations before capture. Final rotation tracks encode samples for Sekai64's current Euler-backed node convention, reproducing the pose correction used by the working Avatar Viewer without creating a second mixer owner.

## Connect to Anyo Animation

```ts
import { registerPreparedClips } from '@blcklab/anyo-animation-clip/anyo-animation'

const unregister = registerPreparedClips(animation.adapter, walk)

// Anyo Animation remains the state/playback owner.
animation.plugin.play('player-avatar', 'walk', {
  loop: 'repeat',
  speed: 1,
})

// teardown
unregister()
walk.dispose()
```

This expects the additive `registerExternalClips()` bridge available in the current Anyo Animation Sekai64 adapter used by World Loader testing.

## Secondary/custom bones

VRMA often carries avatar-specific tracks such as hair, bust, face-adjustment, accessories, or nameplates.

- `portable` — humanoid-only; unmapped channels are skipped.
- `compatible` — preserves a secondary channel only when unique name, authored rest transform, and hierarchy match.
- `same-avatar` — explicit opt-in for animations authored for the same character; preserves a unique same-name secondary node even when exporter hierarchy/rest metadata differs.
- `error` — reject any unmapped channel.

Use `same-avatar` deliberately. It is useful for character-specific animation assets, not general cross-avatar retargeting.

## v0.1 scope

Supported: VRMA 1.0 binary GLB, VRM0/VRM1 humanoid targets, fingers and eye bones, hips translation/proportion scaling, optional-bone folding, LINEAR/STEP, secondary-node policies, rest-pose restoration, stable action clip IDs, and Sekai64 rotation compatibility.

Expressions, animated look-at, and material/texture animation are not claimed as complete in v0.1. Use `unsupportedFeatures: 'skip'` to keep skeletal body motion while receiving diagnostics.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/VRMA.md](docs/VRMA.md).


## Secondary-node diagnostics

VRMA files may contain source-avatar-specific channels such as hair, bust, face adjustment, or accessory bones. Under `portable` / `compatible` policies, channels that are not safe to carry to the target are omitted. Since 0.1.1 these expected omissions are reported as one aggregate diagnostic per animation (with a few example node names) rather than one message per channel. The portable humanoid animation continues normally. Use `same-avatar` only when the animation and target intentionally share the same custom-node naming contract.
