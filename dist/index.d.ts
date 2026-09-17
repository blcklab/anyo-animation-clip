export { ANYO_ANIMATION_CLIP_VERSION } from './version.js';
export type AnimationClipFormat = 'vrma';
export type SecondaryNodePolicy = 'portable' | 'compatible' | 'same-avatar' | 'error';
export interface AnimationClipSource {
    readonly url: string;
    readonly format: AnimationClipFormat;
    readonly id?: string;
}
export interface AnimationClipDiagnostic {
    readonly severity: 'info' | 'warning';
    readonly code: string;
    readonly message: string;
}
//# sourceMappingURL=index.d.ts.map