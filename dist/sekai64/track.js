import { AnimationTrack } from '@blcklab/sekai64/animation';
/** Match glTF STEP's right-continuous key boundary semantics. */
export class StepAnimationTrack extends AnimationTrack {
    sample(time, target = new Float32Array(this.valueSize)) {
        if (this.interpolation !== 'step')
            return super.sample(time, target);
        let low = 0, high = this.times.length;
        while (low < high) {
            const mid = (low + high) >>> 1;
            if (this.times[mid] <= time)
                low = mid + 1;
            else
                high = mid;
        }
        const index = Math.max(0, low - 1);
        target.set(this.values.subarray(index * this.valueSize, (index + 1) * this.valueSize));
        return target;
    }
}
/** Final playable track. Rotation samples are encoded for Sekai64's current Euler-backed node convention. */
export class CompatibleAnimationTrack extends StepAnimationTrack {
    sample(time, target = new Float32Array(this.valueSize)) {
        const out = super.sample(time, target);
        if (this.path === 'rotation')
            encodeQuaternionForSekaiMixer(out);
        return out;
    }
}
/** Encode the Viewer-correct XYZ pose into a quaternion understood by Sekai64 AnimationMixer. */
export function encodeQuaternionForSekaiMixer(values) {
    let x = values[0], y = values[1], z = values[2], w = values[3];
    const len = Math.hypot(x, y, z, w);
    if (!Number.isFinite(len) || len < 1e-8)
        throw new Error('Invalid rotation quaternion.');
    x /= len;
    y /= len;
    z /= len;
    w /= len;
    const m13 = Math.max(-1, Math.min(1, 2 * (x * z + y * w)));
    const ey = Math.asin(m13);
    let ex, ez;
    if (Math.abs(m13) < 0.9999999) {
        ex = Math.atan2(2 * (x * w - y * z), 1 - 2 * (x * x + y * y));
        ez = Math.atan2(2 * (z * w - x * y), 1 - 2 * (y * y + z * z));
    }
    else {
        ex = Math.atan2(2 * (y * z + x * w), 1 - 2 * (x * x + z * z));
        ez = 0;
    }
    const cr = Math.cos(ex / 2), sr = Math.sin(ex / 2), cp = Math.cos(ey / 2), sp = Math.sin(ey / 2), cy = Math.cos(ez / 2), sy = Math.sin(ez / 2);
    values[0] = sr * cp * cy - cr * sp * sy;
    values[1] = cr * sp * cy + sr * cp * sy;
    values[2] = cr * cp * sy - sr * sp * cy;
    values[3] = cr * cp * cy + sr * sp * sy;
}
//# sourceMappingURL=track.js.map