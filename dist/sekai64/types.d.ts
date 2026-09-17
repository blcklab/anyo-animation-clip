import type { Node } from '@blcklab/sekai64';
import type { AnimationClip } from '@blcklab/sekai64/animation';
import type { GltfModelNode } from '@blcklab/sekai64/gltf';
import type { SecondaryNodePolicy } from '../index.js';
export interface TargetNode {
    readonly id: string;
    readonly name: string;
    readonly restMatrix: readonly number[];
    readonly parentId: string | null;
    readonly morphNames: readonly string[];
}
export interface VrmTargetRig {
    readonly version: '0' | '1';
    readonly bones: Readonly<Record<string, string>>;
    readonly expressions: Readonly<Record<string, {
        readonly target: string;
        readonly supported: boolean;
    }>>;
}
export interface Sekai64VrmTarget {
    readonly model: GltfModelNode;
    readonly targets: readonly TargetNode[];
    readonly vrm: VrmTargetRig;
    readonly restorePose: () => void;
    readonly boneCount: number;
}
export interface Sekai64AnimationClipLoaderOptions {
    readonly unsupportedFeatures?: 'error' | 'skip';
    readonly secondaryNodes?: SecondaryNodePolicy;
    readonly bakeRate?: number;
    readonly onDiagnostic?: (message: string) => void;
}
export interface PrepareSekai64ClipOptions {
    readonly id: string;
    readonly src: string | URL;
    readonly format?: 'vrma';
    readonly target: Sekai64VrmTarget;
    readonly signal?: AbortSignal;
    readonly secondaryNodes?: SecondaryNodePolicy;
}
export interface PreparedSekai64ClipSet {
    readonly id: string;
    readonly clips: readonly AnimationClip[];
    readonly target: Sekai64VrmTarget;
    readonly restorePose: () => void;
    readonly dispose: () => void;
}
export interface RuntimeNodeIndex {
    readonly index: number;
    readonly node: Node;
}
//# sourceMappingURL=types.d.ts.map