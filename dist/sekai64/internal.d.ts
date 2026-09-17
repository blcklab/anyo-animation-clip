import type { Node } from '@blcklab/sekai64';
import { GltfLoader, type GltfAnimationFinalizeContext } from '@blcklab/sekai64/gltf';
import type { AnimationClip } from '@blcklab/sekai64/animation';
import type { SecondaryNodePolicy } from '../index.js';
import type { TargetNode, VrmTargetRig } from './types.js';
export type RecordValue = Record<string, any>;
export declare function object(value: unknown): RecordValue;
export interface AnimationImportContext {
    readonly source: {
        readonly url: string;
        readonly format: 'vrma';
    };
    readonly signal: AbortSignal;
    readonly targets: readonly TargetNode[];
    readonly vrm: VrmTargetRig;
    readonly onDiagnostic?: (message: string) => void;
}
export interface Sekai64AnimationImporter {
    readonly formats: readonly string[];
    load(context: AnimationImportContext): Promise<readonly AnimationClip[]>;
}
export declare function prepareSource(loader: GltfLoader, source: string, format: string): {
    url: URL;
    dispose: () => void;
};
/** Match glTF quaternion rest values to Sekai64's authored XYZ convention. */
export declare function setNodeQuaternion(node: Node, values: ArrayLike<number>): void;
export declare function correctGltfRestRotations(context: GltfAnimationFinalizeContext): void;
export type { TargetNode, VrmTargetRig, SecondaryNodePolicy };
//# sourceMappingURL=internal.d.ts.map