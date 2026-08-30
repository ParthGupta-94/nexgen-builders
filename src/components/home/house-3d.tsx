"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * A stylized modern villa in Three.js, matched to the NexGen palette.
 * Exterior orbit (auto-rotate + drag); a "Step inside" button flies the camera
 * into an open-plan interior — living, dining, kitchen and a staircase — that
 * you can pan across. Frame-rate-independent, pauses off-screen / tab hidden,
 * respects reduced-motion, repaints on resize. Placeholder for a real model.
 */
export function House3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const goToRef = useRef<(inside: boolean) => void>(() => {});
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      cursor: "grab",
      touchAction: "pan-y",
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = env.texture;
      pmrem.dispose();
    } catch {
      /* env is a nicety; ignore if unavailable */
    }

    // ---- lighting ----
    scene.add(new THREE.HemisphereLight(0xfbf6ec, 0x241d14, 0.7));
    const key = new THREE.DirectionalLight(0xfff2d6, 2.0);
    key.position.set(7, 11, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 45;
    key.shadow.camera.left = -11;
    key.shadow.camera.right = 11;
    key.shadow.camera.top = 11;
    key.shadow.camera.bottom = -11;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 3;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9a24a, 0.5);
    rim.position.set(-8, 4, -7);
    scene.add(rim);
    // warm interior lights (per zone)
    const lampLight = new THREE.PointLight(0xffd9a0, 4, 6, 2);
    lampLight.position.set(-2.6, 1.5, -0.4);
    scene.add(lampLight);
    const diningLight = new THREE.PointLight(0xffd9a0, 4, 6, 2);
    diningLight.position.set(0.4, 1.6, -1.0);
    scene.add(diningLight);
    const kitchenLight = new THREE.PointLight(0xffe0b0, 2.5, 5, 2);
    kitchenLight.position.set(2.4, 1.6, -0.8);
    scene.add(kitchenLight);

    // ---- materials ----
    const M = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(o);
    const cream = M({ color: 0xece2cf, roughness: 0.8, metalness: 0.04 });
    const creamDark = M({ color: 0xd6c8ad, roughness: 0.82, metalness: 0.04 });
    const stone = M({ color: 0x2a241b, roughness: 0.85, metalness: 0.06 });
    const glass = M({ color: 0x0e0c08, roughness: 0.06, metalness: 0.9, envMapIntensity: 1.4 });
    const gold = M({ color: 0xb0873a, roughness: 0.28, metalness: 1.0, envMapIntensity: 1.3 });
    const goldGlow = M({ color: 0xffd79a, emissive: 0xf2be74, emissiveIntensity: 1.0, roughness: 0.4 });
    const woodFloor = M({ color: 0x5c4128, roughness: 0.55, metalness: 0.05 });
    const wood = M({ color: 0x6b4a2a, roughness: 0.65, metalness: 0.05 });
    const woodDark = M({ color: 0x4a3420, roughness: 0.6, metalness: 0.05 });
    const fabric = M({ color: 0x8f7d64, roughness: 0.95, metalness: 0 });
    const fabricDark = M({ color: 0x6f5f49, roughness: 0.95, metalness: 0 });
    const rugMat = M({ color: 0x7c6742, roughness: 0.95, metalness: 0 });
    const marble = M({ color: 0x2b2820, roughness: 0.25, metalness: 0.3, envMapIntensity: 1.1 });
    const foliage = M({ color: 0x5f6b4a, roughness: 0.9, metalness: 0 });
    const grass = M({ color: 0x3f4630, roughness: 0.95, metalness: 0 });

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

    // ---------- grounds ----------
    box(22, 0.2, 18, grass, 0, -0.2, -1);
    box(13, 0.32, 10, stone, 0, -0.06, 0.2); // podium
    box(2.0, 0.05, 6, creamDark, -2.4, 0.11, 5.6); // driveway
    box(3.4, 0.06, 1.6, glass, 3.0, 0.06, 4.4); // pool
    box(3.6, 0.12, 1.8, stone, 3.0, 0.02, 4.4);

    // ---------- ground floor shell (open-plan room) ----------
    const fx = -0.4; // interior centre x
    box(7.2, 0.12, 5.0, woodFloor, fx, 0.12, 0); // floor
    box(7.2, 1.95, 0.16, cream, fx, 1.0, -2.5); // back wall
    box(0.16, 1.95, 5.0, creamDark, fx - 3.55, 1.0, 0); // left wall
    box(0.16, 1.95, 5.0, stone, fx + 3.55, 1.0, 0); // right wall
    box(7.3, 0.16, 5.0, creamDark, fx, 1.98, 0); // ceiling / upper floor plate
    // glass facade (front) + mullions, leaving the far right for the entrance
    box(5.4, 1.75, 0.06, glass, fx - 0.5, 1.0, 2.46);
    for (let i = -3; i <= 3; i++) box(0.06, 1.75, 0.09, gold, fx - 0.5 + i * 0.78, 1.0, 2.49, false);
    box(0.12, 1.95, 5.0, gold, fx - 3.45, 1.0, 0, false); // corner fin
    // entrance
    box(1.0, 1.5, 0.12, wood, fx + 2.9, 0.77, 2.46, false);
    box(0.14, 1.1, 0.14, goldGlow, fx + 3.32, 0.72, 2.5, false);
    // fascia band
    box(7.5, 0.1, 5.15, gold, fx, 2.02, 0, false);

    // ================= INTERIOR ZONES =================
    // ---- living area (left / front) ----
    box(3.0, 0.04, 2.4, rugMat, -2.0, 0.2, 1.0);
    box(2.4, 0.4, 1.0, fabric, -2.0, 0.4, 0.3);           // sofa seat
    box(2.4, 0.6, 0.22, fabric, -2.0, 0.62, -0.15);       // backrest
    box(0.22, 0.5, 1.0, fabricDark, -3.1, 0.5, 0.3);      // arm
    box(0.22, 0.5, 1.0, fabricDark, -0.9, 0.5, 0.3);      // arm
    box(1.0, 0.16, 0.8, fabricDark, -2.5, 0.5, 0.3, false);
    box(1.0, 0.16, 0.8, fabricDark, -1.5, 0.5, 0.3, false);
    box(1.3, 0.08, 0.7, wood, -2.0, 0.42, 1.2);           // coffee table
    for (const sx of [-0.55, 0.55]) for (const sz of [-0.28, 0.28])
      box(0.05, 0.4, 0.05, gold, -2.0 + sx, 0.2, 1.2 + sz, false);
    box(0.05, 1.4, 0.05, gold, -3.2, 0.8, -0.4, false);   // floor lamp pole
    add(new THREE.CylinderGeometry(0.18, 0.22, 0.28, 20), goldGlow, -3.2, 1.55, -0.4, false);
    // art on left wall
    box(0.04, 1.0, 1.6, gold, -3.9, 1.15, 0.4, false);
    box(0.02, 0.85, 1.4, marble, -3.86, 1.15, 0.4, false);

    // ---- dining area (centre / back) ----
    box(1.9, 0.1, 1.0, wood, 0.5, 0.78, -1.1);            // table top
    for (const sx of [-0.8, 0.8]) for (const sz of [-0.35, 0.35])
      box(0.08, 0.72, 0.08, woodDark, 0.5 + sx, 0.38, -1.1 + sz, false);
    // chairs
    const chair = (cx: number, cz: number, back: "n" | "s") => {
      box(0.44, 0.06, 0.44, woodDark, cx, 0.46, cz, false);
      for (const dx of [-0.18, 0.18]) for (const dz of [-0.18, 0.18])
        box(0.05, 0.46, 0.05, woodDark, cx + dx, 0.23, cz + dz, false);
      box(0.44, 0.5, 0.06, fabric, cx, 0.72, cz + (back === "n" ? -0.2 : 0.2), false);
    };
    chair(0.0, -1.75, "n"); chair(1.0, -1.75, "n");
    chair(0.0, -0.45, "s"); chair(1.0, -0.45, "s");
    // pendant over table
    add(new THREE.CylinderGeometry(0.05, 0.28, 0.3, 18), goldGlow, 0.5, 1.55, -1.1, false);
    box(0.02, 0.55, 0.02, gold, 0.5, 1.75, -1.1, false);

    // ---- kitchen (right / back) ----
    box(0.75, 0.9, 3.2, wood, 2.75, 0.45, -0.7);          // base cabinets (right wall run)
    box(0.8, 0.06, 3.3, marble, 2.75, 0.93, -0.7, false); // counter top
    box(0.6, 0.7, 3.2, creamDark, 2.85, 1.55, -0.7);      // upper cabinets
    box(0.5, 1.0, 0.9, marble, 1.7, 0.5, -0.9);           // island
    box(1.5, 0.08, 1.1, marble, 1.55, 1.0, -0.9, false);  // island top overhang
    // bar stools at island
    for (const sz of [-1.2, -0.6]) {
      add(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16), fabric, 1.0, 0.7, sz, false);
      add(new THREE.CylinderGeometry(0.04, 0.04, 0.68, 12), gold, 1.0, 0.34, sz, false);
    }

    // ---- staircase (back-left, rising toward the upper floor) ----
    for (let i = 0; i < 7; i++) {
      box(1.1, 0.14, 0.34, woodFloor, -3.0, 0.18 + i * 0.26, -2.0 + i * 0.34, false);
    }
    box(0.05, 1.9, 0.05, gold, -2.5, 1.0, -1.9, false);   // railing posts
    box(0.05, 1.9, 0.05, gold, -2.5, 1.0, -0.2, false);
    box(0.05, 0.05, 2.0, gold, -2.5, 1.75, -1.05, false); // rail

    // ================= UPPER FLOOR (exterior) =================
    box(5.4, 1.7, 4.2, creamDark, 0.9, 2.9, -0.2);        // main upper volume
    box(2.0, 1.7, 3.0, stone, -2.8, 2.9, 0.3);            // side volume
    box(5.5, 0.12, 4.3, gold, 0.9, 3.82, -0.2, false);    // roof trim
    box(4.0, 1.15, 0.06, glass, 0.9, 2.95, 1.94);         // upstairs picture window
    for (let i = -2; i <= 2; i++) box(0.05, 1.15, 0.09, gold, 0.9 + i * 0.9, 2.95, 1.97, false);
    // balcony + railing
    box(4.6, 0.12, 1.1, stone, 0.9, 2.1, 2.6);
    box(4.6, 0.05, 0.05, gold, 0.9, 2.7, 3.1, false);
    for (let i = 0; i <= 14; i++) box(0.03, 0.6, 0.03, gold, 0.9 - 2.25 + i * 0.32, 2.4, 3.1, false);

    // ---------- landscaping ----------
    box(0.6, 0.55, 4.0, foliage, -5.0, 0.32, 0.5);        // hedge
    box(3.4, 0.5, 0.55, foliage, -1.8, 0.3, -4.6);
    add(new THREE.CylinderGeometry(0.14, 0.18, 1.6, 10), wood, 5.2, 0.85, -3.4);
    add(new THREE.IcosahedronGeometry(1.0, 0), foliage, 5.2, 2.2, -3.4);
    add(new THREE.IcosahedronGeometry(0.7, 0), foliage, 4.6, 1.85, -2.9);
    add(new THREE.IcosahedronGeometry(0.65, 0), foliage, 5.7, 1.8, -3.7);
    for (const px of [fx + 2.3, fx + 3.4]) {
      box(0.38, 0.38, 0.38, stone, px, 0.3, 2.8);
      add(new THREE.IcosahedronGeometry(0.3, 0), foliage, px, 0.66, 2.8, false);
    }

    // shadow catcher
    const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.32 }));
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.09;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // ---- orbit camera ----
    type View = { target: THREE.Vector3; radius: number; az: number; pol: number };
    const EXT: View = { target: new THREE.Vector3(0, 1.2, 0), radius: 15, az: -0.6, pol: 1.12 };
    const INT: View = { target: new THREE.Vector3(0.1, 0.95, -0.6), radius: 2.9, az: 0.0, pol: 1.44 };

    let mode: View = EXT;
    const cur = { tx: EXT.target.x, ty: EXT.target.y, tz: EXT.target.z, r: EXT.radius, az: EXT.az, pol: EXT.pol };
    let tgt = { ...cur };
    const lookAt = new THREE.Vector3();

    const applyCamera = () => {
      const x = cur.tx + cur.r * Math.sin(cur.pol) * Math.sin(cur.az);
      const y = cur.ty + cur.r * Math.cos(cur.pol);
      const z = cur.tz + cur.r * Math.sin(cur.pol) * Math.cos(cur.az);
      camera.position.set(x, y, z);
      lookAt.set(cur.tx, cur.ty, cur.tz);
      camera.lookAt(lookAt);
    };
    const setView = (v: View) => {
      tgt = { tx: v.target.x, ty: v.target.y, tz: v.target.z, r: v.radius, az: v === INT ? 0.0 : cur.az, pol: v.pol };
    };
    setView(EXT);
    applyCamera();

    goToRef.current = (goInside: boolean) => {
      mode = goInside ? INT : EXT;
      setView(mode);
    };

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
      tgt.pol = THREE.MathUtils.clamp(tgt.pol + (e.clientY - lastY) * 0.004, isInt ? 1.28 : 0.8, isInt ? 1.56 : 1.4);
      if (isInt) tgt.az = THREE.MathUtils.clamp(tgt.az, -0.95, 0.95); // pan across the zones
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
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applyCamera();
      renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    renderer.render(scene, camera);

    // ---- loop (frame-rate independent) ----
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) {
        clock.getDelta();
        return;
      }
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!dragging && !reduce && mode === EXT) tgt.az += 0.11 * dt;
      const k = 1 - Math.exp(-6 * dt); // smooth, refresh-rate independent
      cur.tx += (tgt.tx - cur.tx) * k;
      cur.ty += (tgt.ty - cur.ty) * k;
      cur.tz += (tgt.tz - cur.tz) * k;
      cur.r += (tgt.r - cur.r) * k;
      cur.az += (tgt.az - cur.az) * k;
      cur.pol += (tgt.pol - cur.pol) * k;
      applyCamera();
      renderer.render(scene, camera);
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
      scene.environment?.dispose?.();
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
          onClick={() => {
            const next = !inside;
            setInside(next);
            goToRef.current(next);
          }}
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
