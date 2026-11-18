// Dependency-free GLB shrink, used for media/croissant.glb (@gltf-transform could not be installed here).
// Copied from bulka-bakery (feat/magnific-media). sneaker.glb: node tools/squash-glb.mjs sneaker-orig.glb media/sneaker.glb tex-1024.jpg 130
// (tex-1024.jpg = the embedded 2048 base-colour JPEG resized with ffmpeg: scale=1024:1024:flags=lanczos -q:v 3)
// Usage: node tools/squash-glb.mjs in.glb out.glb texture-1024.jpg [grid=100]
// Vertex-clustering decimation: positions = spatial-cell average (keeps UV seams welded), UV = most central real
// vertex of each (cell, UV) cluster (keeps samples inside their atlas chart), normals averaged;
// KHR_mesh_quantization for NORMAL (int8) + TEXCOORD_0 (uint16), uint16 indices, replacement texture.
import fs from 'fs';
const [,, inp, out, texPath, gridArg] = process.argv;
const G = +gridArg || 100;
const b = fs.readFileSync(inp);
const jl = b.readUInt32LE(12); const j = JSON.parse(b.slice(20, 20 + jl));
const binOff = 20 + jl + 8;
const acc = i => { const a = j.accessors[i], v = j.bufferViews[a.bufferView];
  const n = { SCALAR: 1, VEC2: 2, VEC3: 3 }[a.type];
  const T = a.componentType === 5125 ? Uint32Array : Float32Array;
  const start = binOff + (v.byteOffset || 0) + (a.byteOffset || 0);
  return new T(b.buffer.slice(b.byteOffset + start, b.byteOffset + start + a.count * n * 4)); };
const p = j.meshes[0].primitives[0];
const idx = acc(p.indices), pos = acc(p.attributes.POSITION), nor = acc(p.attributes.NORMAL), uv = acc(p.attributes.TEXCOORD_0);
const pa = j.accessors[p.attributes.POSITION], mn = pa.min, mx = pa.max;
const ext = Math.max(mx[0]-mn[0], mx[1]-mn[1], mx[2]-mn[2]), cs = ext / G;
const UVQ = 96;
const map = new Map(), remap = new Int32Array(pos.length / 3); const acc5 = [];
// position comes from the spatial cell only, so seam duplicates (same cell, different UV) stay welded — no cracks
const cells = new Map(), cellOf = new Array(pos.length / 3), clusterCell = [];
for (let i = 0; i < pos.length / 3; i++) {
  const gx = Math.floor((pos[3*i]-mn[0])/cs), gy = Math.floor((pos[3*i+1]-mn[1])/cs), gz = Math.floor((pos[3*i+2]-mn[2])/cs);
  const key = `${gx},${gy},${gz},${Math.round(uv[2*i]*UVQ)},${Math.round(uv[2*i+1]*UVQ)}`;
  const ck = `${gx},${gy},${gz}`; let cell = cells.get(ck); if (!cell) cells.set(ck, cell = [0, 0, 0, 0]);
  cell[0] += pos[3*i]; cell[1] += pos[3*i+1]; cell[2] += pos[3*i+2]; cell[3]++; cellOf[i] = cell;
  let c = map.get(key);
  if (c === undefined) { c = acc5.length; map.set(key, c); acc5.push([0,0,0,0,0,0,0,0,0]); }
  const s = acc5[c]; s[0]+=pos[3*i]; s[1]+=pos[3*i+1]; s[2]+=pos[3*i+2]; s[3]+=nor[3*i]; s[4]+=nor[3*i+1]; s[5]+=nor[3*i+2]; s[6]+=uv[2*i]; s[7]+=uv[2*i+1]; s[8]++;
  remap[i] = c; clusterCell[c] = cell;
}
const V = acc5.length; if (V > 65535) throw new Error('too many verts ' + V);
const tris = []; const seen = new Set();
for (let t = 0; t < idx.length; t += 3) {
  const a = remap[idx[t]], c = remap[idx[t+1]], d = remap[idx[t+2]];
  if (a === c || c === d || a === d) continue;
  const k = [a,c,d].sort((x,y)=>x-y).join(); if (seen.has(k)) continue; seen.add(k);
  tris.push(a, c, d);
}
// representative = real vertex closest to the cluster centroid (keeps UVs inside their atlas chart)
const rep = new Int32Array(V), best = new Float64Array(V).fill(Infinity);
for (let i = 0; i < remap.length; i++) { const c = remap[i], s = acc5[c], n = s[8];
  const d = (pos[3*i]-s[0]/n)**2 + (pos[3*i+1]-s[1]/n)**2 + (pos[3*i+2]-s[2]/n)**2;
  if (d < best[c]) { best[c] = d; rep[c] = i; } }
