import { AnimationTrack } from '@blcklab/sekai64/animation';
/** Match glTF STEP's right-continuous key boundary semantics. */
export declare class StepAnimationTrack extends AnimationTrack {
    sample(time: number, target?: Float32Array<ArrayBuffer>): Float32Array;
}
/** Final playable track. Rotation samples are encoded for Sekai64's current Euler-backed node convention. */
export declare class CompatibleAnimationTrack extends StepAnimationTrack {
    sample(time: number, target?: Float32Array<ArrayBuffer>): Float32Array;
}
/** Encode the Viewer-correct XYZ pose into a quaternion understood by Sekai64 AnimationMixer. */
export declare function encodeQuaternionForSekaiMixer(values: Float32Array): void;
//# sourceMappingURL=track.d.ts.map