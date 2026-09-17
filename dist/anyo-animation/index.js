/** Additive bridge for @blcklab/anyo-animation's Sekai64 adapter. No mixer ownership is duplicated here. */
export function registerPreparedClips(registrar, prepared) {
    return registrar.registerExternalClips(prepared.target.model, prepared.clips, { restorePose: prepared.restorePose });
}
//# sourceMappingURL=index.js.map