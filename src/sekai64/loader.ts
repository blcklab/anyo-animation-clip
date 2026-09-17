import { AnimationClip } from '@blcklab/sekai64/animation'
import { createVrmAnimationImporter } from './vrma.js'
import type { PreparedSekai64ClipSet, PrepareSekai64ClipOptions, Sekai64AnimationClipLoaderOptions } from './types.js'

export function createSekai64AnimationClipLoader(options:Sekai64AnimationClipLoaderOptions = {}) {
  return {
    async prepare(request:PrepareSekai64ClipOptions):Promise<PreparedSekai64ClipSet> {
      const id=request.id.trim(); if(!id) throw new Error('Prepared clip id is required.')
      const controller=request.signal ? null : new AbortController(); const signal=request.signal ?? controller!.signal
      const importer=createVrmAnimationImporter({
        unsupportedFeatures: options.unsupportedFeatures ?? 'skip',
        secondaryNodes: request.secondaryNodes ?? options.secondaryNodes ?? 'compatible',
        ...(options.bakeRate !== undefined ? { bakeRate: options.bakeRate } : {}),
      })
      const imported=await importer.load({
        source:{url:String(request.src),format:'vrma'}, signal, targets:request.target.targets, vrm:request.target.vrm,
        ...(options.onDiagnostic ? {onDiagnostic:options.onDiagnostic}:{}),
      })
      const clips:AnimationClip[]=[]
      try {
        for(let index=0; index<imported.length; index++){
          const source=imported[index]!
          clips.push(new AnimationClip({id: imported.length===1?id:`${id}:${index}`, name:source.name, duration:source.duration, markers:source.markers, tracks:source.tracks}))
        }
      } finally { for(const clip of imported) clip.dispose() }
      if(!clips.length) throw new Error(`Animation asset "${id}" produced no clips.`)
      let disposed=false
      return Object.freeze({id,clips:Object.freeze(clips),target:request.target,restorePose:request.target.restorePose,dispose(){if(disposed)return;disposed=true;for(const clip of clips)clip.dispose()}})
    },
  }
}
