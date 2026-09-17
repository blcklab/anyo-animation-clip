import { type Sekai64AnimationImporter, type SecondaryNodePolicy } from './internal.js';
export interface VrmAnimationImporterOptions {
    /** Unsupported animated gaze/material features reject by default. Skipping emits diagnostics. */
    readonly unsupportedFeatures?: 'error' | 'skip';
    /** Policy for source-avatar-specific channels outside VRMC_vrm_animation mappings. */
    readonly secondaryNodes?: SecondaryNodePolicy;
    /** Bake rate when an absent optional ancestor must be folded into a descendant. */
    readonly bakeRate?: number;
}
export declare function createVrmAnimationImporter(options?: VrmAnimationImporterOptions): Sekai64AnimationImporter;
//# sourceMappingURL=vrma.d.ts.map