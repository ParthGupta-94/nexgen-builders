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
 * A modern villa in Three.js rendered toward photoreal: HDRI image-based
 * lighting + sky, ground-truth ambient occlusion (GTAO), SMAA antialiasing,
 * reflective glass and PBR textures. Exterior orbit (auto-rotate + drag);
 * "Step inside" flies into an open-plan interior you can pan across.
 * Frame-rate-independent, pauses off-screen, respects reduced-motion.
 */
export function House3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const goToRef = useRef<(inside: boolean) => void>(() => {});
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      cursor: "grab",
      touchAction: "pan-y",
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc3ccd4); // until HDRI loads
    scene.fog = new THREE.Fog(0xc7cdd2, 30, 62);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    // ---------- procedural textures ----------
    const cv = (size = 256) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      return c;
    };
    const wrap = (t: THREE.Texture, r = 1) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(r, r);
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
      for (let i = 0; i < 3200; i++) {
        const g = 42 + Math.random() * 55;
        x.fillStyle = `rgb(${Math.round(g * 0.7)},${Math.round(g)},${Math.round(g * 0.5)})`;
        x.fillRect(Math.random() * 512, Math.random() * 512, 2, 3);
      }
      return new THREE.CanvasTexture(c);
    };
    const woodTex = (light = false) => {
      const c = cv(256), x = c.getContext("2d")!;
      x.fillStyle = light ? "#6d4c2b" : "#4a3420";
      x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 256; i += 32) {
        x.fillStyle = "rgba(0,0,0,0.16)";
        x.fillRect(0, i, 256, 2);
      }
      for (let i = 0; i < 1600; i++) {
        x.fillStyle = `rgba(${light ? "120,84,44" : "80,56,30"},${Math.random() * 0.22})`;
        x.fillRect(Math.random() * 256, Math.random() * 256, 20, 1);
      }
      return new THREE.CanvasTexture(c);
    };
    const paveTex = () => {
      const c = cv(256), x = c.getContext("2d")!;
      x.fillStyle = "#2c271e";
      x.fillRect(0, 0, 256, 256);
      x.strokeStyle = "rgba(0,0,0,0.45)";
      x.lineWidth = 3;
      for (let i = 0; i <= 256; i += 64) {
        x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 256); x.stroke();
        x.beginPath(); x.moveTo(0, i); x.lineTo(256, i); x.stroke();
      }
      return new THREE.CanvasTexture(c);
    };

    // HDRI is loaded after the composer is set up (see below).
    let hdrTex: THREE.Texture | null = null;
    let envRT: THREE.WebGLRenderTarget | null = null;

    // ---------- lighting (HDRI does ambient/fill; sun gives crisp shadows) ----------
    scene.add(new THREE.HemisphereLight(0xdfe8f0, 0x40492f, 0.25));
    const sun = new THREE.DirectionalLight(0xfff1d8, 2.6);
    sun.position.set(-8, 10, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 48;
    sun.shadow.camera.left = -13;
    sun.shadow.camera.right = 13;
    sun.shadow.camera.top = 13;
    sun.shadow.camera.bottom = -13;
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 5;
    scene.add(sun);
    const warmA = new THREE.PointLight(0xffd9a0, 4, 7, 2); warmA.position.set(-2.6, 1.5, -0.4); scene.add(warmA);
    const warmB = new THREE.PointLight(0xffd9a0, 3, 7, 2); warmB.position.set(0.4, 1.6, -1.0); scene.add(warmB);
    const warmC = new THREE.PointLight(0xffe0b0, 2.5, 6, 2); warmC.position.set(2.4, 1.6, -0.8); scene.add(warmC);

    // ---------- materials ----------
    const wallBump = wrap(noiseTex(128, 22), 3);
    const cream = new THREE.MeshStandardMaterial({ color: 0xe9dfc9, roughness: 0.92, metalness: 0, bumpMap: wallBump, bumpScale: 0.004, envMapIntensity: 1 });
    const creamDark = new THREE.MeshStandardMaterial({ color: 0xcdbe9f, roughness: 0.93, metalness: 0, bumpMap: wallBump, bumpScale: 0.004, envMapIntensity: 1 });
    const charcoal = new THREE.MeshStandardMaterial({ color: 0x35322b, roughness: 0.72, metalness: 0.12, bumpMap: wallBump, bumpScale: 0.004, envMapIntensity: 1 });
    const stone = new THREE.MeshStandardMaterial({ color: 0x211d17, roughness: 0.85, metalness: 0.05 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x15120d, roughness: 0.45, metalness: 0.5 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x0e1a22, metalness: 0, roughness: 0.03, ior: 1.5,
      clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2.2, reflectivity: 0.7,
    });
    const gold = new THREE.MeshStandardMaterial({ color: 0xb0873a, roughness: 0.22, metalness: 1, envMapIntensity: 2.0 });
    const goldGlow = new THREE.MeshStandardMaterial({ color: 0xffd79a, emissive: 0xf2be74, emissiveIntensity: 1.0, roughness: 0.4 });
    const woodFloor = new THREE.MeshStandardMaterial({ color: 0x6a4a2b, roughness: 0.45, metalness: 0.05, map: wrap(woodTex(), 4), envMapIntensity: 1 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x6b4a2a, roughness: 0.55, metalness: 0.05, map: wrap(woodTex(true), 2) });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x4a3420, roughness: 0.6, metalness: 0.05 });
    const fabric = new THREE.MeshStandardMaterial({ color: 0x8f7d64, roughness: 0.95, metalness: 0 });
    const fabricDark = new THREE.MeshStandardMaterial({ color: 0x6f5f49, roughness: 0.95, metalness: 0 });
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x7c6742, roughness: 0.98, metalness: 0 });
    const marble = new THREE.MeshStandardMaterial({ color: 0x2b2820, roughness: 0.18, metalness: 0.35, envMapIntensity: 1.6 });
    const lawnMat = new THREE.MeshStandardMaterial({ map: wrap(lawnTex(), 7), roughness: 1, metalness: 0 });
    const paveMat = new THREE.MeshStandardMaterial({ map: wrap(paveTex(), 3), roughness: 0.75, metalness: 0.05 });
    const water = new THREE.MeshPhysicalMaterial({ color: 0x123039, roughness: 0.04, metalness: 0, clearcoat: 1, envMapIntensity: 2.0 });
    const foliage = new THREE.MeshStandardMaterial({ color: 0x59663f, roughness: 0.92, metalness: 0 });
    const foliageLt = new THREE.MeshStandardMaterial({ color: 0x6d7a4c, roughness: 0.92, metalness: 0 });

    const villa = new THREE.Group();
    scene.add(villa);

    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, shadow = true) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = shadow;
      m.receiveShadow = shadow;
      villa.add(m);
      return m;
    };
    const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, s = true) =>
      add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, s);
    // smoother bevels: more segments + a slightly larger floor on the radius
    const rbox = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, r = 0.05, s = true) =>
      add(new RoundedBoxGeometry(w, h, d, 6, Math.max(r, 0.06)), mat, x, y, z, s);

    const windowZ = (w: number, h: number, x: number, y: number, z: number) => {
      box(w + 0.12, h + 0.12, 0.12, frame, x, y, z - 0.03, false);
      box(w, h, 0.05, glass, x, y, z, false);
    };
    const windowX = (w: number, h: number, x: number, y: number, z: number) => {
      box(0.12, h + 0.12, w + 0.12, frame, x - 0.03, y, z, false);
      box(0.05, h, w, glass, x, y, z, false);
    };

    // ============================================================
    //  Villa modelled on the reference photo (ref_a) via the
    //  img2threejs decomposition: recessed dark glazing between white
    //  end-piers, a deep wood-soffit cantilever, glass balustrade,
    //  flat roof parapet, right service pier + external stair, pool.
    // ============================================================
    const fx = 0;

    // ---------- grounds ----------
    add(new THREE.PlaneGeometry(80, 80).rotateX(-Math.PI / 2), lawnMat, 0, -0.02, -1, true);
    rbox(18, 0.32, 12, paveMat, 0, -0.05, 2.0, 0.03);   // stone deck / podium
    // pool in the foreground
    add(new THREE.BoxGeometry(9, 0.08, 4.2), water, -1.4, 0.06, 6.4, false);
    box(9.6, 0.16, 4.8, stone, -1.4, 0.0, 6.4);

    // ---------- ground floor (recessed glazed living) ----------
    const gy = 1.25, gh = 2.5;
    box(12, 0.12, 5.4, woodFloor, fx, 0.12, 0);                 // interior floor
    rbox(12, gh, 0.2, cream, fx, gy, -2.6, 0.05);              // back wall
    rbox(0.2, gh, 5.4, cream, fx - 6, gy, 0, 0.05);           // left wall
    rbox(0.2, gh, 5.4, charcoal, fx + 6, gy, 0, 0.05);        // right wall
    box(12, 0.16, 5.4, wood, fx, 2.5, 0);                      // warm WOOD ceiling soffit (ref_a)
    // dark recessed glazing + frame + vertical mullions
    box(10.2, 2.3, 0.06, glass, fx, gy, 2.3, false);
    box(10.4, gh, 0.04, frame, fx, gy, 2.25, false);
    for (let i = -4; i <= 4; i++) box(0.06, 2.3, 0.08, frame, fx + i * 1.13, gy, 2.35, false);
    // white end piers flanking the glazing (full height)
    rbox(1.0, 5.7, 0.9, cream, fx - 5.5, 2.85, 2.4, 0.05);
    rbox(1.2, 5.7, 0.9, cream, fx + 5.4, 2.85, 2.4, 0.05);
    // warm entrance
    box(1.2, 1.6, 0.12, wood, fx + 3.2, 0.8, 2.32, false);
    box(0.16, 1.2, 0.16, goldGlow, fx + 3.7, 0.74, 2.36, false);

    // ================= INTERIOR (open plan) =================
    box(3.0, 0.04, 2.4, rugMat, -2.0, 0.2, 1.0);
    rbox(2.4, 0.4, 1.0, fabric, -2.0, 0.4, 0.3, 0.1);
    rbox(2.4, 0.6, 0.22, fabric, -2.0, 0.62, -0.15, 0.1);
    rbox(0.22, 0.5, 1.0, fabricDark, -3.1, 0.5, 0.3, 0.08);
    rbox(0.22, 0.5, 1.0, fabricDark, -0.9, 0.5, 0.3, 0.08);
    rbox(1.0, 0.16, 0.8, fabricDark, -2.5, 0.5, 0.3, 0.07, false);
    rbox(1.0, 0.16, 0.8, fabricDark, -1.5, 0.5, 0.3, 0.07, false);
    rbox(1.3, 0.08, 0.7, wood, -2.0, 0.42, 1.2, 0.03);
    for (const sx of [-0.55, 0.55]) for (const sz of [-0.28, 0.28])
      box(0.05, 0.4, 0.05, gold, -2.0 + sx, 0.2, 1.2 + sz, false);
    box(0.05, 1.4, 0.05, gold, -3.2, 0.8, -0.4, false);
    add(new THREE.CylinderGeometry(0.18, 0.22, 0.28, 24), goldGlow, -3.2, 1.55, -0.4, false);
    box(0.05, 1.0, 1.6, gold, -3.9, 1.15, 0.4, false);
    box(0.03, 0.85, 1.4, marble, -3.86, 1.15, 0.4, false);
    rbox(1.9, 0.1, 1.0, wood, 0.5, 0.78, -1.1, 0.03);
    for (const sx of [-0.8, 0.8]) for (const sz of [-0.35, 0.35])
      box(0.08, 0.72, 0.08, woodDark, 0.5 + sx, 0.38, -1.1 + sz, false);
    const chair = (cx: number, cz: number, back: "n" | "s") => {
      box(0.44, 0.06, 0.44, woodDark, cx, 0.46, cz, false);
      for (const dx of [-0.18, 0.18]) for (const dz of [-0.18, 0.18])
        box(0.05, 0.46, 0.05, woodDark, cx + dx, 0.23, cz + dz, false);
      rbox(0.44, 0.5, 0.06, fabric, cx, 0.72, cz + (back === "n" ? -0.2 : 0.2), 0.04, false);
    };
    chair(0.0, -1.75, "n"); chair(1.0, -1.75, "n"); chair(0.0, -0.45, "s"); chair(1.0, -0.45, "s");
    add(new THREE.CylinderGeometry(0.05, 0.28, 0.3, 24), goldGlow, 0.5, 1.55, -1.1, false);
    box(0.02, 0.55, 0.02, gold, 0.5, 1.75, -1.1, false);
    rbox(0.75, 0.9, 3.2, wood, 2.75, 0.45, -0.7, 0.04);
    box(0.8, 0.06, 3.3, marble, 2.75, 0.93, -0.7, false);
    rbox(0.6, 0.7, 3.2, creamDark, 2.85, 1.55, -0.7, 0.04);
    rbox(0.5, 1.0, 0.9, marble, 1.7, 0.5, -0.9, 0.03);
    box(1.5, 0.08, 1.1, marble, 1.55, 1.0, -0.9, false);
    for (const sz of [-1.2, -0.6]) {
      add(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 20), fabric, 1.0, 0.7, sz, false);
      add(new THREE.CylinderGeometry(0.04, 0.04, 0.68, 16), gold, 1.0, 0.34, sz, false);
    }
    for (let i = 0; i < 7; i++) box(1.1, 0.14, 0.34, woodFloor, -3.0, 0.18 + i * 0.26, -2.0 + i * 0.34, false);
    box(0.05, 1.9, 0.05, gold, -2.5, 1.0, -1.9, false);
    box(0.05, 1.9, 0.05, gold, -2.5, 1.0, -0.2, false);
    box(0.05, 0.05, 2.0, gold, -2.5, 1.75, -1.05, false);

    // ================= UPPER FLOOR (deep cantilever) =================
    box(12.4, 0.4, 6.0, cream, fx, 2.78, 0.5, false);          // mid floor plate (cantilever edge)
    rbox(12, 2.5, 5.0, cream, fx, 4.1, -0.5, 0.08);            // cantilevered upper volume
    box(10.4, 0.16, 2.4, wood, fx, 2.9, 1.7, false);          // WOOD soffit under overhang (signature)
    windowZ(9.6, 1.5, fx, 4.15, 1.72);                         // upper dark window band
    for (let i = -4; i <= 4; i++) box(0.06, 1.5, 0.08, frame, fx + i * 1.06, 4.15, 1.78, false); // mullions
    windowX(2.6, 1.3, fx - 6.0, 4.1, -0.6);                   // side window
    box(10.0, 0.95, 0.05, glass, fx, 3.4, 2.5, false);        // glass balustrade
    box(10.1, 0.06, 0.09, frame, fx, 3.9, 2.5, false);       // balustrade top rail
    box(12.4, 0.5, 5.2, cream, fx, 5.45, -0.5, false);        // flat roof parapet
    box(12.5, 0.08, 5.3, frame, fx, 5.72, -0.5, false);      // coping line
    rbox(1.3, 7.2, 3.2, cream, fx + 5.9, 3.6, -0.4, 0.08);   // right service pier
    // external stair + steel railing (right)
    for (let i = 0; i < 7; i++)
      box(1.6, 0.14, 0.52, stone, fx + 7.0, 0.24 + i * 0.36, 3.6 - i * 0.52, false);
    box(0.06, 1.1, 3.9, frame, fx + 7.75, 1.35, 1.9, false);
    for (let i = 0; i < 4; i++)
      box(0.05, 0.05, 3.9, frame, fx + 7.75, 0.8 + i * 0.28, 1.9, false);

    // ================= LANDSCAPING (smooth foliage) =================
    const tree = (x: number, z: number, s: number) => {
      add(new THREE.CylinderGeometry(0.12 * s, 0.18 * s, 1.5 * s, 12), woodDark, x, 0.75 * s, z);
      add(new THREE.IcosahedronGeometry(0.95 * s, 2), foliage, x, 1.9 * s, z);
      add(new THREE.IcosahedronGeometry(0.7 * s, 2), foliageLt, x - 0.5 * s, 1.6 * s, z + 0.3 * s, false);
      add(new THREE.IcosahedronGeometry(0.62 * s, 2), foliage, x + 0.55 * s, 1.55 * s, z - 0.3 * s, false);
    };
    tree(-8.2, 1.5, 1.15);
    tree(9.2, -2.0, 0.9);
    rbox(0.6, 0.6, 5.0, foliage, -8.0, 0.3, -0.5, 0.12);      // side hedge
    rbox(5.0, 0.5, 0.55, foliageLt, 0, 0.25, -5.4, 0.12);     // rear hedge
    for (const px of [fx - 4.4, fx + 4.4]) {                   // entrance planters
      rbox(0.45, 0.45, 0.45, stone, px, 0.34, 3.3, 0.04);
      add(new THREE.IcosahedronGeometry(0.34, 2), foliageLt, px, 0.76, 3.3, false);
    }

    const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.26 }));
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = 0.14;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // ---------- post-processing (AO + AA) ----------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const gtao = new GTAOPass(scene, camera, 1, 1);
    gtao.output = GTAOPass.OUTPUT.Default;
    gtao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 1, thickness: 1, scale: 1, samples: 16 });
    composer.addPass(gtao);
    composer.addPass(new SMAAPass());
    composer.addPass(new OutputPass());

    // ---- orbit camera ----
    type View = { target: THREE.Vector3; radius: number; az: number; pol: number };
    const EXT: View = { target: new THREE.Vector3(0, 2.1, 1.2), radius: 24, az: -0.42, pol: 1.4 };
    const INT: View = { target: new THREE.Vector3(0.1, 1.1, -0.6), radius: 3.0, az: 0.0, pol: 1.44 };

    let mode: View = EXT;
    const cur = { tx: EXT.target.x, ty: EXT.target.y, tz: EXT.target.z, r: EXT.radius, az: EXT.az, pol: EXT.pol };
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
      tgt = { tx: v.target.x, ty: v.target.y, tz: v.target.z, r: v.radius, az: v === INT ? 0.0 : cur.az, pol: v.pol };
    };
    setView(EXT);
    applyCamera();
    goToRef.current = (goInside: boolean) => { mode = goInside ? INT : EXT; setView(mode); };

    const renderOnce = () => composer.render();

    // ---- HDRI environment + sky (async) ----
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
        renderOnce();
      },
      undefined,
      () => pmrem.dispose(),
    );

    // ---- interaction ----
    let dragging = false, lastX = 0, lastY = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const isInt = mode === INT;
      tgt.az += (e.clientX - lastX) * (isInt ? -0.006 : 0.008);
      tgt.pol = THREE.MathUtils.clamp(tgt.pol + (e.clientY - lastY) * 0.004, isInt ? 1.28 : 0.9, isInt ? 1.56 : 1.5);
      if (isInt) tgt.az = THREE.MathUtils.clamp(tgt.az, -0.95, 0.95);
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false; renderer.domElement.style.cursor = "grab";
      try { renderer.domElement.releasePointerCapture(e.pointerId); } catch {}
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // ---- sizing ----
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applyCamera();
      composer.render();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- loop ----
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(mount);
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!dragging && !reduce && mode === EXT) tgt.az += 0.09 * dt;
      const k = 1 - Math.exp(-6 * dt);
      cur.tx += (tgt.tx - cur.tx) * k; cur.ty += (tgt.ty - cur.ty) * k; cur.tz += (tgt.tz - cur.tz) * k;
      cur.r += (tgt.r - cur.r) * k; cur.az += (tgt.az - cur.az) * k; cur.pol += (tgt.pol - cur.pol) * k;
      applyCamera();
      composer.render();
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
      composer.dispose();
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
          onClick={() => { const next = !inside; setInside(next); goToRef.current(next); }}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
        >
          {inside ? "← Back outside" : "Step inside ↵"}
        </button>
        <span className="pointer-events-none hidden items-center rounded-full border border-white/15 bg-black/30 px-4 py-2.5 text-xs font-medium text-[#efe7d7] backdrop-blur sm:inline-flex">
          Drag to look around ↻
        </span>
      </div>
    </>
  );
}
