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

type ViewKey = "street" | "aerial" | "living" | "kitchen" | "bedroom";
const ROOMS: ViewKey[] = ["living", "kitchen", "bedroom"];

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
  const go = (k: ViewKey) => { setView(k); goToRef.current(k); };
  const inside = view === "living" || view === "kitchen" || view === "bedroom";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // pinned scroll-track (same mechanism as the homepage villa) drives assembly
    const scrollTrack = mount.closest<HTMLElement>("[data-scroll-track]");
    // dev-only visual-verification flags (inert without the query params)
    const q = new URLSearchParams(window.location.search);
    const forceBuilt = q.has("built");
    const forceView = q.get("view"); // string | null; mapped to a ViewKey below
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
    const walnutTex = () => {
      const c = cv(256), x = c.getContext("2d")!; x.fillStyle = "#5a3a22"; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 256; i += 32) { x.fillStyle = "rgba(0,0,0,0.5)"; x.fillRect(i, 0, 3, 256); } // vertical slat grooves
      for (let i = 0; i < 1400; i++) { x.fillStyle = `rgba(30,18,8,${Math.random() * 0.22})`; x.fillRect(Math.random() * 256, Math.random() * 256, 1, 18); } // grain
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
    const rose = new THREE.MeshStandardMaterial({ color: 0xb5697a, roughness: 0.7, metalness: 0 });
    const cream = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.85, metalness: 0 });
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x8a7150, roughness: 0.98, metalness: 0 });
    const whiteWall = new THREE.MeshStandardMaterial({ color: 0xefe9de, roughness: 0.92, metalness: 0 });
    const marbleFloor = new THREE.MeshStandardMaterial({ color: 0xd9d2c4, roughness: 0.12, metalness: 0.15, map: wrap(marbleTex(), 3), envMapIntensity: 1.6 });
    const featureGrey = new THREE.MeshStandardMaterial({ color: 0x9c9992, roughness: 0.3, metalness: 0.2, map: wrap(marbleTex(), 1.6), envMapIntensity: 1.3 });
    const walnut = new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.5, metalness: 0.06, map: wrap(walnutTex(), 1, 1) });
    const sofaFab = new THREE.MeshStandardMaterial({ color: 0xc0b7a4, roughness: 0.92, metalness: 0 });
    const sheer = new THREE.MeshStandardMaterial({ color: 0xece4d6, roughness: 0.95, metalness: 0, transparent: true, opacity: 0.5 });
    const metalBlk = new THREE.MeshStandardMaterial({ color: 0x1c1c1f, roughness: 0.5, metalness: 0.6 });
    const tvScreen = new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.2, metalness: 0.3 });
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x3f5a34, roughness: 0.85, metalness: 0, side: THREE.DoubleSide });
    const terra = new THREE.MeshStandardMaterial({ color: 0xa9764e, roughness: 0.85, metalness: 0 });

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
    //  FURNISHED SHOW FLAT — the REAL Golden Era flat (from the
    //  handover photos): polished beige-grey marble floor, white walls,
    //  a stepped tray ceiling with downlights, a grey-marble feature
    //  wall with a black cross-inlay, a walnut door, and a sliding
    //  balcony door with a Greek-key railing — then furnished with
    //  generated furniture. Camera flies in from the +Z (open) side.
    // ============================================================
    const IX = -6.5, IZ = 8.4;
    const RW = 8.0, RD = 6.6, RH = 2.9;
    const x0 = IX - RW / 2, x1 = IX + RW / 2, zBack = IZ - RD / 2, zFront = IZ + RD / 2;
    const dcX = IX + 1.0, dHalf = 1.5; // balcony door centre + half-width

    // -- shell: marble floor, white walls (back wall split around the door) --
    ibox(RW, 0.1, RD, marbleFloor, IX, 0.05, IZ);
    ibox(0.16, RH, RD, whiteWall, x0, RH / 2, IZ, false);            // left wall (TV feature)
    ibox(0.16, RH, RD, whiteWall, x1, RH / 2, IZ, false);            // right wall (walnut door)
    ibox((dcX - dHalf) - x0, RH, 0.16, whiteWall, (x0 + dcX - dHalf) / 2, RH / 2, zBack, false); // back wall L
    ibox(x1 - (dcX + dHalf), RH, 0.16, whiteWall, (x1 + dcX + dHalf) / 2, RH / 2, zBack, false); // back wall R
    ibox(2 * dHalf + 0.2, RH - 2.3, 0.16, whiteWall, dcX, (2.3 + RH) / 2, zBack, false);          // header over door

    // grey-marble feature wall on the left + black cross inlay
    ibox(0.06, 2.3, 3.6, featureGrey, x0 + 0.1, 1.35, IZ - 0.5, false);
    ibox(0.08, 0.12, 3.6, metalBlk, x0 + 0.12, 1.95, IZ - 0.5, false);
    ibox(0.08, 2.3, 0.12, metalBlk, x0 + 0.12, 1.35, IZ - 0.5, false);

    // -- stepped tray ceiling + downlights + cove LED --
    ibox(RW, 0.12, RD, whiteWall, IX, RH, IZ, false);
    ibox(RW - 1.6, 0.06, RD - 1.6, cream, IX, RH - 0.03, IZ, false);      // dropped centre panel
    for (const oz of [-(RD - 1.6) / 2, (RD - 1.6) / 2]) ibox(RW - 1.5, 0.02, 0.05, metalBlk, IX, RH - 0.16, IZ + oz, false); // shadow-gap reveal
    for (const oz of [-(RD - 1.6) / 2 - 0.06, (RD - 1.6) / 2 + 0.06]) ibox(RW - 1.6, 0.04, 0.05, led, IX, RH - 0.22, IZ + oz, false); // cove
    for (const dx of [-2.5, -0.85, 0.85, 2.5]) for (const dz of [-2, 0, 2]) addI(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 14), goldGlow, IX + dx, RH - 0.15, IZ + dz, false);

    // -- balcony: sliding glass door in the opening + Greek-key railing + view --
    ibox(2 * dHalf, 2.3, 0.06, frame, dcX, 1.15, zBack + 0.03, false);
    ibox(2 * dHalf - 0.16, 2.15, 0.04, glassWin, dcX, 1.15, zBack + 0.01, false);
    ibox(0.05, 2.15, 0.05, frame, dcX, 1.15, zBack + 0.02, false);        // door meeting stile
    ibox(2 * dHalf + 0.6, 0.1, 1.5, terra, dcX, 0.02, zBack - 0.75, false); // balcony slab (terracotta)
    const railZ = zBack - 1.45;
    ibox(2 * dHalf + 0.6, 0.06, 0.06, metalBlk, dcX, 1.0, railZ, false);  // top rail
    for (let i = 0; i <= 8; i++) ibox(0.04, 0.98, 0.04, metalBlk, dcX - dHalf - 0.2 + i * ((2 * dHalf + 0.4) / 8), 0.55, railZ, false); // balusters
    for (let i = 0; i < 4; i++) { const mx = dcX - 1.2 + i * 0.8; ibox(0.34, 0.05, 0.06, metalBlk, mx, 0.42, railZ, false); ibox(0.05, 0.34, 0.06, metalBlk, mx + 0.15, 0.55, railZ, false); } // Greek-key motif
    for (const sx of [dcX - dHalf - 0.05, dcX + dHalf + 0.05]) ibox(0.1, RH - 0.5, 0.7, sheer, sx, (RH - 0.5) / 2, zBack + 0.14, false); // sheer curtains
    // warm "evening city" glow beyond the balcony so the door reads as a view, not a black hole
    const viewGlow = new THREE.Mesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshStandardMaterial({ color: 0x223049, emissive: 0xc98a52, emissiveIntensity: 0.7, roughness: 1 }));
    viewGlow.position.set(dcX, 2.4, railZ - 3.0); interior.add(viewGlow);

    // -- walnut entrance door on the right wall --
    ibox(0.05, 2.2, 1.1, walnut, x1 - 0.08, 1.1, IZ + 1.7, false);
    addI(new THREE.CylinderGeometry(0.028, 0.028, 0.3, 10), metalBlk, x1 - 0.16, 1.1, IZ + 1.42, false); // handle

    // ===================== generated furniture =====================
    // TV wall: wall-mounted TV + walnut console + gold ring art
    ibox(0.05, 0.98, 1.8, tvScreen, x0 + 0.16, 1.55, IZ - 0.5, false);
    irbox(0.5, 0.5, 2.6, walnut, x0 + 0.36, 0.25, IZ - 0.5, 0.04, false);   // console
    ibox(0.54, 0.05, 2.6, marbleFloor, x0 + 0.36, 0.52, IZ - 0.5, false);   // console top
    for (const rz of [IZ - 2.1, IZ - 1.55]) addI(new THREE.TorusGeometry(0.32, 0.04, 12, 30), gold, x0 + 0.14, 2.35, rz, false);

    // L-sofa facing the TV wall
    const sX = IX + 0.5, sZ = IZ - 0.1;
    ibox(2.9, 0.02, 2.4, rugMat, sX - 0.7, 0.02, sZ, false);                // rug
    irbox(1.0, 0.42, 2.9, sofaFab, sX, 0.28, sZ, 0.1, false);               // seat (runs along z)
    irbox(0.35, 0.55, 2.9, sofaFab, sX + 0.5, 0.62, sZ, 0.1, false);        // backrest against +X? no — faces -X
    irbox(2.0, 0.42, 1.0, sofaFab, sX - 0.9, 0.28, sZ - 1.35, 0.1, false);  // chaise return
    for (const cz of [sZ - 0.9, sZ, sZ + 0.9]) irbox(0.5, 0.42, 0.5, cream, sX - 0.05, 0.6, cz, 0.08, false); // cushions
    // coffee table (marble top + gold frame)
    irbox(1.3, 0.08, 0.7, marbleFloor, sX - 0.85, 0.4, sZ, 0.03, false);
    for (const cx of [-0.55, 0.55]) for (const cz of [-0.28, 0.28]) ibox(0.04, 0.36, 0.04, gold, sX - 0.85 + cx, 0.2, sZ + cz, false);
    // floor lamp
    addI(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), gold, sX - 1.6, 0.75, sZ + 1.3, false);
    addI(new THREE.CylinderGeometry(0.17, 0.21, 0.3, 20), goldGlow, sX - 1.6, 1.62, sZ + 1.3, false);

    // dining set in the foreground (marble top, gold pedestal, rose-velvet chairs)
    const dtX = IX + 0.2, dtZ = zFront - 1.3;
    irbox(2.2, 0.1, 1.1, marbleFloor, dtX, 0.98, dtZ, 0.03, false);
    ibox(0.9, 0.88, 0.4, gold, dtX, 0.5, dtZ, false);
    const dchair = (cx: number, cz: number, back: number) => {
      irbox(0.42, 0.08, 0.42, rose, cx, 0.5, cz, 0.05, false);
      irbox(0.42, 0.46, 0.1, rose, cx, 0.75, cz + back * 0.18, 0.05, false);
      for (const ox of [-0.15, 0.15]) for (const oz of [-0.15, 0.15]) addI(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8), gold, cx + ox, 0.25, cz + oz, false);
    };
    for (const cx of [dtX - 0.7, dtX, dtX + 0.7]) { dchair(cx, dtZ - 0.75, -1); dchair(cx, dtZ + 0.75, 1); }
    for (const px of [dtX - 0.7, dtX, dtX + 0.7]) { // gold globe pendants
      addI(new THREE.CylinderGeometry(0.006, 0.006, 0.55, 6), frame, px, RH - 0.42, dtZ, false);
      addI(new THREE.SphereGeometry(0.1, 16, 16), goldGlow, px, RH - 0.78, dtZ, false);
    }
    addI(new THREE.CylinderGeometry(0.09, 0.05, 0.3, 14), cream, dtX, 1.16, dtZ, false); // vase

    // potted plants (tall fanning leaves, tucked into corners)
    const plant = (px: number, pz: number) => {
      addI(new THREE.CylinderGeometry(0.16, 0.12, 0.36, 12), walnut, px, 0.18, pz, false);       // pot
      addI(new THREE.CylinderGeometry(0.145, 0.145, 0.05, 12), plantMat, px, 0.37, pz, false);   // soil
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 2, lean = 0.16 + (i % 3) * 0.05, h = 0.8 + (i % 4) * 0.16;
        const l = addI(new THREE.BoxGeometry(0.08, h, 0.02), i % 2 ? plantMat : foliageLt, px + Math.cos(a) * 0.1, 0.37 + h / 2, pz + Math.sin(a) * 0.1, false);
        l.rotation.set(Math.sin(a) * lean, -a, Math.cos(a) * lean);
      }
    };
    plant(x1 - 0.55, zBack + 0.6); plant(x0 + 0.9, zFront - 0.7);

    // warm living-room fill lights
    const iLightA = new THREE.PointLight(0xffe2b4, 5, 11, 2); iLightA.position.set(IX, 2.4, IZ); interior.add(iLightA);
    const iLightB = new THREE.PointLight(0xffe6c0, 3, 8, 2); iLightB.position.set(sX - 0.7, 1.8, sZ); interior.add(iLightB);
    const iLightC = new THREE.PointLight(0xfff0d0, 2.6, 7, 2); iLightC.position.set(dtX, 2.1, dtZ); interior.add(iLightC);

    // ===================== KITCHEN — open modular kitchen (right of living) =====================
    const KX = 0.8, KZ = IZ, KW = 6.2, KD = RD;
    const kx1 = KX + KW / 2, kzBack = KZ - KD / 2;
    ibox(KW, 0.1, KD, marbleFloor, KX, 0.05, KZ);
    ibox(0.16, RH, KD, whiteWall, kx1, RH / 2, KZ, false);                    // right wall
    ibox(KW, RH, 0.16, whiteWall, KX, RH / 2, kzBack, false);                // back wall
    ibox(0.16, RH, KD, whiteWall, KX - KW / 2, RH / 2, KZ, false);           // wall shared with living
    ibox(KW, 0.12, KD, whiteWall, KX, RH, KZ, false);                        // ceiling
    ibox(KW - 1.4, 0.06, KD - 1.4, cream, KX, RH - 0.03, KZ, false);         // tray panel
    for (const dx of [-1.7, 0, 1.7]) for (const dz of [-1.7, 1.7]) addI(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 14), goldGlow, KX + dx, RH - 0.15, KZ + dz, false);
    // counter run along the back wall
    ibox(KW - 0.5, 0.85, 0.6, walnut, KX, 0.43, kzBack + 0.35, false);       // base cabinets
    ibox(KW - 0.4, 0.08, 0.66, marbleFloor, KX, 0.9, kzBack + 0.35, false);  // quartz worktop
    ibox(KW - 0.5, 1.0, 0.05, metalBlk, KX, 1.5, kzBack + 0.06, false);      // dark backsplash
    ibox(KW - 0.5, 0.55, 0.4, whiteWall, KX, 2.2, kzBack + 0.24, false);     // upper cabinets
    ibox(KW - 0.6, 0.04, 0.42, led, KX, 1.02, kzBack + 0.58, false);         // under-cabinet LED
    ibox(0.66, 0.03, 0.46, metalBlk, KX - 1.6, 0.95, kzBack + 0.35, false);  // cooktop
    ibox(0.9, 0.55, 0.45, whiteWall, KX - 1.6, 2.15, kzBack + 0.32, false);  // chimney hood
    ibox(0.5, 0.05, 0.36, cream, KX + 1.6, 0.94, kzBack + 0.35, false);      // sink basin
    addI(new THREE.CylinderGeometry(0.018, 0.018, 0.28, 10), gold, KX + 1.6, 1.06, kzBack + 0.5, false); // faucet
    // island + stools + pendants
    ibox(2.4, 0.9, 1.0, walnut, KX - 0.3, 0.45, KZ + 0.9, false);
    ibox(2.6, 0.08, 1.2, marbleFloor, KX - 0.3, 0.94, KZ + 0.9, false);
    for (const sx of [KX - 1.1, KX - 0.3, KX + 0.5]) { addI(new THREE.CylinderGeometry(0.17, 0.17, 0.09, 18), sofaFab, sx, 0.62, KZ + 1.7, false); addI(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 10), metalBlk, sx, 0.3, KZ + 1.7, false); }
    for (const px of [KX - 0.9, KX - 0.3, KX + 0.3]) { addI(new THREE.CylinderGeometry(0.005, 0.005, 0.5, 6), frame, px, RH - 0.4, KZ + 0.9, false); addI(new THREE.SphereGeometry(0.09, 16, 16), goldGlow, px, RH - 0.72, KZ + 0.9, false); }
    const kLight = new THREE.PointLight(0xffe6c0, 4.5, 11, 2); kLight.position.set(KX, 2.3, KZ + 0.4); interior.add(kLight);

    // ===================== BEDROOM (left of living) =====================
    const BX = -15.5, BZ = IZ, BW = 6.6, BD = RD;
    const bx0 = BX - BW / 2, bx1 = BX + BW / 2, bzBack = BZ - BD / 2;
    const bdcX = BX + 1.2, bdH = 1.4;
    ibox(BW, 0.1, BD, marbleFloor, BX, 0.05, BZ);
    ibox(0.16, RH, BD, whiteWall, bx1, RH / 2, BZ, false);                   // right wall
    ibox((bdcX - bdH) - bx0, RH, 0.16, whiteWall, (bx0 + bdcX - bdH) / 2, RH / 2, bzBack, false); // back-left
    ibox(bx1 - (bdcX + bdH), RH, 0.16, whiteWall, (bx1 + bdcX + bdH) / 2, RH / 2, bzBack, false); // back-right
    ibox(2 * bdH + 0.2, RH - 2.3, 0.16, whiteWall, bdcX, (2.3 + RH) / 2, bzBack, false);          // header
    ibox(BW, 0.12, BD, whiteWall, BX, RH, BZ, false);
    ibox(BW - 1.4, 0.06, BD - 1.4, cream, BX, RH - 0.03, BZ, false);
    for (const dx of [-1.8, 0, 1.8]) for (const dz of [-1.8, 1.8]) addI(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 14), goldGlow, BX + dx, RH - 0.15, BZ + dz, false);
    // grey-marble feature wall behind the bed (left) + black cross inlay
    ibox(0.06, 2.4, 3.2, featureGrey, bx0 + 0.1, 1.3, BZ - 0.2, false);
    ibox(0.08, 0.12, 3.2, metalBlk, bx0 + 0.12, 1.95, BZ - 0.2, false);
    ibox(0.08, 2.4, 0.12, metalBlk, bx0 + 0.12, 1.3, BZ - 0.2, false);
    // bed (head against the feature wall, extends +X)
    const bedX = bx0 + 1.5;
    ibox(0.16, 1.2, 2.2, sofaFab, bx0 + 0.22, 0.7, BZ - 0.2, false);         // upholstered headboard
    ibox(2.2, 0.3, 2.2, walnut, bedX, 0.2, BZ - 0.2, false);                 // platform base
    ibox(2.1, 0.22, 2.0, cream, bedX, 0.46, BZ - 0.2, false);               // mattress
    irbox(1.5, 0.16, 2.1, sofaFab, bedX + 0.3, 0.62, BZ - 0.2, 0.05, false); // duvet fold
    for (const pz of [BZ - 0.75, BZ + 0.35]) irbox(0.7, 0.22, 0.5, cream, bx0 + 0.85, 0.62, pz, 0.08, false); // pillows
    for (const pz of [BZ - 1.45, BZ + 1.05]) { ibox(0.5, 0.45, 0.5, walnut, bx0 + 0.6, 0.22, pz, false); addI(new THREE.CylinderGeometry(0.1, 0.14, 0.24, 16), goldGlow, bx0 + 0.6, 0.6, pz, false); } // nightstands + lamps
    irbox(0.6, 0.35, 1.8, sofaFab, bedX + 1.55, 0.18, BZ - 0.2, 0.05, false); // bench at foot
    ibox(3.4, 0.02, 3.0, rugMat, bedX + 0.4, 0.02, BZ - 0.2, false);          // rug
    // sliding-mirror wardrobe on the right wall
    ibox(0.12, 2.4, 3.4, walnut, bx1 - 0.14, 1.2, BZ + 0.2, false);
    for (const wz of [BZ - 1.2, BZ - 0.1, BZ + 1.0]) ibox(0.05, 2.2, 1.0, glassCore, bx1 - 0.22, 1.2, wz, false); // tinted mirror panels
    // balcony door + Greek-key railing + view glow + curtains
    ibox(2 * bdH, 2.3, 0.06, frame, bdcX, 1.15, bzBack + 0.03, false);
    ibox(2 * bdH - 0.16, 2.15, 0.04, glassWin, bdcX, 1.15, bzBack + 0.01, false);
    ibox(2 * bdH + 0.6, 0.1, 1.4, terra, bdcX, 0.02, bzBack - 0.7, false);
    const bRailZ = bzBack - 1.4;
    ibox(2 * bdH + 0.6, 0.06, 0.06, metalBlk, bdcX, 1.0, bRailZ, false);
    for (let i = 0; i <= 8; i++) ibox(0.04, 0.98, 0.04, metalBlk, bdcX - bdH - 0.2 + i * ((2 * bdH + 0.4) / 8), 0.55, bRailZ, false);
    for (let i = 0; i < 4; i++) { const mx = bdcX - 1.1 + i * 0.75; ibox(0.32, 0.05, 0.06, metalBlk, mx, 0.42, bRailZ, false); ibox(0.05, 0.32, 0.06, metalBlk, mx + 0.14, 0.55, bRailZ, false); }
    for (const sx of [bdcX - bdH - 0.05, bdcX + bdH + 0.05]) ibox(0.1, RH - 0.5, 0.7, sheer, sx, (RH - 0.5) / 2, bzBack + 0.14, false);
    const bViewGlow = new THREE.Mesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshStandardMaterial({ color: 0x223049, emissive: 0xc98a52, emissiveIntensity: 0.7, roughness: 1 }));
    bViewGlow.position.set(bdcX, 2.4, bRailZ - 3.0); interior.add(bViewGlow);
    ibox(0.05, 2.2, 1.1, walnut, bx1 - 0.12, 1.1, BZ + 1.95, false);         // walnut door
    const bLight = new THREE.PointLight(0xffe2b4, 4.5, 11, 2); bLight.position.set(BX, 2.3, BZ); interior.add(bLight);
    const bLight2 = new THREE.PointLight(0xffcf9a, 2, 5, 2); bLight2.position.set(bx0 + 0.6, 0.7, BZ - 1.45); interior.add(bLight2);

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
      living: { target: new THREE.Vector3(IX + 0.3, 1.5, IZ - 0.4), radius: 4.4, az: 0.5, pol: 1.42 },
      kitchen: { target: new THREE.Vector3(KX - 0.2, 1.4, KZ + 0.3), radius: 4.3, az: -0.55, pol: 1.42 },
      bedroom: { target: new THREE.Vector3(BX + 0.4, 1.3, BZ - 0.2), radius: 4.5, az: 0.7, pol: 1.44 },
    };
    const fv = (forceView === "inside" ? "living" : forceView) as ViewKey | null;
    let modeKey: ViewKey = fv && VIEWS[fv] ? fv : "street";
    let mode: View = VIEWS[modeKey];
    const cur = { tx: mode.target.x, ty: mode.target.y, tz: mode.target.z, r: mode.radius, az: mode.az, pol: mode.pol };
    let tgt = { ...cur };
    const lookAt = new THREE.Vector3();
    const applyCamera = () => {
      camera.position.set(cur.tx + cur.r * Math.sin(cur.pol) * Math.sin(cur.az), cur.ty + cur.r * Math.cos(cur.pol), cur.tz + cur.r * Math.sin(cur.pol) * Math.cos(cur.az));
      lookAt.set(cur.tx, cur.ty, cur.tz); camera.lookAt(lookAt);
    };
    const setView = (v: View) => { tgt = { tx: v.target.x, ty: v.target.y, tz: v.target.z, r: v.radius, az: v.az, pol: v.pol }; };
    // show only the interior when "inside", only the complex when outside — so
    // exterior landscaping never intrudes into the room and the room box never
    // clutters the street/aerial views.
    const applyVis = () => {
      const inside = ROOMS.includes(modeKey);
      interior.visible = inside;
      complex.visible = !inside;
      site.visible = !inside;
    };
    const snapCamera = () => {
      cur.tx = tgt.tx; cur.ty = tgt.ty; cur.tz = tgt.tz; cur.r = tgt.r; cur.az = tgt.az; cur.pol = tgt.pol; applyCamera();
    };
    setView(mode); applyCamera(); applyVis();
    goToRef.current = (k: ViewKey) => {
      // snap when either side is an interior room (crossing in/out, or room→room);
      // only street↔aerial glide.
      const crossing = ROOMS.includes(k) || ROOMS.includes(modeKey);
      modeKey = k; mode = VIEWS[k]; setView(mode); applyVis();
      if (crossing) snapCamera();
    };

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
      const inside = ROOMS.includes(modeKey);
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
    { k: "living", label: "Step inside" },
  ];
  const rooms: { k: ViewKey; label: string }[] = [
    { k: "living", label: "Living" },
    { k: "kitchen", label: "Kitchen" },
    { k: "bedroom", label: "Bedroom" },
  ];
  const pill = "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200";

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center gap-2">
        {inside && (
          <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-[var(--color-gold)]/40 bg-black/45 p-1 backdrop-blur">
            {rooms.map((r) => (
              <button key={r.k} type="button" onClick={() => go(r.k)}
                className={`${pill} ${view === r.k ? "bg-[var(--color-gold)] text-white" : "text-[#efe7d7] hover:text-white"}`}>
                {r.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 p-1 backdrop-blur">
            {tabs.map((t) => (
              <button key={t.label} type="button" onClick={() => go(t.k)}
                className={`${pill} ${(t.k === "living" ? inside : view === t.k) ? "bg-[var(--color-gold)] text-white" : "text-[#efe7d7] hover:text-white"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <span className="pointer-events-none hidden items-center rounded-full border border-white/15 bg-black/30 px-4 py-2.5 text-xs font-medium text-[#efe7d7] backdrop-blur sm:inline-flex">
            {inside ? "Drag to look around · a 3D concept" : "Scroll to build it · drag to look · a 3D concept"}
          </span>
        </div>
      </div>
    </>
  );
}
