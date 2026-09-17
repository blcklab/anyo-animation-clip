# World Loader integration

For local testing, place the built vendor package at:

```text
vendor/anyo-animation-clip/
```

and use:

```json
{
  "dependencies": {
    "@blcklab/anyo-animation": "file:./vendor/anyo-animation",
    "@blcklab/anyo-animation-clip": "file:./vendor/anyo-animation-clip",
    "@blcklab/sekai64": "file:./vendor/sekai64"
  }
}
```

At character load time, before World Loader inserts its visual normalization pivot:

```ts
const animationTarget = createSekai64VrmTarget(model)
```

For each manifest action:

```ts
const prepared = await clipLoader.prepare({
  id: actionName,
  src: action.src,
  target: animationTarget,
  secondaryNodes: action.retarget === 'same-avatar' ? 'same-avatar' : 'compatible',
})

const unregister = registerPreparedClips(animation.adapter, prepared)
```

`anyo-animation` remains the only playback/state owner. `anyo-animation-clip` does not install a frame loop or mixer.

Recommended manifest policy for the v2 catalog:

```json
{
  "version": 2,
  "clips": {
    "idle-default": { "src": "./idle.vrma", "format": "vrma", "secondaryNodes": "same-avatar" },
    "walk-default": { "src": "./walk.vrma", "format": "vrma", "secondaryNodes": "compatible" }
  },
  "actions": {
    "idle": "idle-default",
    "walk": "walk-default"
  }
}
```

Use `same-avatar` only when the animation was authored for the same character and you want named hair/bust/accessory channels preserved where nodes exist. With `compatible`, non-portable custom channels that cannot be proven safe are omitted while humanoid animation continues; 0.1.1 reports those omissions as one compact diagnostic rather than one warning per node.
