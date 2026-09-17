import { Mesh } from '@blcklab/sekai64';
import { SkinnedGeometry } from '@blcklab/sekai64/animation';
import { setNodeQuaternion } from './internal.js';
const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) ? v : {};
const legacyBone = (name) => name.replace(/ThumbProximal$/, 'ThumbMetacarpal').replace(/ThumbIntermediate$/, 'ThumbProximal');
function nodes(root) { const list = []; root.traverse(n => { if (n !== root)
    list.push(n); }); return list; }
function findRuntimeNode(root, index) {
    const doc = root.asset.document;
    const authored = String(doc.nodes?.[index]?.name ?? '');
    const suffix = `:node-${index}`;
    let exact;
    const named = [];
    root.traverse(n => { if (n === root)
        return; const id = String(n.id ?? ''); if (!exact && (id === `node-${index}` || id.endsWith(suffix)))
        exact = n; if (authored && n.name === authored)
        named.push(n); });
    if (exact)
        return exact;
    if (named.length === 1)
        return named[0];
    return undefined;
}
function findNode(root, index) {
    const node = findRuntimeNode(root, index);
    if (node)
        return node;
    const authored = String(root.asset.document.nodes?.[index]?.name ?? '');
    throw new Error(`VRM node ${index}${authored ? ` (${authored})` : ''} could not be resolved uniquely.`);
}
function correctAuthoredRestRotations(model) {
    for (const [index, definition] of (model.asset.document.nodes ?? []).entries()) {
        const r = definition?.rotation;
        if (!r)
            continue;
        const node = findRuntimeNode(model, index);
        if (node)
            setNodeQuaternion(node, r);
    }
    model.updateWorldFromRoot();
}
export function createSekai64VrmTarget(model) {
    correctAuthoredRestRotations(model);
    const ext = model.asset.document.extensions ?? {};
    const modern = object(ext.VRMC_vrm), legacy = object(ext.VRM);
    if (!ext.VRMC_vrm && !ext.VRM)
        throw new Error('Target model has no VRM 0.x/1.0 metadata.');
    const version = ext.VRMC_vrm ? '1' : '0';
    const bones = Object.create(null);
    const used = new Set();
    const declarations = version === '1' ? Object.entries(object(object(modern.humanoid).humanBones)) : (object(legacy.humanoid).humanBones ?? []).map((e) => [legacyBone(String(e.bone ?? '')), e]);
    for (const [name, def] of declarations) {
        const i = Number(object(def).node);
        if (!name || !Number.isInteger(i) || i < 0)
            continue;
        const node = findNode(model, i);
        if (used.has(node.id))
            throw new Error(`VRM node is assigned to multiple humanoid bones: ${name}`);
        used.add(node.id);
        bones[name] = node.id;
    }
    if (!bones.hips)
        throw new Error('VRM humanoid has no usable hips mapping.');
    const runtime = nodes(model);
    const snapshots = runtime.map(node => ({ node, p: [node.position.x, node.position.y, node.position.z], r: [node.rotation.x, node.rotation.y, node.rotation.z, node.rotation.order], s: [node.scale.x, node.scale.y, node.scale.z], w: node instanceof Mesh && node.geometry instanceof SkinnedGeometry ? node.geometry.morphWeights.slice() : undefined }));
    const targets = Object.freeze(runtime.map(node => Object.freeze({ id: node.id, name: node.name, restMatrix: Object.freeze(Array.from(node.localMatrix.elements)), parentId: node.parent === model ? null : node.parent?.id ?? null, morphNames: Object.freeze(node instanceof Mesh && node.geometry instanceof SkinnedGeometry ? node.geometry.morphTargets.map(x => x.name) : []) })));
    const restorePose = () => { for (const s of snapshots) {
        if (s.node.disposed)
            continue;
        s.node.position.set(...s.p);
        s.node.rotation.set(...s.r);
        s.node.scale.set(...s.s);
        if (s.w && s.node instanceof Mesh && s.node.geometry instanceof SkinnedGeometry)
            s.node.geometry.setMorphWeights(s.w);
    } model.updateWorldFromRoot(); };
    return Object.freeze({ model, targets, vrm: Object.freeze({ version, bones: Object.freeze(bones), expressions: Object.freeze({}) }), restorePose, boneCount: Object.keys(bones).length });
}
//# sourceMappingURL=target.js.map