import type { GltfModelNode } from '@blcklab/sekai64/gltf';
import type { AnimationClip } from '@blcklab/sekai64/animation';
import type { PreparedSekai64ClipSet } from '../sekai64/types.js';
export interface ExternalClipRegistrar {
    registerExternalClips(model: GltfModelNode, clips: readonly AnimationClip[], options?: {
        readonly restorePose?: () => void;
    }): () => void;
}
/** Additive bridge for @blcklab/anyo-animation's Sekai64 adapter. No mixer ownership is duplicated here. */
export declare function registerPreparedClips(registrar: ExternalClipRegistrar, prepared: PreparedSekai64ClipSet): () => void;
//# sourceMappingURL=index.d.ts.map