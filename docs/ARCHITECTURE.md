# Architecture

The package has one owner: animation-asset preparation.

- `anyo-player`: locomotion and physics facts.
- `anyo-animation`: semantic state machine, transitions, looping, speed, root-motion policy, events.
- `anyo-animation-clip`: file loading, VRMA validation, skeletal retargeting, target rest capture, secondary-node compatibility, and prepared clip identity.
- `sekai64`: clip classes, mixer, skeletal sampling, rendering.

There is no frame loop in this package and it never creates a persistent mixer. `registerPreparedClips()` is a thin structural bridge to Anyo Animation's external-clip registration.

## Reference implementation lessons retained

The working Avatar Viewer demonstrated that correct VRMA playback requires more than quaternion retarget math:

1. glTF authored quaternion rest rotations must be corrected before target capture;
2. target rest pose must be captured before visual normalization/fitting;
3. STEP key boundaries must be right-continuous;
4. sampled rotations must use the same XYZ pose semantics as the viewer;
5. VRM0 axis conversion, hips-height scaling, optional ancestor folding, and required-bone checks must remain deterministic.

`anyo-animation-clip` implements those behaviors without depending on or changing Viewer/Vue packages.
