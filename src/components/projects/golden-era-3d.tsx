"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/**
 * Golden Era Homes — a procedural high-rise residential cluster in the NexGen
 * cream + antique-gold palette, modelled on Goyal Infra's project renders:
 * balcony-banded towers of varying heights on a landscaped podium with a
 * tree-lined boulevard. HDRI image-based lighting + sky, GTAO ambient
 * occlusion, SMAA, reflective glass. Orbit + drag; an intro "assembly" stacks
 * the floors on load; toggle between an aerial establishing view and a
 * street-level view. Frame-rate-independent, pauses off-screen, reduced-motion aware.
 */
export function GoldenEra3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const goToRef = useRef<(street: boolean) => void>(() => {});
  const [street, setStreet] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const highPerf =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth >= 768;

    const renderer = new THREE.WebGLRenderer({ antialias: !highPerf, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, highPerf ? 1.75 : 1.4));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      cursor: "grab",
      touchAction: "pan-y",
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc3ccd4);
    scene.fog = new THREE.Fog(0xcdd3d8, 70, 210);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 600);

    // ---------- procedural textures ----------
    const cv = (size = 256) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      return c;
    };
    const wrap = (t: THREE.Texture, rx = 1, ry = rx) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rx, ry);
      t.anisotropy = 8;
      t.needsUpdate = true;
      return t;
    };
    const noiseTex = (base: number, spread: number, size = 256) => {
      const c = cv(size), x = c.getContext("2d")!;
      const img = x.createImageData(size, size);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.max(0, Math.min(255, base + (Math.random() - 0.5) * spread));
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      return new THREE.CanvasTexture(c);
    };
    const lawnTex = () => {
      const c = cv(512), x = c.getContext("2d")!;
      x.fillStyle = "#3f4d2c";
      x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 3600; i++) {
        const g = 42 + Math.random() * 55;
        x.fillStyle = `rgb(${Math.round(g * 0.7)},${Math.round(g)},${Math.round(g * 0.5)})`;
        x.fillRect(Math.random() * 512, Math.random() * 512, 2, 3);
      }
      return new THREE.CanvasTexture(c);
    };
    const paveTex = () => {
      const c = cv(256), x = c.getContext("2d")!;
      x.fillStyle = "#b9ac93";
      x.fillRect(0, 0, 256, 256);
      x.strokeStyle = "rgba(90,78,54,0.5)";
      x.lineWidth = 2;
      for (let i = 0; i <= 256; i += 42) {
        x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 256); x.stroke();
        x.beginPath(); x.moveTo(0, i); x.lineTo(256, i); x.stroke();
      }
      return new THREE.CanvasTexture(c);
    };
    const roadTex = () => {
      const c = cv(256), x = c.getContext("2d")!;
      x.fillStyle = "#2a2824";
      x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2400; i++) {
        const g = 30 + Math.random() * 26;
        x.fillStyle = `rgba(${g},${g},${g - 4},0.5)`;
        x.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
      }
      return new THREE.CanvasTexture(c);
    };

    let hdrTex: THREE.Texture | null = null;
    let envRT: THREE.WebGLRenderTarget | null = null;

    // ---------- lighting ----------
    scene.add(new THREE.HemisphereLight(0xdfe8f0, 0x4a4f38, 0.3));
    const sun = new THREE.DirectionalLight(0xfff1d8, 2.7);
    sun.position.set(-16, 30, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(highPerf ? 2048 : 1024, highPerf ? 2048 : 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 140;
    sun.shadow.camera.left = -34;
    sun.shadow.camera.right = 34;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -18;
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 5;
    scene.add(sun);

    // ---------- materials ----------
    const wallBump = wrap(noiseTex(128, 18), 4);
    const cream = new THREE.MeshStandardMaterial({ color: 0xece2cc, roughness: 0.9, metalness: 0, bumpMap: wallBump, bumpScale: 0.004, envMapIntensity: 1 });
    const creamDark = new THREE.MeshStandardMaterial({ color: 0xcdbe9c, roughness: 0.92, metalness: 0, bumpMap: wallBump, bumpScale: 0.004, envMapIntensity: 1 });
    const tan = new THREE.MeshStandardMaterial({ color: 0xdcc7a0, roughness: 0.88, metalness: 0, bumpMap: wallBump, bumpScale: 0.004, envMapIntensity: 1 });
    const stone = new THREE.MeshStandardMaterial({ color: 0x6f6752, roughness: 0.85, metalness: 0.05 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x2a251b, roughness: 0.5, metalness: 0.5 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x11212b, metalness: 0, roughness: 0.04, ior: 1.5,
      clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 2.2, reflectivity: 0.7,
    });
    const railGlass = new THREE.MeshPhysicalMaterial({
      color: 0x2b4653, metalness: 0, roughness: 0.08, transmission: 0.55, transparent: true,
      opacity: 0.72, ior: 1.4, envMapIntensity: 1.6,
    });
    const gold = new THREE.MeshStandardMaterial({ color: 0xb0873a, roughness: 0.24, metalness: 1, envMapIntensity: 2.0 });
    const goldGlow = new THREE.MeshStandardMaterial({ color: 0xffd79a, emissive: 0xf2be74, emissiveIntensity: 1.1, roughness: 0.4 });
    const lawnMat = new THREE.MeshStandardMaterial({ map: wrap(lawnTex(), 14), roughness: 1, metalness: 0 });
    const paveMat = new THREE.MeshStandardMaterial({ map: wrap(paveTex(), 6), roughness: 0.8, metalness: 0.04 });
    const roadMat = new THREE.MeshStandardMaterial({ map: wrap(roadTex(), 3, 8), roughness: 0.7, metalness: 0.05 });
    const water = new THREE.MeshPhysicalMaterial({ color: 0x123039, roughness: 0.04, metalness: 0, clearcoat: 1, envMapIntensity: 2.0 });
    const foliage = new THREE.MeshStandardMaterial({ color: 0x59663f, roughness: 0.92, metalness: 0 });
    const foliageLt = new THREE.MeshStandardMaterial({ color: 0x6d7a4c, roughness: 0.92, metalness: 0 });
    const carBody = new THREE.MeshPhysicalMaterial({ color: 0x1b1e24, roughness: 0.25, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.6 });

    const complex = new THREE.Group();
    scene.add(complex);

    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, shadow = true) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = shadow;
      m.receiveShadow = shadow;
      complex.add(m);
      return m;
    };
    const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, s = true) =>
      add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, s);
    const rbox = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, r = 0.06, s = true) =>
      add(new RoundedBoxGeometry(w, h, d, 5, Math.max(r, 0.05)), mat, x, y, z, s);

    const baseY = 0.4;   // podium top
    const fh = 0.94;     // floor-to-floor
    const lobbyH = 1.9;  // double-height ground lobby

    // ---------- a balcony-banded tower ----------
    const tower = (cx: number, cz: number, w: number, d: number, floors: number) => {
      // ground lobby (glazed, gold portal)
      rbox(w, lobbyH, d, cream, cx, baseY + lobbyH / 2, cz, 0.06);
      box(w - 0.5, lobbyH - 0.6, 0.06, glass, cx, baseY + lobbyH / 2 - 0.1, cz + d / 2 + 0.01, false);
      box(w - 0.2, 0.18, 0.16, gold, cx, baseY + lobbyH - 0.2, cz + d / 2 + 0.05, false); // gold portal lintel
      box(0.55, lobbyH - 0.5, 0.14, goldGlow, cx + w / 2 - 0.45, baseY + (lobbyH - 0.5) / 2 + 0.1, cz + d / 2 + 0.04, false); // warm entry light

      const y0 = baseY + lobbyH;
      for (let f = 0; f < floors; f++) {
        const fy = y0 + f * fh;
        const gsp = f % 3 === 2; // every 3rd floor: a gold spandrel band (render accent)
        // floor slab / balcony ledge
        box(w + 0.5, 0.14, d + 0.5, gsp ? gold : creamDark, cx, fy + 0.07, cz, false);
        // structural core (set back behind balconies)
        rbox(w - 0.16, fh - 0.14, d - 0.16, f % 2 ? cream : tan, cx, fy + fh / 2, cz, 0.05, true);
        // recessed dark glazing on the front
        box(w - 0.7, fh - 0.42, 0.05, glass, cx, fy + fh / 2, cz + d / 2 - 0.12, false);
        // glass balcony balustrade wrapping front + returns, with a gold cap rail
        const bh = 0.46, by = fy + 0.14 + bh / 2;
        box(w + 0.5, bh, 0.04, railGlass, cx, by, cz + d / 2 + 0.24, false);
        box(w + 0.5, 0.05, 0.07, gold, cx, by + bh / 2, cz + d / 2 + 0.24, false);
        box(0.04, bh, d + 0.5, railGlass, cx - w / 2 - 0.24, by, cz, false);
        box(0.04, bh, d + 0.5, railGlass, cx + w / 2 + 0.24, by, cz, false);
      }

      const topH = y0 + floors * fh;
      // full-height gold corner fins
      for (const dx of [-1, 1]) for (const dz of [-1, 1])
        box(0.13, topH - baseY, 0.13, gold, cx + dx * (w / 2 + 0.2), baseY + (topH - baseY) / 2, cz + dz * (d / 2 + 0.2), false);
      // crown: parapet, gold coping, lift head + slim mast
      rbox(w + 0.6, 0.44, d + 0.6, creamDark, cx, topH + 0.22, cz, 0.06);
      box(w + 0.64, 0.08, d + 0.64, gold, cx, topH + 0.48, cz, false);
      rbox(w * 0.5, 1.0, d * 0.5, creamDark, cx, topH + 0.5 + 0.5, cz, 0.05);
      add(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 12), gold, cx, topH + 1.7, cz, false);
      add(new THREE.SphereGeometry(0.1, 16, 16), goldGlow, cx, topH + 2.42, cz, false);
      return topH;
    };

    // ---------- amenity / clubhouse low block ----------
    const block = (cx: number, cz: number, w: number, d: number, floors: number) => {
      for (let f = 0; f < floors; f++) {
        const fy = baseY + f * fh;
        box(w + 0.3, 0.12, d + 0.3, f % 2 ? creamDark : gold, cx, fy + 0.06, cz, false);
        rbox(w, fh - 0.12, d, tan, cx, fy + fh / 2, cz, 0.05, true);
        box(w - 0.4, fh - 0.4, 0.05, glass, cx, fy + fh / 2, cz + d / 2 + 0.01, false);
      }
      const h = baseY + floors * fh;
      box(w + 0.4, 0.2, d + 0.4, gold, cx, h + 0.1, cz, false);
    };

    // ---------- grounds ----------
    add(new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2), lawnMat, 0, -0.02, 0, true);
    // raised paved podium the towers stand on
    rbox(30, 0.4, 22, paveMat, 0, 0.2, -1, 0.05);
    // reflecting pool / water court in front of the podium
    box(11, 0.08, 3.4, water, -1, 0.28, 8.6, false);
    box(11.6, 0.2, 4.0, stone, -1, 0.16, 8.6);

    // ---------- the cluster (varied heights, like the renders) ----------
    tower(0, -3.5, 3.4, 3.0, 16);      // central landmark tower
    tower(-7.2, 0.5, 2.9, 2.6, 12);    // left tower
    tower(7.0, -0.5, 2.9, 2.6, 13);    // right tower
    tower(-2.5, 3.0, 2.6, 2.4, 10);    // front-left mid-rise
    block(4.6, 5.0, 3.2, 2.4, 3);      // clubhouse / amenity block

    // ---------- boulevard (foreground, like the night render) ----------
    add(new THREE.PlaneGeometry(60, 7).rotateX(-Math.PI / 2), roadMat, 0, 0.01, 15.5, true);
    for (let i = -5; i <= 5; i++) box(1.1, 0.02, 0.16, goldGlow, i * 2.6, 0.03, 15.5, false); // dashed centre line (warm)
    rbox(24, 0.34, 0.7, foliage, 0, 0.17, 13.4, 0.08);   // planted median
    for (let i = 0; i < 9; i++) add(new THREE.IcosahedronGeometry(0.42, 1), foliageLt, -20 + i * 5, 0.6, 13.4, false);
    // street lights along the median
    const streetLight = (x: number) => {
      add(new THREE.CylinderGeometry(0.06, 0.09, 3.0, 10), frame, x, 1.5, 13.4);
      box(1.2, 0.08, 0.16, frame, x + 0.5, 3.0, 13.4, false);
      add(new THREE.SphereGeometry(0.13, 14, 14), goldGlow, x + 1.0, 2.94, 13.4, false);
      add(new THREE.SphereGeometry(0.13, 14, 14), goldGlow, x - 1.0, 2.94, 13.4, false);
    };
    [-16, -8, 0, 8, 16].forEach(streetLight);
    // a couple of stylised cars on the boulevard
    const car = (x: number, z: number, dir: number) => {
      rbox(1.9, 0.5, 0.9, carBody, x, 0.55, z, 0.16);
      rbox(1.05, 0.42, 0.82, glass, x - dir * 0.1, 0.92, z, 0.12, false);
      add(new THREE.SphereGeometry(0.08, 12, 12), goldGlow, x + dir * 0.95, 0.5, z + 0.3, false);
      add(new THREE.SphereGeometry(0.08, 12, 12), goldGlow, x + dir * 0.95, 0.5, z - 0.3, false);
    };
    car(-4, 16.4, 1);
    car(6, 14.6, -1);

    // ---------- landscaping around the podium ----------
    const tree = (x: number, z: number, s: number) => {
      add(new THREE.CylinderGeometry(0.12 * s, 0.18 * s, 1.6 * s, 10), stone, x, 0.8 * s, z);
      add(new THREE.IcosahedronGeometry(1.0 * s, 2), foliage, x, 2.0 * s, z);
      add(new THREE.IcosahedronGeometry(0.72 * s, 2), foliageLt, x - 0.55 * s, 1.7 * s, z + 0.3 * s, false);
      add(new THREE.IcosahedronGeometry(0.66 * s, 2), foliage, x + 0.55 * s, 1.6 * s, z - 0.3 * s, false);
    };
    tree(-13, 9, 1.15); tree(13, 8.5, 1.05); tree(-11.5, -8, 0.95); tree(11, -7.5, 1.0);
    tree(0, 10.5, 0.8);
    // hedges edging the podium
    rbox(28, 0.55, 0.6, foliage, 0, 0.5, 10.2, 0.1);
    rbox(0.6, 0.5, 18, foliageLt, -14.6, 0.45, 0, 0.1);
    rbox(0.6, 0.5, 18, foliageLt, 14.6, 0.45, 0, 0.1);
    for (const px of [-6, -2, 2, 6]) { // entrance planters
      rbox(0.5, 0.5, 0.5, stone, px, 0.55, 9.4, 0.05);
      add(new THREE.IcosahedronGeometry(0.36, 2), foliageLt, px, 1.0, 9.4, false);
    }

    // soft contact shadow
    const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.24 }));
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = 0.005;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // ---------- intro assembly: floors fly in and stack ----------
    type Piece = { m: THREE.Mesh; fp: THREE.Vector3; ep: THREE.Vector3; fr: THREE.Euler; er: THREE.Euler };
    const pieces: Piece[] = [];
    const centre = new THREE.Vector3(0, 9, -1);
    const rnd = (i: number, n: number) => {
      const x = Math.sin((i + 1) * n) * 43758.5453;
      return x - Math.floor(x);
    };
    complex.children.forEach((child, i) => {
      const m = child as THREE.Mesh;
      if (!m.isMesh) return;
      if (m.position.y < 0.45) return; // keep the site (podium/road/pool/lawn) grounded
      const fp = m.position.clone();
      const dir = fp.clone().sub(centre);
      if (dir.length() < 0.01) dir.set(0, 1, 0);
      dir.normalize();
      const ep = fp
        .clone()
        .add(dir.multiplyScalar(6 + rnd(i, 12.9) * 14))
        .add(new THREE.Vector3((rnd(i, 78.2) - 0.5) * 22, rnd(i, 3.7) * 16 + 3, (rnd(i, 11.1) - 0.5) * 22));
      pieces.push({
        m, fp, ep,
        fr: m.rotation.clone(),
        er: new THREE.Euler((rnd(i, 1.1) - 0.5) * 1.4, (rnd(i, 2.2) - 0.5) * 2.0, (rnd(i, 3.3) - 0.5) * 1.4),
      });
      m.position.copy(ep);
      m.rotation.copy(pieces[pieces.length - 1].er);
    });
    let assembly = reduce ? 1 : 0;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const applyAssembly = () => {
      const e = easeOut(assembly);
      for (const p of pieces) {
        p.m.position.lerpVectors(p.ep, p.fp, e);
        p.m.rotation.set(
          p.er.x + (p.fr.x - p.er.x) * e,
          p.er.y + (p.fr.y - p.er.y) * e,
          p.er.z + (p.fr.z - p.er.z) * e,
        );
      }
    };
    applyAssembly();

    // ---------- post-processing ----------
    let composer: EffectComposer | null = null;
    if (highPerf) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const gtao = new GTAOPass(scene, camera, 1, 1);
      gtao.output = GTAOPass.OUTPUT.Default;
      gtao.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1, thickness: 1, scale: 1, samples: 16 });
      composer.addPass(gtao);
      composer.addPass(new SMAAPass());
      composer.addPass(new OutputPass());
    }
    const renderFrame = () => (composer ? composer.render() : renderer.render(scene, camera));

    // ---------- orbit camera ----------
    type View = { target: THREE.Vector3; radius: number; az: number; pol: number };
    const AERIAL: View = { target: new THREE.Vector3(0, 7.5, -1), radius: 40, az: -0.5, pol: 1.02 };
    const STREET: View = { target: new THREE.Vector3(0, 6.0, -2), radius: 27, az: 0.0, pol: 1.4 };

    let mode: View = AERIAL;
    const cur = { tx: AERIAL.target.x, ty: AERIAL.target.y, tz: AERIAL.target.z, r: AERIAL.radius, az: AERIAL.az, pol: AERIAL.pol };
    let tgt = { ...cur };
    const lookAt = new THREE.Vector3();
    const applyCamera = () => {
      camera.position.set(
        cur.tx + cur.r * Math.sin(cur.pol) * Math.sin(cur.az),
        cur.ty + cur.r * Math.cos(cur.pol),
        cur.tz + cur.r * Math.sin(cur.pol) * Math.cos(cur.az),
      );
      lookAt.set(cur.tx, cur.ty, cur.tz);
      camera.lookAt(lookAt);
    };
    const setView = (v: View) => {
      tgt = { tx: v.target.x, ty: v.target.y, tz: v.target.z, r: v.radius, az: v === STREET ? 0.0 : cur.az, pol: v.pol };
    };
    setView(AERIAL);
    applyCamera();
    goToRef.current = (goStreet: boolean) => { mode = goStreet ? STREET : AERIAL; setView(mode); };

    // ---------- HDRI environment + sky ----------
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    new RGBELoader().load(
      "/hdri/sky_1k.hdr",
      (hdr) => {
        hdr.mapping = THREE.EquirectangularReflectionMapping;
        hdrTex = hdr;
        envRT = pmrem.fromEquirectangular(hdr);
        scene.environment = envRT.texture;
        scene.background = hdr;
        scene.backgroundBlurriness = 0;
        scene.environmentIntensity = 1;
        pmrem.dispose();
        renderFrame();
      },
      undefined,
      () => pmrem.dispose(),
    );

    // ---------- interaction ----------
    let dragging = false, lastX = 0, lastY = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      tgt.az += (e.clientX - lastX) * 0.007;
      const isStreet = mode === STREET;
      tgt.pol = THREE.MathUtils.clamp(tgt.pol + (e.clientY - lastY) * 0.004, 0.5, isStreet ? 1.5 : 1.35);
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false; renderer.domElement.style.cursor = "grab";
      try { renderer.domElement.releasePointerCapture(e.pointerId); } catch {}
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // ---------- sizing ----------
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      composer?.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applyCamera();
      renderFrame();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---------- loop ----------
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(mount);
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      // time-based intro assembly (once), then hold
      if (assembly < 1) assembly = Math.min(1, assembly + dt / 2.0);
      if (!dragging && !reduce && mode === AERIAL) tgt.az += 0.05 * dt;
      const k = 1 - Math.exp(-6 * dt);
      cur.tx += (tgt.tx - cur.tx) * k; cur.ty += (tgt.ty - cur.ty) * k; cur.tz += (tgt.tz - cur.tz) * k;
      cur.r += (tgt.r - cur.r) * k; cur.az += (tgt.az - cur.az) * k; cur.pol += (tgt.pol - cur.pol) * k;
      applyAssembly();
      applyCamera();
      renderFrame();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else m?.dispose?.();
      });
      hdrTex?.dispose();
      envRT?.dispose();
      composer?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => { const next = !street; setStreet(next); goToRef.current(next); }}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
        >
          {street ? "↑ Aerial view" : "↓ Street view"}
        </button>
        <span className="pointer-events-none hidden items-center rounded-full border border-white/15 bg-black/30 px-4 py-2.5 text-xs font-medium text-[#efe7d7] backdrop-blur sm:inline-flex">
          Drag to look around · a 3D concept massing
        </span>
      </div>
    </>
  );
}
