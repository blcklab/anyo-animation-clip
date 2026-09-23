import { GltfLoader } from '@blcklab/sekai64/gltf';
export function object(value) { return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
export function prepareSource(loader, source, format) {
    const real = new URL(source, typeof location === 'undefined' ? 'file:///' : location.href);
    if (real.pathname.toLowerCase().endsWith(`.${format}`))
        return { url: real, dispose: () => { } };
    const virtual = real.protocol === 'blob:' || real.protocol === 'data:' ? new URL(`https://anyo-animation-clip.invalid/asset.${format}`) : new URL(real.href);
    if (virtual.origin !== 'https://anyo-animation-clip.invalid')
        virtual.pathname += `.${format}`;
    const dispose = loader.assets.addResolver({ canResolve: c => c.href === virtual.href, fetch: (_c, o) => fetch(real, { ...(o.signal ? { signal: o.signal } : {}), ...(o.headers ? { headers: o.headers } : {}) }) });
    return { url: virtual, dispose };
}
/** Match glTF quaternion rest values to Sekai64's authored XYZ convention. */
export function setNodeQuaternion(node, values) {
    let x = values[0], y = values[1], z = values[2], w = values[3];
    const len = Math.hypot(x, y, z, w);
    if (!Number.isFinite(len) || len < 1e-8)
        throw new Error('Invalid rotation quaternion.');
    x /= len;
    y /= len;
    z /= len;
    w /= len;
    const m13 = Math.max(-1, Math.min(1, 2 * (x * z + y * w)));
    const pitch = Math.asin(m13);
    if (Math.abs(m13) < 0.9999999)
        node.rotation.set(Math.atan2(2 * (x * w - y * z), 1 - 2 * (x * x + y * y)), pitch, Math.atan2(2 * (z * w - x * y), 1 - 2 * (y * y + z * z)), 'XYZ');
    else
        node.rotation.set(Math.atan2(2 * (y * z + x * w), 1 - 2 * (x * x + z * z)), pitch, 0, 'XYZ');
}
export function correctGltfRestRotations(context) { for (const [index, nodes] of context.nodes) {
    const r = context.document.nodes?.[index]?.rotation;
    if (r)
        for (const node of nodes)
            setNodeQuaternion(node, r);
} context.scene.updateWorldFromRoot(); }
//# sourceMappingURL=internal.js.map