const P = new Float32Array(V*3), N = new Int8Array(V*4), U = new Uint16Array(V*2);
const pmin = [Infinity,Infinity,Infinity], pmax = [-Infinity,-Infinity,-Infinity];
acc5.forEach((s, i) => { const r = rep[i];
  const cl = clusterCell[i]; for (let k = 0; k < 3; k++) { P[3*i+k] = cl[k] / cl[3]; pmin[k] = Math.min(pmin[k], P[3*i+k]); pmax[k] = Math.max(pmax[k], P[3*i+k]); }
  const l = Math.hypot(s[3],s[4],s[5]) || 1; for (let k = 0; k < 3; k++) N[4*i+k] = Math.round(s[3+k]/l*127);
  U[2*i] = Math.round(uv[2*r]*65535); U[2*i+1] = Math.round(uv[2*r+1]*65535); });
const I = new Uint16Array(tris);
const tex = fs.readFileSync(texPath);
const pad4 = buf => { const r = buf.length % 4; return r ? Buffer.concat([buf, Buffer.alloc(4 - r)]) : buf; };
const chunks = [Buffer.from(I.buffer), Buffer.from(P.buffer), Buffer.from(N.buffer), Buffer.from(U.buffer), tex];
let off = 0; const views = chunks.map((c, i) => { const v = { buffer: 0, byteOffset: off, byteLength: c.length }; if (i === 0) v.target = 34963; else if (i < 4) v.target = 34962; off += pad4(c).length; return v; });
const binBuf = Buffer.concat(chunks.map(pad4));
j.bufferViews = views; j.buffers = [{ byteLength: binBuf.length }];
j.accessors = [
  { bufferView: 0, componentType: 5123, count: I.length, type: 'SCALAR', min: [0], max: [V-1] },
  { bufferView: 1, componentType: 5126, count: V, type: 'VEC3', min: pmin, max: pmax },
  { bufferView: 3, componentType: 5123, normalized: true, count: V, type: 'VEC2' },
  { bufferView: 2, componentType: 5120, normalized: true, count: V, type: 'VEC3', byteOffset: 0 },
];
j.bufferViews[2].byteStride = 4;
j.images[0].bufferView = 4; j.images[0].mimeType = 'image/jpeg';
j.extensionsUsed = ['KHR_mesh_quantization']; j.extensionsRequired = ['KHR_mesh_quantization'];
j.asset.generator = 'tripo3d.ai + squash.mjs (cluster decimation, quantized)';
const js = pad4(Buffer.from(JSON.stringify(j)));
const jsBuf = Buffer.concat([js.subarray(0, Buffer.byteLength(JSON.stringify(j))), Buffer.alloc(js.length - Buffer.byteLength(JSON.stringify(j)), 0x20)]);
const hdr = Buffer.alloc(12); hdr.writeUInt32LE(0x46546C67, 0); hdr.writeUInt32LE(2, 4); hdr.writeUInt32LE(12 + 8 + jsBuf.length + 8 + binBuf.length, 8);
const ch = (len, type) => { const h = Buffer.alloc(8); h.writeUInt32LE(len, 0); h.writeUInt32LE(type, 4); return h; };
fs.writeFileSync(out, Buffer.concat([hdr, ch(jsBuf.length, 0x4E4F534A), jsBuf, ch(binBuf.length, 0x004E4942), binBuf]));
console.log({ grid: G, verts: V, tris: I.length / 3, bytes: fs.statSync(out).size, tex: tex.length });
