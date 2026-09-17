import { Matrix4 } from '@blcklab/sekai64';
export type Quat = readonly [number, number, number, number];
export type Vec3 = readonly [number, number, number];
export declare const identity: Quat;
export declare function multiply(a: Quat, b: Quat): Quat;
export declare function inverse(q: Quat): Quat;
export declare function normalize(values: ArrayLike<number>, offset?: number): Quat;
export declare function matrix(values: readonly number[]): Matrix4;
export declare function position(m: Matrix4): Vec3;
export declare function transform(p: Vec3, m: Matrix4): Vec3;
/** Positive uniform scale only. Non-uniform scale/shear makes quaternion FK ambiguous. */
export declare function rotation(m: Matrix4): Quat;
//# sourceMappingURL=vrma-math.d.ts.map