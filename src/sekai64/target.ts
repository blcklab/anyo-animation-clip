import { Mesh, type Node } from '@blcklab/sekai64'
import { SkinnedGeometry } from '@blcklab/sekai64/animation'
import type { GltfModelNode } from '@blcklab/sekai64/gltf'
import type { Sekai64VrmTarget, TargetNode } from './types.js'
import { setNodeQuaternion } from './internal.js'

type R=Record<string,any>
const object=(v:unknown):R=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as R:{}
const legacyBone=(name:string)=>name.replace(/ThumbProximal$/,'ThumbMetacarpal').replace(/ThumbIntermediate$/,'ThumbProximal')
function nodes(root:GltfModelNode){ const list:Node[]=[]; root.traverse(n=>{if(n!==root)list.push(n)}); return list }
function findRuntimeNode(root:GltfModelNode,index:number):Node|undefined {
  const doc=root.asset.document; const authored=String(doc.nodes?.[index]?.name??''); const suffix=`:node-${index}`; let exact:Node|undefined; const named:Node[]=[]
  root.traverse(n=>{ if(n===root)return; const id=String(n.id??''); if(!exact&&(id===`node-${index}`||id.endsWith(suffix))) exact=n; if(authored&&n.name===authored) named.push(n) })
  if(exact)return exact; if(named.length===1)return named[0]; return undefined
}
function findNode(root:GltfModelNode,index:number):Node {
  const node=findRuntimeNode(root,index); if(node)return node; const authored=String(root.asset.document.nodes?.[index]?.name??''); throw new Error(`VRM node ${index}${authored?` (${authored})`:''} could not be resolved uniquely.`)
}
function correctAuthoredRestRotations(model:GltfModelNode):void {
  for(const [index,definition] of (model.asset.document.nodes??[]).entries()){ const r=definition?.rotation; if(!r)continue; const node=findRuntimeNode(model,index); if(node)setNodeQuaternion(node,r) }
  model.updateWorldFromRoot()
}
export function createSekai64VrmTarget(model:GltfModelNode):Sekai64VrmTarget {
  correctAuthoredRestRotations(model); const ext=model.asset.document.extensions??{} as R; const modern=object((ext as R).VRMC_vrm), legacy=object((ext as R).VRM)
  if(!(ext as R).VRMC_vrm&&!(ext as R).VRM) throw new Error('Target model has no VRM 0.x/1.0 metadata.')
  const version:("0"|"1")=(ext as R).VRMC_vrm?'1':'0'; const bones:Record<string,string>=Object.create(null); const used=new Set<string>()
  const declarations:[string,any][]=version==='1'?Object.entries(object(object(modern.humanoid).humanBones)) as [string,any][]:(object(legacy.humanoid).humanBones??[]).map((e:R)=>[legacyBone(String(e.bone??'')),e])
  for(const [name,def] of declarations){ const i=Number(object(def).node); if(!name||!Number.isInteger(i)||i<0)continue; const node=findNode(model,i); if(used.has(node.id))throw new Error(`VRM node is assigned to multiple humanoid bones: ${name}`); used.add(node.id); bones[name]=node.id }
  if(!bones.hips) throw new Error('VRM humanoid has no usable hips mapping.')
  const runtime=nodes(model); const snapshots=runtime.map(node=>({node,p:[node.position.x,node.position.y,node.position.z] as const,r:[node.rotation.x,node.rotation.y,node.rotation.z,node.rotation.order] as const,s:[node.scale.x,node.scale.y,node.scale.z] as const,w:node instanceof Mesh&&node.geometry instanceof SkinnedGeometry?node.geometry.morphWeights.slice():undefined}))
  const targets:readonly TargetNode[]=Object.freeze(runtime.map(node=>Object.freeze({id:node.id,name:node.name,restMatrix:Object.freeze(Array.from(node.localMatrix.elements)),parentId:node.parent===model?null:node.parent?.id??null,morphNames:Object.freeze(node instanceof Mesh&&node.geometry instanceof SkinnedGeometry?node.geometry.morphTargets.map(x=>x.name):[])})))
  const restorePose=()=>{ for(const s of snapshots){ if(s.node.disposed)continue; s.node.position.set(...s.p); s.node.rotation.set(...s.r); s.node.scale.set(...s.s); if(s.w&&s.node instanceof Mesh&&s.node.geometry instanceof SkinnedGeometry)s.node.geometry.setMorphWeights(s.w) } model.updateWorldFromRoot() }
  return Object.freeze({model,targets,vrm:Object.freeze({version,bones:Object.freeze(bones),expressions:Object.freeze({})}),restorePose,boneCount:Object.keys(bones).length})
}
