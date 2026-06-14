'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import Lenis from 'lenis';
import { projects } from '@/lib/projects';

const SECTION_NAMES = [
  'Introduction',
  'Approach',
  ...projects.map((p) => p.title),
  'Statement',
  'About',
  'Contact',
];

export default function Experience() {
  const canvasRef = useRef(null);
  const uiRef = useRef(null);
  const loaderRef = useRef(null);
  const railFillRef = useRef(null);
  const cueRef = useRef(null);
  const secLabelRef = useRef(null);
  const blackoutRef = useRef(null);
  const audioRef = useRef(null);
  const soundBtnRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ASSETS = projects.map((p) => p.hero);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.useLegacyLights = true; // keep classic intensity scaling

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0165);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 400);

    // lighting
    scene.add(new THREE.HemisphereLight(0x3a3a3a, 0x000000, 0.55));
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(14, 26, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const d = 70;
    const sc = key.shadow.camera;
    sc.left = -d; sc.right = d; sc.top = d; sc.bottom = -d; sc.near = 1; sc.far = 120;
    key.shadow.bias = -0.0004; key.shadow.radius = 4;
    scene.add(key); scene.add(key.target);
    key.target.position.set(0, 0, -55);

    // materials
    const concrete = (tone, rough = 0.96) =>
      new THREE.MeshStandardMaterial({ color: tone, roughness: rough, metalness: 0.0 });
    const matFloor = new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.78, metalness: 0.0 });
    const tones = [0x141414, 0x1b1b1b, 0x222222, 0x2a2a2a, 0x333333, 0x404040];

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 260), matFloor);
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -60); floor.receiveShadow = true;
    scene.add(floor);

    const slabGeo = new THREE.BoxGeometry(1, 1, 1);
    function slab(x, h, z, w = 3, depth = 0.8, tone) {
      const m = new THREE.Mesh(slabGeo, concrete(tone ?? tones[Math.abs(Math.round(z)) % tones.length]));
      m.position.set(x, h / 2, z); m.scale.set(w, h, depth);
      m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
    }
    const projZ = [-16, -32, -48, -66, -84, -102];
    for (let z = 14; z >= -110; z -= 4.4) {
      const nearNiche = projZ.some((pz) => Math.abs(pz - z) < 2.6);
      const h = 7.5 + Math.sin(z * 0.7) * 1.6 + (Math.abs(z) % 9) * 0.12;
      if (!nearNiche) slab(6.4, h, z, 3.0, 0.8);
      else slab(6.9, Math.max(h, 9.5), z, 2.6, 1.4, 0x121212);
      const hl = 7.0 + Math.cos(z * 0.6) * 1.7 + (Math.abs(z + 2) % 7) * 0.13;
      if (!nearNiche) slab(-6.4, hl, z, 3.0, 0.8);
      else slab(-6.9, Math.max(hl, 9.5), z, 2.6, 1.4, 0x121212);
    }

    slab(7.2, 12, 12, 3.4, 3.4, 0x161616);
    slab(-7.2, 12, 12, 3.4, 3.4, 0x161616);

    // opening monument: a single clean monolith with a vertical slit of light
    const monument = new THREE.Mesh(slabGeo, concrete(0x101010));
    monument.position.set(0, 6, -4); monument.scale.set(5.2, 12, 2.2);
    monument.castShadow = true; monument.receiveShadow = true; scene.add(monument);
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 12, 2.4), concrete(0x000000, 1));
    slit.position.set(0, 6, -3.9); scene.add(slit);

    const beamMat = concrete(0x161616);
    for (let z = 8; z >= -108; z -= 11) {
      const b = new THREE.Mesh(slabGeo, beamMat);
      b.position.set(0, 9.2, z); b.scale.set(13, 0.5, 1.0);
      b.castShadow = true; scene.add(b);
    }

    const endWall = new THREE.Mesh(slabGeo, concrete(0x141414));
    endWall.position.set(0, 7, -127); endWall.scale.set(15, 14, 1.2);
    endWall.castShadow = true; endWall.receiveShadow = true; scene.add(endWall);
    (function engrave() {
      const c = document.createElement('canvas'); c.width = 1400; c.height = 420;
      const x = c.getContext('2d');
      x.fillStyle = '#141414'; x.fillRect(0, 0, c.width, c.height);
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = '300 120px sans-serif';
      x.fillStyle = '#0c0c0c'; x.fillText('AMNA PERVEZ', 700, 150);
      x.fillStyle = '#2c2c2c'; x.fillText('AMNA PERVEZ', 700, 148.5);
      x.font = 'italic 300 56px serif';
      x.fillStyle = '#0c0c0c'; x.fillText('Architecture as Atmosphere', 700, 270);
      x.fillStyle = '#262626'; x.fillText('Architecture as Atmosphere', 700, 268.7);
      const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
      const p = new THREE.Mesh(new THREE.PlaneGeometry(13, 3.9),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0 }));
      p.position.set(0, 7.2, -126.35); scene.add(p);
    })();
    const graze = new THREE.SpotLight(0xffffff, 0, 40, 0.7, 0.7, 1.2);
    graze.position.set(7, 11, -118); graze.target.position.set(0, 7, -127);
    scene.add(graze); scene.add(graze.target);

    // textures
    const mgr = new THREE.LoadingManager();
    const loadTex = new THREE.TextureLoader(mgr);
    function tex(url) { const t = loadTex.load(url); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }


    // framed renders in niches
    const frames = [];
    projects.forEach((proj, i) => {
      const z = projZ[i]; const right = i % 2 === 0;
      const wx = right ? 6.9 : -6.9;
      const fx = right ? 5.55 : -5.55;
      const rotY = right ? -Math.PI / 2 : Math.PI / 2;
      const t = tex(ASSETS[i]);
      const baseW = 3.6;
      const mat = new THREE.MeshStandardMaterial({
        map: t, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.12,
        color: 0x000000, roughness: 1, metalness: 0,
      });
      const img = new THREE.Mesh(new THREE.PlaneGeometry(baseW, baseW * 0.66), mat);
      img.position.set(fx, 3.4, z); img.rotation.y = rotY; scene.add(img);
      const im = new Image();
      im.onload = () => { const a = im.height / im.width; img.geometry.dispose(); img.geometry = new THREE.PlaneGeometry(baseW, baseW * a); };
      im.src = ASSETS[i];
      const border = new THREE.Mesh(new THREE.BoxGeometry(baseW + 0.4, baseW * 0.66 + 0.4, 0.12), concrete(0x080808, 1));
      border.position.set(right ? wx - 0.62 : wx + 0.62, 3.4, z); border.rotation.y = rotY; scene.add(border);
      const sp = new THREE.SpotLight(0xffffff, 0, 16, 0.55, 0.65, 1.3);
      sp.position.set(right ? 2.5 : -2.5, 7, z + 0.4); sp.target.position.set(fx, 3.0, z);
      scene.add(sp); scene.add(sp.target);
      frames.push({ mesh: img, mat, z, spot: sp });
    });

    // courtyard (about)
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), new THREE.MeshStandardMaterial({ color: 0x262626, roughness: 0.7 }));
    pad.rotation.x = -Math.PI / 2; pad.position.set(13, 0.02, -124); pad.receiveShadow = true; scene.add(pad);
    slab(13, 9, -134, 18, 0.8, 0x161616);
    slab(22.4, 9, -124, 0.8, 18, 0x161616);
    const courtBlock = new THREE.Mesh(slabGeo, concrete(0x1c1c1c));
    courtBlock.position.set(18, 3, -130); courtBlock.scale.set(2.2, 6, 2.2);
    courtBlock.castShadow = true; courtBlock.receiveShadow = true; scene.add(courtBlock);
    const pSpot = new THREE.SpotLight(0xffffff, 0, 30, 0.7, 0.7, 1.2);
    pSpot.position.set(9, 11, -122); pSpot.target.position.set(16, 2, -130);
    scene.add(pSpot); scene.add(pSpot.target);

    // dust
    const dustN = 900, dpos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) { dpos[i * 3] = (Math.random() - 0.5) * 22; dpos[i * 3 + 1] = Math.random() * 10; dpos[i * 3 + 2] = 8 - Math.random() * 145; }
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
    const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x9a9a9a, size: 0.035, transparent: true, opacity: 0.4, depthWrite: false }));
    scene.add(dust);

    // camera stations
    const S = [
      { c: [0, 5.6, 50], t: [0, 5.4, -4] },
      { c: [0, 2.7, 24], t: [0, 3.6, -16] },
      { c: [0.7, 2.95, -11], t: [5.4, 3.4, -16] },
      { c: [-0.7, 2.95, -27], t: [-5.4, 3.4, -32] },
      { c: [0.7, 2.95, -43], t: [5.4, 3.4, -48] },
      { c: [-0.7, 2.95, -61], t: [-5.4, 3.4, -66] },
      { c: [0.7, 2.95, -79], t: [5.4, 3.4, -84] },
      { c: [-0.7, 2.95, -97], t: [-5.4, 3.4, -102] },
      { c: [0, 3.4, -112], t: [0, 7.1, -126] },
      { c: [8.2, 2.9, -119], t: [16.5, 2.6, -130] },
      { c: [5, 13.5, -116], t: [-2, 5, -134] },
    ].map((s) => ({ c: new THREE.Vector3(...s.c), t: new THREE.Vector3(...s.t) }));

    const camPos = new THREE.Vector3().copy(S[0].c);
    const camTar = new THREE.Vector3().copy(S[0].t);
    const tmpC = new THREE.Vector3(), tmpT = new THREE.Vector3();
    const smooth = (x) => x * x * (3 - 2 * x);
    const N = S.length - 1;

    let target = 0, prog = 0;
    function readScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    window.addEventListener('scroll', readScroll, { passive: true });
    readScroll();

    const panelEls = uiRef.current ? [...uiRef.current.querySelectorAll('.panel')] : [];
    const panels = panelEls.map((el) => ({ el, anchor: +el.dataset.anchor / N }));
    const rail = railFillRef.current ? railFillRef.current.parentElement : null;
    if (rail) panels.forEach((p) => { const tk = document.createElement('div'); tk.className = 'tick'; tk.style.top = p.anchor * 100 + '%'; rail.appendChild(tk); });

    function setPlateVis() {
      const show = window.innerWidth < 860;
      panelEls.forEach((el) => el.querySelectorAll('.plate').forEach((im) => (im.style.display = show ? 'block' : 'none')));
    }
    setPlateVis();

    // smooth scroll
    const lenis = REDUCED ? null : new Lenis({ duration: 1.15, smoothWheel: true });

    let lastSec = -1, clock = 0, raf = 0;
    function frame(time) {
      if (lenis) lenis.raf(time);
      clock++;
      readScroll();
      const ease = REDUCED ? 0.18 : 0.055;
      prog += (target - prog) * ease;

      const seg = prog * N; let i = Math.floor(seg); if (i >= N) i = N - 1; const f = smooth(seg - i);
      tmpC.lerpVectors(S[i].c, S[i + 1].c, f);
      tmpT.lerpVectors(S[i].t, S[i + 1].t, f);
      if (!REDUCED) { tmpC.x += Math.sin(clock * 0.004) * 0.1; tmpC.y += Math.sin(clock * 0.0031) * 0.07; }
      camPos.lerp(tmpC, 0.5); camTar.lerp(tmpT, 0.5);
      camera.position.copy(camPos); camera.lookAt(camTar);

      frames.forEach((fr) => {
        const dz = Math.abs(camera.position.z - fr.z);
        const k = Math.max(0, 1 - dz / 13);
        fr.spot.intensity = 7.5 * k * k;
        fr.mat.emissiveIntensity = 0.12 + 0.95 * Math.pow(k, 1.5);
      });
      graze.intensity = 22 * Math.max(0, 1 - Math.abs(prog - panels[8].anchor) / 0.1);
      pSpot.intensity = 1.0 + 4.0 * Math.max(0, 1 - Math.abs(prog - panels[9].anchor) / 0.1);

      let active = 0, best = 1;
      panels.forEach((p, idx) => {
        const dd = Math.abs(prog - p.anchor);
        const w = idx === 0 ? 0.045 : 0.05;
        let o = smooth(Math.max(0, 1 - dd / w));
        p.el.style.opacity = o;
        const inner = p.el.firstElementChild;
        const base = p.el.classList.contains('center') ? 'translate(-50%,-46%)'
          : p.el.classList.contains('contact') ? 'translate(-50%,-50%)'
          : p.el.classList.contains('about') ? 'translate(-50%,-50%)' : '';
        inner.style.transform = base + ` translateY(${(1 - o) * 26}px)`;
        if (dd < best) { best = dd; active = idx; }
      });
      if (active !== lastSec && secLabelRef.current) {
        lastSec = active;
        secLabelRef.current.innerHTML = 'Portfolio MMXXV<b>' + SECTION_NAMES[active] + '</b>';
      }
      if (cueRef.current) cueRef.current.style.opacity = prog < 0.02 ? '1' : '0';
      if (railFillRef.current) railFillRef.current.style.height = prog * 100 + '%';
      if (blackoutRef.current) blackoutRef.current.style.opacity = prog > 0.965 ? ((prog - 0.965) / 0.035) * 0.9 : 0;

      if (!REDUCED) {
        const dp = dust.geometry.attributes.position.array;
        for (let j = 1; j < dp.length; j += 3) { dp[j] += 0.004; if (dp[j] > 10) dp[j] = 0; }
        dust.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      readScroll(); setPlateVis();
    }
    window.addEventListener('resize', onResize);

    let ready = false, minT = false;
    const maybeHide = () => { if (ready && minT && loaderRef.current) loaderRef.current.classList.add('hide'); };
    mgr.onLoad = () => { ready = true; maybeHide(); };
    const t1 = setTimeout(() => { minT = true; maybeHide(); }, 900);
    const t2 = setTimeout(() => { ready = true; maybeHide(); }, 5000);

    // ---- always-on ambient music (autoplay policy: start on first interaction) ----
    const audio = audioRef.current;
    const btn = soundBtnRef.current;
    let started = false;
    const setLabel = (txt) => { if (btn) btn.textContent = txt; };
    const fadeTo = (tv) => {
      if (!audio) return;
      const step = () => {
        const diff = tv - audio.volume;
        if (Math.abs(diff) < 0.02) { audio.volume = tv; return; }
        audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(diff) * 0.02));
        requestAnimationFrame(step);
      };
      step();
    };
    const startAudio = () => {
      if (started || !audio) return;
      audio.volume = 0;
      const pr = audio.play();
      const ok = () => { started = true; setLabel('Sound on'); if (btn) btn.dataset.on = '1'; fadeTo(0.4); };
      if (pr && pr.then) pr.then(ok).catch(() => {}); else ok();
    };
    const gestures = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    gestures.forEach((ev) => window.addEventListener(ev, startAudio, { passive: true }));
    const onToggle = (e) => {
      e.stopPropagation();
      if (!started) { startAudio(); return; }
      audio.muted = !audio.muted;
      setLabel(audio.muted ? 'Sound off' : 'Sound on');
      btn.dataset.on = audio.muted ? '0' : '1';
    };
    if (btn) btn.addEventListener('click', onToggle);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1); clearTimeout(t2);
      gestures.forEach((ev) => window.removeEventListener(ev, startAudio));
      if (btn) btn.removeEventListener('click', onToggle);
      if (audio) audio.pause();
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', onResize);
      if (lenis) lenis.destroy();
      renderer.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const m = o.material;
          (Array.isArray(m) ? m : [m]).forEach((mm) => { if (mm.map) mm.map.dispose(); mm.dispose(); });
        }
      });
    };
  }, []);

  return (
    <>
      <canvas id="scene" ref={canvasRef} />
      <div id="vignette" />
      <div id="grain" />
      <div id="blackout" ref={blackoutRef} />
      <div id="track" />

      <div className="wordmark">
        <b>Amna Pervez</b> · Architectural Designer
      </div>
      <div id="sectionLabel" ref={secLabelRef}>
        Portfolio MMXXV<b>Introduction</b>
      </div>
      <div id="rail">
        <div id="railFill" ref={railFillRef} />
      </div>

      <div id="ui" ref={uiRef}>
        {/* 0 OPENING */}
        <section className="panel center" data-anchor="0">
          <div className="inner">
            <div className="eyebrow">Selected Works · MMXXV</div>
            <h1 className="name">Amna<br />Pervez</h1>
            <div className="role">Architectural Designer · Lahore</div>
            <div className="tagline">&ldquo;Architecture as atmosphere.&rdquo;</div>
          </div>
        </section>

        {/* 1 APPROACH */}
        <section className="panel center" data-anchor="1">
          <div className="inner">
            <h2 className="q">Every project begins<br />with <em>a question.</em></h2>
          </div>
        </section>

        {/* 2..7 PROJECTS */}
        {projects.map((p, i) => (
          <section key={p.slug} className={`panel label${i % 2 === 0 ? '' : ' right'}`} data-anchor={i + 2}>
            <div className="inner">
              <img className="plate" src={p.hero} alt={p.title} />
              <div className="idx">PROJECT {p.index}{i === 3 ? ' · THESIS' : ''}</div>
              <h3 className="ptitle">{p.title}</h3>
              <div className="meta">
                Location <span>{p.location}</span><br />
                Year <span>{p.year}</span><br />
                Type <span>{p.type}</span>
              </div>
              <p className="pdesc">{p.blurb}</p>
              <Link className="viewBtn" href={`/work/${p.slug}`}>
                View project <span className="arr">→</span>
              </Link>
            </div>
          </section>
        ))}

        {/* 8 STATEMENT */}
        <section className="panel center" data-anchor="8">
          <div className="inner">
            <h2 className="q"><em>Plans become</em> atmosphere.<br />Light does the rest.</h2>
          </div>
        </section>

        {/* 9 ABOUT */}
        <section className="panel about" data-anchor="9">
          <div className="inner">
            <div className="aboutGrid">
              <figure className="portraitFrame">
                <img className="portrait-hero" src="/img/portrait.png" alt="Amna Pervez" />
                <figcaption>Amna Pervez · Lahore</figcaption>
              </figure>
              <div className="aboutBody">
                <div className="eyebrow">About</div>
                <h2 className="name">Amna Pervez</h2>
                <div className="role">Architectural Designer</div>
                <p className="bio">
                  An architecture graduate from UET Lahore, working across residential interiors and
                  speculative thesis work. I&rsquo;m drawn to architecture as narrative: spaces that
                  carry mood, memory and survival, not only function.
                </p>
                <div className="cols">
                  <div className="col"><h4>Education</h4><p>B.Arch, UET Lahore (2021-present)<br />CODE: Computational Design, UET<br />Graphic Design, LUMS</p></div>
                  <div className="col"><h4>Tools</h4><p>Revit · AutoCAD · SketchUp<br />Rhino + Grasshopper<br />Lumion · D5 Render · Adobe CC</p></div>
                  <div className="col"><h4>Experience</h4><p>Rashid Rana Studio<br />U &amp; Z Design Studio<br />Pathar, Islamabad</p></div>
                  <div className="col"><h4>Leadership</h4><p>President, Uraan<br />Director of Ops, ArchiHub<br />Co-Director, UET SS</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10 CONTACT */}
        <section className="panel contact" data-anchor="10">
          <div className="inner">
            <h2 className="q">Let&rsquo;s create spaces<br /><em>that matter.</em></h2>
            <div className="clist">
              <a href="mailto:amna.pervez@hotmail.com">amna.pervez@hotmail.com</a>
              <a href="https://www.linkedin.com/in/amna-pervez" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="tel:+923035335595">+92 303 5335595</a>
              <span>DHA, Lahore</span>
            </div>
            <div className="credit">Amna Pervez · Architecture Portfolio</div>
          </div>
        </section>
      </div>

      <div id="cue" ref={cueRef}>
        Scroll to enter
        <div className="bar" />
      </div>

      <div id="loader" ref={loaderRef}>
        <div className="lname">Amna Pervez</div>
        <div className="lsub">Architecture as Atmosphere</div>
      </div>

      <audio ref={audioRef} src="/ambient.mp3" loop preload="auto" />
      <button id="soundToggle" ref={soundBtnRef} type="button" aria-label="Toggle sound" data-on="0">Enable sound</button>
    </>
  );
}
