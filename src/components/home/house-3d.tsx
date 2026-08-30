"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * A stylized modern villa in Three.js, matched to the NexGen palette.
 * Exterior orbit with auto-rotate + drag; a "Step inside" button flies the
 * camera into a furnished interior. Pauses when off-screen / tab hidden,
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

    // ---- renderer ----
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      cursor: "grab",
      touchAction: "pan-y",
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    // ---- environment (soft reflections for glass + gold) ----
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
    key.position.set(6, 10, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 40;
    key.shadow.camera.left = -9;
    key.shadow.camera.right = 9;
    key.shadow.camera.top = 9;
    key.shadow.camera.bottom = -9;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9a24a, 0.5);
    rim.position.set(-7, 4, -6);
    scene.add(rim);
    // warm interior glow (also lights the room when inside)
    const interiorLight = new THREE.PointLight(0xffcf8f, 6, 8, 2);
    interiorLight.position.set(-0.2, 1.3, -0.2);
    scene.add(interiorLight);

    // ---- materials ----
    const M = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(o);
    const cream = M({ color: 0xece2cf, roughness: 0.8, metalness: 0.04 });
    const creamDark = M({ color: 0xd6c8ad, roughness: 0.82, metalness: 0.04 });
    const stone = M({ color: 0x2a241b, roughness: 0.85, metalness: 0.06 });
    const glass = M({ color: 0x0e0c08, roughness: 0.06, metalness: 0.9, envMapIntensity: 1.4 });
    const gold = M({ color: 0xb0873a, roughness: 0.28, metalness: 1.0, envMapIntensity: 1.3 });
    const goldGlow = M({ color: 0xffd79a, emissive: 0xf2be74, emissiveIntensity: 1.1, roughness: 0.4 });
    const woodFloor = M({ color: 0x5c4128, roughness: 0.55, metalness: 0.05 });
    const wood = M({ color: 0x6b4a2a, roughness: 0.65, metalness: 0.05 });
    const fabric = M({ color: 0x8f7d64, roughness: 0.95, metalness: 0 });
    const fabricDark = M({ color: 0x6f5f49, roughness: 0.95, metalness: 0 });
    const rugMat = M({ color: 0x7c6742, roughness: 0.95, metalness: 0 });
    const foliage = M({ color: 0x5f6b4a, roughness: 0.9, metalness: 0 });
    const grass = M({ color: 0x3f4630, roughness: 0.95, metalness: 0 });

    const villa = new THREE.Group();
    scene.add(villa);

    const add = (
      geo: THREE.BufferGeometry, mat: THREE.Material,
      x: number, y: number, z: number, shadow = true,
    ) => {
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
    box(16, 0.2, 14, grass, 0, -0.2, -1);
    box(9, 0.32, 8, stone, 0, -0.06, 0); // podium
    // pathway + driveway
    box(1.6, 0.05, 5, creamDark, -1.4, 0.11, 4.2);
    // reflective pool
    box(3.2, 0.06, 1.4, glass, 1.9, 0.06, 3.1);
    box(3.4, 0.12, 1.6, stone, 1.9, 0.02, 3.1);

    // ---------- ground floor (a real room: walls + glass front) ----------
    const gy = 0.9, gh = 1.7;
    box(4.6, 0.12, 3.4, woodFloor, 0, 0.12, 0); // interior floor
    box(4.6, gh, 0.16, cream, 0, gy, -1.62); // back wall
    box(0.16, gh, 3.4, creamDark, -2.22, gy, 0); // left wall
    box(0.16, gh, 3.4, stone, 2.22, gy, 0); // right wall
    box(4.6, 0.16, 3.4, creamDark, 0, 1.74, 0); // floor plate (ceiling of ground)
    // glass facade (front) with mullions + door gap
    box(2.9, 1.5, 0.06, glass, -0.55, gy, 1.6);
    for (let i = -1; i <= 2; i++) box(0.06, 1.5, 0.09, gold, -0.55 + i * 0.72, gy, 1.63, false);
    box(0.1, 1.5, 3.4, gold, -2.05, gy, 0, false); // corner fin
    // entrance (right of glass)
    box(0.95, 1.35, 0.12, wood, 1.4, 0.7, 1.6, false);
    box(0.14, 1.0, 0.14, goldGlow, 1.78, 0.62, 1.66, false);

    // gold fascia band between floors
    box(4.75, 0.1, 3.55, gold, 0, 1.78, 0, false);

    // ---------- interior furniture ----------
    // rug
    box(2.8, 0.04, 2.0, rugMat, -0.3, 0.2, 0.1);
    // sofa (faces the window)
    box(2.2, 0.35, 0.95, fabric, -0.4, 0.4, -0.95);
    box(2.2, 0.55, 0.22, fabric, -0.4, 0.62, -1.35);
    box(0.22, 0.5, 0.95, fabricDark, -1.4, 0.5, -0.95);
    box(0.22, 0.5, 0.95, fabricDark, 0.6, 0.5, -0.95);
    box(0.95, 0.16, 0.7, fabricDark, -0.85, 0.5, -0.95, false); // cushions
    box(0.95, 0.16, 0.7, fabricDark, 0.05, 0.5, -0.95, false);
    // coffee table (wood slab + gold legs)
    box(1.2, 0.07, 0.6, wood, -0.4, 0.42, -0.05);
    for (const sx of [-0.5, 0.5]) for (const sz of [-0.25, 0.25])
      box(0.05, 0.38, 0.05, gold, -0.4 + sx, 0.2, -0.05 + sz, false);
    // floor lamp (with light)
    box(0.05, 1.3, 0.05, gold, 1.7, 0.75, -1.1, false);
    add(new THREE.CylinderGeometry(0.18, 0.22, 0.28, 20), goldGlow, 1.7, 1.5, -1.1, false);
    const lampLight = new THREE.PointLight(0xffd9a0, 3, 4, 2);
    lampLight.position.set(1.7, 1.45, -1.1);
    scene.add(lampLight);
    // framed art on back wall
    box(1.4, 0.9, 0.05, gold, -0.9, 1.05, -1.53, false);
    box(1.25, 0.75, 0.02, stone, -0.9, 1.05, -1.5, false);
    // sideboard against right wall
    box(0.4, 0.6, 1.8, wood, 2.0, 0.42, -0.2);

    // ---------- upper floor (cantilevered) + balcony ----------
    box(3.6, 1.5, 2.9, creamDark, 0.6, 2.6, -0.2);
    box(1.3, 1.5, 2.2, stone, -1.75, 2.6, 0.2);
    box(3.7, 0.1, 3.0, gold, 0.6, 3.36, -0.2, false); // roof trim
    // big picture window upstairs
    box(2.7, 1.05, 0.06, glass, 0.6, 2.62, 1.28);
    for (let i = -1; i <= 1; i++) box(0.05, 1.05, 0.09, gold, 0.6 + i * 0.9, 2.62, 1.31, false);
    // balcony slab + gold railing
    box(3.2, 0.1, 0.9, stone, 0.6, 1.9, 1.9);
    box(3.2, 0.05, 0.05, gold, 0.6, 2.45, 2.3, false);
    for (let i = 0; i <= 10; i++) box(0.03, 0.55, 0.03, gold, 0.6 - 1.55 + i * 0.31, 2.2, 2.3, false);

    // ---------- landscaping ----------
    box(0.55, 0.5, 3.0, foliage, -3.4, 0.3, 0.4); // hedge
    box(2.4, 0.45, 0.5, foliage, -1.6, 0.28, -3.4);
    // a tree
    add(new THREE.CylinderGeometry(0.12, 0.16, 1.4, 10), wood, 3.7, 0.75, -2.6);
    add(new THREE.IcosahedronGeometry(0.8, 0), foliage, 3.7, 1.9, -2.6);
    add(new THREE.IcosahedronGeometry(0.6, 0), foliage, 3.3, 1.6, -2.2);
    add(new THREE.IcosahedronGeometry(0.55, 0), foliage, 4.1, 1.55, -2.8);
    // planters flanking entrance
    for (const px of [0.85, 1.95]) {
      box(0.35, 0.35, 0.35, stone, px, 0.28, 1.9);
      add(new THREE.IcosahedronGeometry(0.28, 0), foliage, px, 0.62, 1.9, false);
    }

    // shadow catcher
    const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.34 }));
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.09;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // ---- orbit camera model ----
    type View = { target: THREE.Vector3; radius: number; az: number; pol: number };
    const EXT: View = { target: new THREE.Vector3(0, 1.05, 0), radius: 11, az: -0.6, pol: 1.12 };
    const INT: View = { target: new THREE.Vector3(-0.3, 0.9, -0.5), radius: 2.1, az: 0.0, pol: 1.42 };

    let mode: View = EXT; // start outside
    const cur = { tx: EXT.target.x, ty: EXT.target.y, tz: EXT.target.z, r: EXT.radius, az: EXT.az, pol: EXT.pol };
    let tgt = { ...cur };
    const lookAt = new THREE.Vector3();

    const applyCamera = () => {
      const st = cur;
      const x = st.tx + st.r * Math.sin(st.pol) * Math.sin(st.az);
      const y = st.ty + st.r * Math.cos(st.pol);
      const z = st.tz + st.r * Math.sin(st.pol) * Math.cos(st.az);
      camera.position.set(x, y, z);
      lookAt.set(st.tx, st.ty, st.tz);
      camera.lookAt(lookAt);
    };

    const setView = (v: View) => {
      tgt = { tx: v.target.x, ty: v.target.y, tz: v.target.z, r: v.radius, az: cur.az, pol: v.pol };
      // keep azimuth continuous, but snap interior to a pleasant angle
      tgt.az = v === INT ? 0.0 : cur.az;
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
      tgt.pol = THREE.MathUtils.clamp(tgt.pol + (e.clientY - lastY) * 0.005, isInt ? 1.25 : 0.75, isInt ? 1.62 : 1.4);
      if (isInt) tgt.az = THREE.MathUtils.clamp(tgt.az, -0.7, 0.7);
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

    // ---- loop ----
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(mount);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      if (!dragging && !reduce && mode === EXT) tgt.az += 0.0016;
      const k = 0.075;
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
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-3">
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
