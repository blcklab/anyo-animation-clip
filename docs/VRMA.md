# VRMA support

`0.1.x` focuses on skeletal VRMA for large-world/player use.

| Feature | Behavior |
| --- | --- |
| VRMC_vrm_animation 1.0 | Supported |
| VRM 1 humanoid target | Supported |
| VRM 0 humanoid target | Supported with X/Z conversion |
| Finger bones | Supported when mapped |
| leftEye / rightEye humanoid tracks | Supported as skeletal rotations |
| Different T-pose rest rotations | Retargeted |
| Hips translation | Proportion-scaled |
| Optional missing bone | Folded into descendants where possible |
| LINEAR / STEP | Supported |
| CUBICSPLINE | Rejected; bake first |
| Secondary/custom nodes | portable / compatible / same-avatar / error policies |
| Animated lookAt | Not implemented in v0.1; skip/error policy |
| Expressions/material animation | Not claimed complete in v0.1; skeletal playback remains usable with skip policy |
| FBX/BVH | Not runtime formats; convert offline to VRMA |

This is FK retargeting, not an IK/contact solver. Different limb proportions can still produce foot sliding or contact differences.


## Diagnostics

Since 0.1.1, expected omissions of source-avatar-specific secondary channels are aggregated into one diagnostic per VRMA animation. Under `portable` or `compatible`, this does not indicate a failure of the portable humanoid motion. `same-avatar` remains the explicit opt-in when matching custom hair/bust/accessory channels should be retained.
