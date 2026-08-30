"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

type ViewKey = "street" | "aerial" | "inside";

/**
 * Golden Era Homes — a photo-matched 3D reconstruction of Goyal Infra's
 * renders, in the NexGen cream + antique-gold palette. Twin balcony-banded
 * towers (white projecting slabs, glass balustrades, warm LED edges, a
 * reflective glazed core) beside a terracotta courtyard block, a grand gold
 * entrance gate, and a tree-lined boulevard. "Step inside" flies into a
 * furnished show flat (marble, rose-velvet + gold dining, gold pendants).
 * HDRI IBL + GTAO/SMAA; the towers ASSEMBLE as you scroll the section into
 * view. Frame-rate-independent, pauses off-screen, reduced-motion aware.
 */
export function GoldenEra3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const goToRef = useRef<(v: ViewKey) => void>(() => {});
  const [view, setView] = useState<ViewKey>("street");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // pinned scroll-track (same mechanism as the homepage villa) drives assembly
    const scrollTrack = mount.closest<HTMLElement>("[data-scroll-track]");
    // dev-only visual-verification flags (inert without the query params)
    const q = new URLSearchParams(window.location.search);
    const forceBuilt = q.has("built");
    const forceView = q.get("view") as ViewKey | null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const highPerf =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth >= 768;

    const renderer = new THREE.WebGLRenderer({ antialias: !highPerf, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, highPerf ? 1.75 : 1.4));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%", height: "100%", cursor: "grab", touchAction: "pan-y",
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a2440);
    scene.fog = new THREE.Fog(0x243154, 70, 230);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 700);

    // ---------- procedural textures ----------
    const cv = (s = 256) => { const c = document.createElement("canvas"); c.width = c.height = s; return c; };
    const wrap = (t: THREE.Texture, rx = 1, ry = rx) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; t.needsUpdate = true; return t;
    };
    const noiseTex = (base: number, spread: number, size = 256) => {
      const c = cv(size), x = c.getContext("2d")!, img = x.createImageData(size, size);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.max(0, Math.min(255, base + (Math.random() - 0.5) * spread));
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0); return new THREE.CanvasTexture(c);
    };
    const lawnTex = () => {
      const c = cv(512), x = c.getContext("2d")!; x.fillStyle = "#405028"; x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 4000; i++) { const g = 44 + Math.random() * 55; x.fillStyle = `rgb(${Math.round(g * 0.7)},${Math.round(g)},${Math.round(g * 0.5)})`; x.fillRect(Math.random() * 512, Math.random() * 512, 2, 3); }
      return new THREE.CanvasTexture(c);
    };
    const paveTex = () => {
      const c = cv(256), x = c.getContext("2d")!; x.fillStyle = "#c3b79d"; x.fillRect(0, 0, 256, 256);
      x.strokeStyle = "rgba(90,78,54,0.45)"; x.lineWidth = 2;
      for (let i = 0; i <= 256; i += 40) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 256); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(256, i); x.stroke(); }
      return new THREE.CanvasTexture(c);
    };
    const roadTex = () => {
      const c = cv(256), x = c.getContext("2d")!; x.fillStyle = "#2b2926"; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2600; i++) { const g = 30 + Math.random() * 24; x.fillStyle = `rgba(${g},${g},${g - 4},0.5)`; x.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); }
      return new THREE.CanvasTexture(c);
    };
    const marbleTex = () => {
      const c = cv(512), x = c.getContext("2d")!; x.fillStyle = "#f3efe6"; x.fillRect(0, 0, 512, 512);
      x.strokeStyle = "rgba(150,140,120,0.35)"; x.lineWidth = 1.2;
      for (let i = 0; i < 22; i++) { x.beginPath(); let px = Math.random() * 512, py = 0; x.moveTo(px, py); while (py < 512) { px += (Math.random() - 0.5) * 60; py += 20 + Math.random() * 30; x.lineTo(px, py); } x.stroke(); }
      return new THREE.CanvasTexture(c);
    };

    // dusk sky gradient (deep navy → warm sunset horizon) — matches the night render
    const duskSky = () => {
      const c = cv(16); c.width = 16; c.height = 512;
      const x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0.0, "#0a1630");
      g.addColorStop(0.5, "#1b2b4d");
      g.addColorStop(0.72, "#3c3a5f");
      g.addColorStop(0.84, "#9a5f45");
      g.addColorStop(0.92, "#d98a4e");
      g.addColorStop(1.0, "#e9b877");
      x.fillStyle = g; x.fillRect(0, 0, 16, 512);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    scene.background = duskSky();

    let hdrTex: THREE.Texture | null = null;
    let envRT: THREE.WebGLRenderTarget | null = null;

    // ---------- lighting (golden-hour / dusk) ----------
    scene.add(new THREE.HemisphereLight(0x3a4a6e, 0x241c14, 0.5));
    scene.add(new THREE.AmbientLight(0x2a3352, 0.35));
    const sun = new THREE.DirectionalLight(0xffa259, 2.3); // warm low setting sun
    sun.position.set(-34, 16, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(highPerf ? 2048 : 1024, highPerf ? 2048 : 1024);
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 160;
    sun.shadow.camera.left = -40; sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 46; sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.03; sun.shadow.radius = 5;
    scene.add(sun);

    // ---------- materials ----------
    const bump = wrap(noiseTex(128, 16), 4);
    const plaster = new THREE.MeshStandardMaterial({ color: 0xd9c6a0, roughness: 0.92, metalness: 0, bumpMap: bump, bumpScale: 0.004 });
    const plasterWarm = new THREE.MeshStandardMaterial({ color: 0xe4d2ab, roughness: 0.9, metalness: 0, bumpMap: bump, bumpScale: 0.004 });
    const slabWhite = new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.72, metalness: 0, bumpMap: bump, bumpScale: 0.003 });
    const terracotta = new THREE.MeshStandardMaterial({ color: 0x9c5a3c, roughness: 0.9, metalness: 0, bumpMap: bump, bumpScale: 0.004 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x2a251b, roughness: 0.5, metalness: 0.5 });
    const glassWin = new THREE.MeshPhysicalMaterial({ color: 0x13222b, metalness: 0, roughness: 0.06, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 2.0, reflectivity: 0.7 });
    const glassCore = new THREE.MeshPhysicalMaterial({ color: 0x35566a, metalness: 0, roughness: 0.03, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.6, reflectivity: 0.85 });
    const railGlass = new THREE.MeshPhysicalMaterial({ color: 0x30505e, metalness: 0, roughness: 0.08, transmission: 0.6, transparent: true, opacity: 0.6, ior: 1.4, envMapIntensity: 1.6 });
    const winGlow = new THREE.MeshStandardMaterial({ color: 0xffe0b0, emissive: 0xffb865, emissiveIntensity: 1.6, roughness: 0.4 });
    const led = new THREE.MeshStandardMaterial({ color: 0xffe9c4, emissive: 0xffc06a, emissiveIntensity: 2.3, roughness: 0.5 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xb08a3e, roughness: 0.24, metalness: 1, envMapIntensity: 1.6 });
    const goldGlow = new THREE.MeshStandardMaterial({ color: 0xffd79a, emissive: 0xf2be74, emissiveIntensity: 2.4, roughness: 0.4 });
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf3efe6, roughness: 0.16, metalness: 0.1, map: wrap(marbleTex(), 2), envMapIntensity: 1.4 });
    const stone = new THREE.MeshStandardMaterial({ color: 0x6f6752, roughness: 0.85, metalness: 0.06 });
    const copper = new THREE.MeshStandardMaterial({ color: 0xb5623a, roughness: 0.3, metalness: 0.9, envMapIntensity: 1.8 });
    const lawnMat = new THREE.MeshStandardMaterial({ map: wrap(lawnTex(), 16), roughness: 1, metalness: 0 });
    const paveMat = new THREE.MeshStandardMaterial({ map: wrap(paveTex(), 8), roughness: 0.8, metalness: 0.04 });
    const roadMat = new THREE.MeshStandardMaterial({ map: wrap(roadTex(), 4, 10), roughness: 0.72, metalness: 0.05 });
    const water = new THREE.MeshPhysicalMaterial({ color: 0x12333c, roughness: 0.05, metalness: 0, clearcoat: 1, envMapIntensity: 2.0 });
    const trunk = new THREE.MeshStandardMaterial({ color: 0x6a533a, roughness: 0.9, metalness: 0 });
    const palmMat = new THREE.MeshStandardMaterial({ color: 0x4c6b34, roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
    const foliage = new THREE.MeshStandardMaterial({ color: 0x566338, roughness: 0.92, metalness: 0 });
    const foliageLt = new THREE.MeshStandardMaterial({ color: 0x6d7a4c, roughness: 0.92, metalness: 0 });
    const bloomPink = new THREE.MeshStandardMaterial({ color: 0xc65a7a, roughness: 0.9 });
    const bloomOrange = new THREE.MeshStandardMaterial({ color: 0xd98a3c, roughness: 0.9 });
    const carBody = new THREE.MeshPhysicalMaterial({ color: 0x7a1f24, roughness: 0.25, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.6 });
    // interior
    const woodWall = new THREE.MeshStandardMaterial({ color: 0x5a3f28, roughness: 0.55, metalness: 0.05 });
    const greyWall = new THREE.MeshStandardMaterial({ color: 0x8a8681, roughness: 0.8, metalness: 0.02 });
    const rose = new THREE.MeshStandardMaterial({ color: 0xb5697a, roughness: 0.7, metalness: 0 });
    const cream = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.85, metalness: 0 });
    const curtain = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.95, metalness: 0 });
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x7c6742, roughness: 0.98, metalness: 0 });

    // irregular "lights on" pattern (~55% of units lit at dusk)
    const litOn = (i: number) => (Math.abs(Math.sin((i + 1) * 34.17)) * 91) % 10 < 5.5;

    // groups: complex = assembles; site = static ground/gate/landscape; interior = show flat
    const complex = new THREE.Group();
    const site = new THREE.Group();
    const interior = new THREE.Group();
    scene.add(complex, site, interior);

    const mk = (grp: THREE.Group) =>
      (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, shadow = true) => {
        const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
        m.castShadow = shadow; m.receiveShadow = shadow; grp.add(m); return m;
      };
    const addC = mk(complex), addS = mk(site), addI = mk(interior);
    const box = (add: ReturnType<typeof mk>) => (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, s = true) => add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, s);
    const rbox = (add: ReturnType<typeof mk>) => (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, r = 0.06, s = true) => add(new RoundedBoxGeometry(w, h, d, 5, Math.max(r, 0.05)), mat, x, y, z, s);
    const cbox = box(addC), sbox = box(addS), ibox = box(addI);
    const crbox = rbox(addC), srbox = rbox(addS), irbox = rbox(addI);

    const baseY = 0.4, fh = 0.86, lobbyH = 1.9;

    // ============ balcony-banded tower (left; the render's signature) ============
    const balconyTower = (cx: number, cz: number, w: number, d: number, floors: number) => {
      // ground lobby
      crbox(w, lobbyH, d, plasterWarm, cx, baseY + lobbyH / 2, cz, 0.05);
      cbox(w - 0.5, lobbyH - 0.6, 0.06, glassWin, cx, baseY + lobbyH / 2 - 0.1, cz + d / 2 + 0.01, false);
      cbox(w - 0.3, 0.16, 0.14, gold, cx, baseY + lobbyH - 0.2, cz + d / 2 + 0.05, false);
      cbox(0.5, lobbyH - 0.5, 0.12, goldGlow, cx + w / 2 - 0.5, baseY + (lobbyH - 0.4) / 2, cz + d / 2 + 0.03, false);

      const y0 = baseY + lobbyH;
      for (let f = 0; f < floors; f++) {
        const fy = y0 + f * fh;
        // white projecting floor slab (cantilevers on front + sides)
        cbox(w + 0.7, 0.13, d + 0.4, slabWhite, cx, fy, cz + 0.05, false);
        // warm LED strip under the slab front lip
        cbox(w + 0.7, 0.05, 0.05, led, cx, fy - 0.09, cz + d / 2 + 0.24, false);
        // tan wall set back behind the balcony
        cbox(w - 0.3, fh - 0.13, d - 0.3, f % 2 ? plaster : plasterWarm, cx, fy + fh / 2, cz - 0.15, true);
        // recessed glazing — many units lit warm at dusk
        cbox(w - 0.7, fh - 0.34, 0.05, litOn(f * 3) ? winGlow : glassWin, cx, fy + fh / 2, cz + d / 2 - 0.34, false);
        // glass balustrade on the slab front + gold cap
        cbox(w + 0.68, 0.42, 0.03, railGlass, cx, fy + 0.28, cz + d / 2 + 0.24, false);
        cbox(w + 0.68, 0.04, 0.06, gold, cx, fy + 0.5, cz + d / 2 + 0.24, false);
      }
      const topH = y0 + floors * fh;
      // reflective glazed stair/lift core on the front, offset to one side
      cbox(1.5, floors * fh + 0.4, 0.34, glassCore, cx + w * 0.16, y0 + (floors * fh) / 2, cz + d / 2 + 0.12, false);
      cbox(0.14, floors * fh + 0.4, 0.42, gold, cx + w * 0.16 - 0.82, y0 + (floors * fh) / 2, cz + d / 2 + 0.12, false);
      cbox(0.14, floors * fh + 0.4, 0.42, gold, cx + w * 0.16 + 0.82, y0 + (floors * fh) / 2, cz + d / 2 + 0.12, false);
      // full-height plaster end piers
      for (const dx of [-1, 1]) crbox(0.5, topH - baseY, d + 0.2, plaster, cx + dx * (w / 2 + 0.28), baseY + (topH - baseY) / 2, cz - 0.05, 0.05, true);
      // crown
      crbox(w + 0.9, 0.5, d + 0.7, slabWhite, cx, topH + 0.25, cz + 0.05, 0.05);
      cbox(w + 0.94, 0.06, d + 0.74, gold, cx, topH + 0.53, cz + 0.05, false);
      crbox(w * 0.45, 1.0, d * 0.45, plaster, cx - w * 0.2, topH + 0.5 + 0.5, cz, 0.05);
      return topH;
    };

    // ============ punched-window tower (right; set back) ============
    const gridTower = (cx: number, cz: number, w: number, d: number, floors: number) => {
      crbox(w, lobbyH, d, plasterWarm, cx, baseY + lobbyH / 2, cz, 0.05);
      cbox(w - 0.5, lobbyH - 0.6, 0.06, glassWin, cx, baseY + lobbyH / 2 - 0.1, cz + d / 2 + 0.01, false);
      const y0 = baseY + lobbyH;
      crbox(w, floors * fh, d, plaster, cx, y0 + (floors * fh) / 2, cz, 0.06, true);
      const cols = 4;
      for (let f = 0; f < floors; f++) {
        const fy = y0 + f * fh + fh / 2;
        for (let c2 = 0; c2 < cols; c2++) {
          const wx = cx - w / 2 + 0.55 + c2 * ((w - 1.1) / (cols - 1));
          const lit = litOn(f * 4 + c2);
          cbox(0.62, 0.62, 0.05, lit ? winGlow : glassWin, wx, fy, cz + d / 2 + 0.01, false);
          cbox(0.72, 0.72, 0.06, slabWhite, wx, fy, cz + d / 2 - 0.02, false); // window reveal
        }
        // thin shadow-line cornice each floor
        cbox(w + 0.1, 0.06, d + 0.1, slabWhite, cx, y0 + f * fh, cz, false);
      }
      const topH = y0 + floors * fh;
      crbox(w + 0.3, 0.5, d + 0.3, slabWhite, cx, topH + 0.25, cz, 0.05);
      cbox(w + 0.34, 0.06, d + 0.34, gold, cx, topH + 0.53, cz, false);
      return topH;
    };

    // ============ terracotta courtyard mid-rise (long bar) ============
    const midBlock = (cx: number, cz: number, w: number, d: number, floors: number, rot = 0) => {
      const g = new THREE.Group(); g.position.set(cx, 0, cz); g.rotation.y = rot; complex.add(g);
      const b = box(mk(g)); const rb = rbox(mk(g));
      rb(w, floors * fh + 0.5, d, terracotta, 0, baseY + (floors * fh) / 2, 0, 0.05, true);
      const unitW = 1.5, cols = Math.max(2, Math.round(w / unitW));
      for (let f = 0; f < floors; f++) {
        const fy = baseY + 0.5 + f * fh;
        b(w + 0.06, 0.12, d + 0.06, slabWhite, 0, fy, 0, false); // cream floor band
        for (let c2 = 0; c2 < cols; c2++) {
          const wx = -w / 2 + w / (2 * cols) + c2 * (w / cols);
          const lit = litOn(f * 6 + c2 + 2);
          b(0.7, 0.6, 0.05, lit ? winGlow : glassWin, wx, fy + fh / 2 + 0.1, d / 2 + 0.01, false);
        }
      }
      const h = baseY + 0.5 + floors * fh;
      b(w + 0.2, 0.28, d + 0.2, cream, 0, h + 0.1, 0, false); // parapet
      for (let i = 0; i < Math.round(w / 3); i++) b(1.0, 0.7, 1.0, cream, -w / 2 + 1.5 + i * 3, h + 0.5, 0, false); // rooftop boxes
    };

    // ---------- grounds ----------
    addS(new THREE.PlaneGeometry(500, 500).rotateX(-Math.PI / 2), lawnMat, 0, -0.02, 0, true);
    srbox(40, 0.4, 30, paveMat, 2, 0.2, -4, 0.05);           // podium / courtyard paving
    // reflecting pool + fountains court in front
    sbox(9, 0.08, 3, water, -3, 0.3, 8.6, false);
    sbox(9.5, 0.2, 3.5, stone, -3, 0.18, 8.6);
    for (let i = -3; i <= 3; i++) sbox(0.12, 0.5, 0.12, goldGlow, -3 + i * 1.3, 0.5, 8.6, false); // fountain jets

    // ---------- the cluster ----------
    balconyTower(-6.5, -2.5, 4.4, 3.2, 13);              // signature balcony tower
    gridTower(-0.6, -5.0, 4.0, 3.4, 13);                 // set-back grid tower
    midBlock(12, -4, 20, 3.6, 4, -0.06);                 // long courtyard block (right)
    midBlock(4, -15.5, 22, 3.6, 4, 0);                   // rear courtyard block

    // ============ grand entrance gate (portal + signage + water wall) ============
    const gate = () => {
      const gx = 4.5, gz = 6.2;
      // white portal frame
      srbox(0.7, 5.2, 1.4, slabWhite, gx - 3.2, 2.6, gz, 0.05);
      srbox(0.7, 3.2, 1.4, slabWhite, gx + 2.6, 1.6, gz, 0.05);
      srbox(6.6, 0.7, 1.4, slabWhite, gx - 0.3, 5.15, gz, 0.05);
      // gold reveal lines on the tall pier
      for (const oy of [-1.4, -0.9, -0.4]) sbox(0.06, 2.6, 0.05, gold, gx - 3.2 - 0.36, 2.9 + oy, gz + 0.4, false);
      // gold signage block
      srbox(2.6, 1.7, 0.2, plasterWarm, gx - 0.6, 2.2, gz + 0.72, 0.04);
      sbox(1.7, 0.34, 0.1, gold, gx - 0.6, 2.5, gz + 0.86, false);
      sbox(1.4, 0.22, 0.1, gold, gx - 0.6, 2.1, gz + 0.86, false);
      sbox(0.5, 0.5, 0.12, goldGlow, gx - 1.5, 2.55, gz + 0.84, false); // logo mark
      // marble water-feature wall with copper spouts + planting
      for (let i = 0; i < 4; i++) {
        const wx = gx + 1.8 + i * 1.7;
        srbox(1.4, 1.9, 0.3, marbleMat, wx, 1.35, gz - 0.6, 0.03);
        addS(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 20).rotateX(Math.PI / 2), copper, wx, 1.9, gz - 0.42, false);
        srbox(1.5, 0.7, 0.5, foliage, wx, 0.75, gz - 0.35, 0.08); // hedge base
        addS(new THREE.IcosahedronGeometry(0.3, 1), bloomPink, wx, 1.2, gz - 0.2, false);
      }
      // flower bed at the foot
      srbox(7, 0.3, 1.4, foliageLt, gx + 0.5, 0.45, gz + 0.9, 0.08);
      for (let i = 0; i < 12; i++) addS(new THREE.IcosahedronGeometry(0.12, 1), i % 2 ? bloomOrange : bloomPink, gx - 2.5 + i * 0.8, 0.66, gz + 0.9, false);
    };
    gate();

    // ---------- boulevard ----------
    addS(new THREE.PlaneGeometry(70, 8).rotateX(-Math.PI / 2), roadMat, 0, 0.01, 16.5, true);
    for (let i = -6; i <= 6; i++) sbox(1.2, 0.02, 0.16, slabWhite, i * 2.7, 0.03, 16.5, false); // lane dashes
    srbox(30, 0.34, 0.8, foliage, 0, 0.17, 13.8, 0.08); // planted median
    // palms + street lights along the median
    const palm = (x: number, z: number, s = 1) => {
      addS(new THREE.CylinderGeometry(0.1 * s, 0.16 * s, 3.2 * s, 8), trunk, x, 1.6 * s, z);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const fr = addS(new THREE.BoxGeometry(1.7 * s, 0.05, 0.4 * s), palmMat, x + Math.cos(a) * 0.8 * s, 3.2 * s, z + Math.sin(a) * 0.8 * s, false);
        fr.rotation.set(0.35, -a, 0.2);
      }
    };
    const streetLight = (x: number) => {
      addS(new THREE.CylinderGeometry(0.06, 0.09, 3.4, 10), frame, x, 1.7, 13.8);
      sbox(1.4, 0.08, 0.16, frame, x + 0.6, 3.4, 13.8, false);
      addS(new THREE.SphereGeometry(0.13, 14, 14), goldGlow, x + 1.2, 3.32, 13.8, false);
    };
    [-18, -9, 0, 9, 18].forEach((x) => { palm(x + 3, 13.8, 1); streetLight(x); });
    const car = (x: number, z: number, dir: number) => {
      srbox(1.9, 0.5, 0.9, carBody, x, 0.55, z, 0.16);
      srbox(1.0, 0.42, 0.82, glassWin, x - dir * 0.1, 0.92, z, 0.12, false);
      addS(new THREE.SphereGeometry(0.08, 12, 12), goldGlow, x + dir * 0.95, 0.5, z + 0.3, false);
      addS(new THREE.SphereGeometry(0.08, 12, 12), goldGlow, x + dir * 0.95, 0.5, z - 0.3, false);
    };
    car(-3, 16.4, 1);

    // ---------- landscaping ----------
    const tree = (x: number, z: number, s: number) => {
      addS(new THREE.CylinderGeometry(0.12 * s, 0.18 * s, 1.6 * s, 8), trunk, x, 0.8 * s, z);
      addS(new THREE.IcosahedronGeometry(1.0 * s, 2), foliage, x, 2.0 * s, z);
      addS(new THREE.IcosahedronGeometry(0.72 * s, 2), foliageLt, x - 0.5 * s, 1.7 * s, z + 0.3 * s, false);
    };
    tree(-13, 10, 1.15); tree(13, 11, 1.05); tree(-11, -12, 0.95);
    srbox(30, 0.55, 0.6, foliage, 2, 0.5, 10.6, 0.1); // courtyard hedge
    for (const px of [-9, -5, 8, 12]) { srbox(0.5, 0.5, 0.5, stone, px, 0.55, 9.6, 0.05); addS(new THREE.IcosahedronGeometry(0.34, 2), foliageLt, px, 1.0, 9.6, false); }

    // ============================================================
    //  FURNISHED SHOW FLAT — themed to the dining render.
    //  A glazed pavilion on the courtyard the camera flies into.
    // ============================================================
    const IX = -6.5, IY = 0, IZ = 8.4; // room centre (front-left, ground)
    const RW = 7.2, RD = 5.4, RH = 2.7;
    // shell (open toward +Z / the street so we can fly in)
    ibox(RW, 0.1, RD, marbleMat, IX, IY + 0.05, IZ);                 // marble floor
    ibox(RW, RH, 0.16, greyWall, IX, IY + RH / 2, IZ - RD / 2, false); // back wall
    ibox(0.16, RH, RD, woodWall, IX - RW / 2, IY + RH / 2, IZ, false); // left wood wall
    ibox(0.16, RH, RD, greyWall, IX + RW / 2, IY + RH / 2, IZ, false); // right wall
    ibox(RW, 0.14, RD, cream, IX, IY + RH, IZ, false);              // ceiling
    // cove LED perimeter
    ibox(RW - 0.4, 0.05, 0.08, led, IX, IY + RH - 0.16, IZ - RD / 2 + 0.3, false);
    ibox(0.08, 0.05, RD - 0.6, led, IX - RW / 2 + 0.3, IY + RH - 0.16, IZ, false);
    // recessed ceiling downlights
    for (const dx of [-2, 0, 2]) for (const dz of [-1.5, 1.5]) addI(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 14), goldGlow, IX + dx, IY + RH - 0.08, IZ + dz, false);
    // gold ring wall art on the back wall
    for (const rx of [-0.35, 0.35]) addI(new THREE.TorusGeometry(0.42, 0.05, 12, 32), gold, IX + rx, IY + 1.7, IZ - RD / 2 + 0.1, false);

    // -- dining set (marble table on gold pedestal, rose+gold chairs) --
    const dtX = IX + 0.2, dtZ = IZ - 0.9;
    ibox(2.6, 0.1, 1.3, marbleMat, dtX, 0.98, dtZ, false);          // table top
    ibox(1.2, 0.9, 0.5, gold, dtX, 0.5, dtZ, false);               // gold pedestal base
    const chair = (cx: number, cz: number, back: number) => {
      ibox(0.44, 0.08, 0.44, rose, cx, 0.5, cz, false);            // seat
      irbox(0.44, 0.5, 0.1, rose, cx, 0.78, cz + back * 0.2, 0.06, false); // curved back
      for (const dx of [-0.16, 0.16]) for (const dz of [-0.16, 0.16]) addI(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), gold, cx + dx, 0.25, cz + dz, false);
    };
    for (const cx of [dtX - 0.75, dtX + 0.05, dtX + 0.85]) { chair(cx, dtZ - 0.85, -1); chair(cx, dtZ + 0.85, 1); }
    // gold globe pendants over the table
    for (const px of [dtX - 0.9, dtX - 0.3, dtX + 0.3, dtX + 0.9]) {
      addI(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 6), frame, px, IY + RH - 0.45, dtZ, false);
      irbox(0.32, 0.08, 0.22, gold, px, IY + RH - 0.82, dtZ, 0.04, false); // wavy gold disc
      addI(new THREE.SphereGeometry(0.11, 16, 16), goldGlow, px, IY + RH - 1.0, dtZ, false); // glowing globe
    }
    // tall vase + pampas centrepiece
    addI(new THREE.CylinderGeometry(0.1, 0.06, 0.28, 16), cream, dtX, 1.15, dtZ, false);

    // -- living zone (cream sofa, rug, coffee table, curtains, window) --
    const lvZ = IZ + 1.4;
    ibox(3.0, 0.03, 2.0, rugMat, IX - 1.2, 0.06, lvZ, false);
    irbox(2.4, 0.4, 0.9, cream, IX - 1.2, 0.3, lvZ, 0.1, false);           // sofa seat
    irbox(2.4, 0.55, 0.24, cream, IX - 1.2, 0.55, lvZ - 0.45, 0.1, false); // sofa back
    for (const p of [[-0.7, 0x8a9a5b], [0.0, 0x7a2f38], [0.7, 0xe8e0d0]] as const) irbox(0.34, 0.34, 0.2, new THREE.MeshStandardMaterial({ color: p[1], roughness: 0.9 }), IX - 1.2 + p[0], 0.55, lvZ - 0.3, 0.06, false); // cushions
    irbox(1.1, 0.1, 0.6, marbleMat, IX - 1.2, 0.4, lvZ + 0.7, 0.03, false); // coffee table
    ibox(0.06, 0.4, 0.6, gold, IX - 1.75, 0.2, lvZ + 0.7, false);
    // curtains + city-view window on the left wood wall side (open bay toward +Z handled by shell opening)
    ibox(0.1, RH - 0.3, 1.6, curtain, IX - RW / 2 + 0.12, IY + (RH - 0.3) / 2, lvZ + 0.6, false);

    // -- kitchen hint (right side: counter + dark backsplash + warm LED) --
    const kX = IX + RW / 2 - 0.7;
    ibox(1.0, 0.9, RD - 1.2, new THREE.MeshStandardMaterial({ color: 0x3b3a37, roughness: 0.4, metalness: 0.2 }), kX, 0.45, IZ, false);
    ibox(1.0, 0.06, RD - 1.2, marbleMat, kX, 0.92, IZ, false);
    ibox(0.05, 1.0, RD - 1.4, new THREE.MeshStandardMaterial({ color: 0x241f1c, roughness: 0.3, metalness: 0.3 }), kX + 0.5, 1.5, IZ, false); // backsplash
    ibox(0.06, 0.04, RD - 1.6, led, kX + 0.46, 1.05, IZ, false); // under-cabinet LED
    // warm interior fill lights
    const iLightA = new THREE.PointLight(0xffdca6, 6, 9, 2); iLightA.position.set(IX, IY + 2.2, IZ - 0.5); interior.add(iLightA);
    const iLightB = new THREE.PointLight(0xffe6c0, 3.5, 8, 2); iLightB.position.set(IX - 1.2, IY + 1.8, lvZ); interior.add(iLightB);

    // soft contact shadow
    const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.ShadowMaterial({ opacity: 0.24 }));
    shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.position.y = 0.004; shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // ---------- assembly (only the towers/blocks in `complex`) ----------
    type Piece = { m: THREE.Mesh; fp: THREE.Vector3; ep: THREE.Vector3; fr: THREE.Euler; er: THREE.Euler };
    const pieces: Piece[] = [];
    const centre = new THREE.Vector3(-3, 9, -3);
    const rnd = (i: number, n: number) => { const x = Math.sin((i + 1) * n) * 43758.5453; return x - Math.floor(x); };
    let gi = 0;
    complex.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const wp = new THREE.Vector3(); m.getWorldPosition(wp);
      if (wp.y < 0.5) return;
      const i = gi++;
      const fp = m.position.clone();
      const dir = wp.clone().sub(centre); if (dir.length() < 0.01) dir.set(0, 1, 0); dir.normalize();
      const off = dir.multiplyScalar(6 + rnd(i, 12.9) * 16).add(new THREE.Vector3((rnd(i, 78.2) - 0.5) * 24, rnd(i, 3.7) * 18 + 4, (rnd(i, 11.1) - 0.5) * 24));
      const ep = fp.clone().add(off);
      pieces.push({ m, fp, ep, fr: m.rotation.clone(), er: new THREE.Euler((rnd(i, 1.1) - 0.5) * 1.4, (rnd(i, 2.2) - 0.5) * 2.0, (rnd(i, 3.3) - 0.5) * 1.4) });
      m.position.copy(ep); m.rotation.copy(pieces[pieces.length - 1].er);
    });
    let assembly = reduce || forceBuilt ? 1 : 0;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const applyAssembly = () => {
      const e = easeOut(assembly);
      for (const p of pieces) {
        p.m.position.lerpVectors(p.ep, p.fp, e);
        p.m.rotation.set(p.er.x + (p.fr.x - p.er.x) * e, p.er.y + (p.fr.y - p.er.y) * e, p.er.z + (p.fr.z - p.er.z) * e);
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
      // gentle bloom so lit windows / LED strips glow like the night render
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.4, 0.86));
      composer.addPass(new SMAAPass());
      composer.addPass(new OutputPass());
    }
    const renderFrame = () => (composer ? composer.render() : renderer.render(scene, camera));

    // ---------- orbit camera ----------
    type View = { target: THREE.Vector3; radius: number; az: number; pol: number };
    const VIEWS: Record<ViewKey, View> = {
      street: { target: new THREE.Vector3(-3, 6.5, -1), radius: 30, az: 0.16, pol: 1.4 },
      aerial: { target: new THREE.Vector3(0, 7.0, -3), radius: 46, az: -0.5, pol: 0.98 },
      inside: { target: new THREE.Vector3(IX, IY + 1.25, IZ), radius: 3.4, az: 0.0, pol: 1.46 },
    };
    let modeKey: ViewKey = forceView && VIEWS[forceView] ? forceView : "street";
    let mode: View = VIEWS[modeKey];
    const cur = { tx: mode.target.x, ty: mode.target.y, tz: mode.target.z, r: mode.radius, az: mode.az, pol: mode.pol };
    let tgt = { ...cur };
    const lookAt = new THREE.Vector3();
    const applyCamera = () => {
      camera.position.set(cur.tx + cur.r * Math.sin(cur.pol) * Math.sin(cur.az), cur.ty + cur.r * Math.cos(cur.pol), cur.tz + cur.r * Math.sin(cur.pol) * Math.cos(cur.az));
      lookAt.set(cur.tx, cur.ty, cur.tz); camera.lookAt(lookAt);
    };
    const setView = (v: View) => { tgt = { tx: v.target.x, ty: v.target.y, tz: v.target.z, r: v.radius, az: v.az, pol: v.pol }; };
    setView(mode); applyCamera();
    goToRef.current = (k: ViewKey) => { modeKey = k; mode = VIEWS[k]; setView(mode); };

    // ---------- HDRI environment + sky ----------
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    new RGBELoader().load("/hdri/sky_1k.hdr", (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      hdrTex = hdr; envRT = pmrem.fromEquirectangular(hdr);
      // keep the dusk gradient as the visible sky; use the HDRI only as dim IBL
      scene.environment = envRT.texture; scene.environmentIntensity = 0.45;
      pmrem.dispose(); renderFrame();
    }, undefined, () => pmrem.dispose());

    // ---------- interaction ----------
    let dragging = false, lastX = 0, lastY = 0;
    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; renderer.domElement.style.cursor = "grabbing"; renderer.domElement.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const inside = modeKey === "inside";
      tgt.az += (e.clientX - lastX) * (inside ? -0.006 : 0.007);
      tgt.pol = THREE.MathUtils.clamp(tgt.pol + (e.clientY - lastY) * 0.004, inside ? 1.25 : 0.5, inside ? 1.56 : 1.5);
      if (inside) tgt.az = THREE.MathUtils.clamp(tgt.az, -0.9, 0.9);
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => { dragging = false; renderer.domElement.style.cursor = "grab"; try { renderer.domElement.releasePointerCapture(e.pointerId); } catch {} };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // ---------- sizing ----------
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false); composer?.setSize(w, h);
      camera.aspect = w / h; camera.updateProjectionMatrix(); applyCamera(); renderFrame();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(mount);

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
      // SCROLL-TRACK assembly (same as the homepage villa): the section pins and
      // the towers converge as you scroll through the tall track. Completes at
      // ~88% so the finished cluster holds for a beat before the section releases.
      const track = scrollTrack || mount;
      const tr = track.getBoundingClientRect();
      const dist = Math.max(1, track.offsetHeight - window.innerHeight);
      let target = -tr.top / dist / 0.88;
      target = reduce || forceBuilt || modeKey !== "street" ? 1 : Math.max(0, Math.min(1, target));
      assembly += (target - assembly) * (1 - Math.exp(-7 * dt));
      if (!dragging && modeKey === "aerial") tgt.az += 0.05 * dt;
      const k = 1 - Math.exp(-6 * dt);
      cur.tx += (tgt.tx - cur.tx) * k; cur.ty += (tgt.ty - cur.ty) * k; cur.tz += (tgt.tz - cur.tz) * k;
      cur.r += (tgt.r - cur.r) * k; cur.az += (tgt.az - cur.az) * k; cur.pol += (tgt.pol - cur.pol) * k;
      applyAssembly(); applyCamera(); renderFrame();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh; mesh.geometry?.dispose?.();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose()); else m?.dispose?.();
      });
      hdrTex?.dispose(); envRT?.dispose(); composer?.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  const tabs: { k: ViewKey; label: string }[] = [
    { k: "street", label: "Street" },
    { k: "aerial", label: "Aerial" },
    { k: "inside", label: "Step inside" },
  ];

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-wrap items-center justify-center gap-2">
        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 p-1 backdrop-blur">
          {tabs.map((t) => (
            <button
              key={t.k}
              type="button"
              onClick={() => { setView(t.k); goToRef.current(t.k); }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                view === t.k ? "bg-[var(--color-gold)] text-white" : "text-[#efe7d7] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="pointer-events-none hidden items-center rounded-full border border-white/15 bg-black/30 px-4 py-2.5 text-xs font-medium text-[#efe7d7] backdrop-blur sm:inline-flex">
          Scroll to build it · drag to look · a 3D concept
        </span>
      </div>
    </>
  );
}
