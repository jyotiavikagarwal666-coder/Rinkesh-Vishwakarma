import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SceneType, MoodTheme } from '../types';

interface ThreeCanvasProps {
  currentScene: SceneType;
  mood: MoodTheme;
  boxUnlocked: boolean;
  candlesBlown: boolean;
  onBoxClick?: () => void;
  onCandleClick?: () => void;
}

// Module-scope reusable math objects to avoid Garbage Collection in render loop
const _vec3 = new THREE.Vector3();
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0, 0);

// Helper to create 2D heart shape for ExtrudeGeometry
function createHeartShape(scale = 1): THREE.Shape {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;
  shape.moveTo(x, y + 0.35 * scale);
  shape.bezierCurveTo(x, y + 0.65 * scale, x - 0.45 * scale, y + 0.9 * scale, x - 0.75 * scale, y + 0.5 * scale);
  shape.bezierCurveTo(x - 1.1 * scale, y + 0.05 * scale, x - 0.6 * scale, y - 0.5 * scale, x, y - 0.9 * scale);
  shape.bezierCurveTo(x + 0.6 * scale, y - 0.5 * scale, x + 1.1 * scale, y + 0.05 * scale, x + 0.75 * scale, y + 0.5 * scale);
  shape.bezierCurveTo(x + 0.45 * scale, y + 0.9 * scale, x, y + 0.65 * scale, x, y + 0.35 * scale);
  return shape;
}

// Helper to generate procedural glitter/speckle texture
function createGlitterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);

  // Soft random sparkles
  for (let i = 0; i < 400; i++) {
    const px = Math.random() * 256;
    const py = Math.random() * 256;
    const rad = Math.random() * 2 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffe4e6' : '#fda4af';
    ctx.beginPath();
    ctx.arc(px, py, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentScene,
  mood,
  boxUnlocked,
  candlesBlown,
  onBoxClick,
  onCandleClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    currentScene,
    mood,
    boxUnlocked,
    candlesBlown,
  });

  // Keep state updated in ref for animation frame loop
  useEffect(() => {
    stateRef.current = { currentScene, mood, boxUnlocked, candlesBlown };
  }, [currentScene, mood, boxUnlocked, candlesBlown]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c040d, 0.035);

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = !isHeadless;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, running in fallback mode:', e);
      return;
    }

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.2);

    // 3. Mandatory Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffe4e6, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1f2, 2.2);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf43f5e, 1.2);
    fillLight.position.set(-5, 2, -3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0xffe4e6, 0x1e0924, 0.7);
    scene.add(hemiLight);

    // Soft contact ground shadow plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050106,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.55;
    scene.add(groundShadow);

    // 5. Shared Procedural Materials
    const glitterTex = createGlitterTexture();
    glitterTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // ==========================================
    // HERO 1: 3D Procedural Mystery Gift Box (Scene 1)
    // ==========================================
    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, -0.1, 0);

    // Box body (Velvet Ruby Lacquer)
    const boxBodyGeo = new THREE.BoxGeometry(2, 1.7, 2);
    const boxBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x9f1239,
      metalness: 0.25,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const boxBody = new THREE.Mesh(boxBodyGeo, boxBodyMat);
    boxBody.castShadow = !isHeadless;
    boxBody.receiveShadow = !isHeadless;
    boxBody.position.y = 0;
    boxGroup.add(boxBody);

    // Gold Ribbon on Box Body
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ribbonVGeo = new THREE.BoxGeometry(0.32, 1.71, 2.02);
    const ribbonV = new THREE.Mesh(ribbonVGeo, goldMat);
    boxGroup.add(ribbonV);

    const ribbonHGeo = new THREE.BoxGeometry(2.02, 1.71, 0.32);
    const ribbonH = new THREE.Mesh(ribbonHGeo, goldMat);
    boxGroup.add(ribbonH);

    // Box Lid (Can lift off on unlock!)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.88, 0);

    const lidGeo = new THREE.BoxGeometry(2.1, 0.35, 2.1);
    const lidMesh = new THREE.Mesh(lidGeo, boxBodyMat);
    lidMesh.castShadow = !isHeadless;
    lidGroup.add(lidMesh);

    const lidRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.36, 2.12), goldMat);
    const lidRibbonH = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.36, 0.33), goldMat);
    lidGroup.add(lidRibbonV, lidRibbonH);

    // Bow loops on top of lid
    const bowLoopGeo = new THREE.TorusGeometry(0.35, 0.1, 16, 32);
    const bow1 = new THREE.Mesh(bowLoopGeo, goldMat);
    bow1.rotation.x = Math.PI / 3;
    bow1.rotation.y = Math.PI / 4;
    bow1.position.set(-0.2, 0.32, 0.1);
    lidGroup.add(bow1);

    const bow2 = new THREE.Mesh(bowLoopGeo, goldMat);
    bow2.rotation.x = -Math.PI / 3;
    bow2.rotation.y = -Math.PI / 4;
    bow2.position.set(0.2, 0.32, -0.1);
    lidGroup.add(bow2);

    // Heart Gem Lock on the bow
    const heartShape = createHeartShape(0.28);
    const heartLockGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.04,
    });
    const rubyGemMat = new THREE.MeshPhysicalMaterial({
      color: 0xff1e56,
      emissive: 0x880022,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.6,
    });
    const heartLock = new THREE.Mesh(heartLockGeo, rubyGemMat);
    heartLock.position.set(0, 0.38, 0.12);
    heartLock.rotation.x = Math.PI;
    lidGroup.add(heartLock);

    boxGroup.add(lidGroup);

    // Radiant Surprise Core Heart inside (revealed on open)
    const bigHeartShape = createHeartShape(0.65);
    const bigHeartGeo = new THREE.ExtrudeGeometry(bigHeartShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.09,
    });
    const glowingHeartMat = new THREE.MeshPhysicalMaterial({
      color: 0xff2e63,
      emissive: 0xff1053,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.3,
      clearcoat: 1.0,
    });
    const insideHeart = new THREE.Mesh(bigHeartGeo, glowingHeartMat);
    insideHeart.rotation.x = Math.PI;
    insideHeart.position.set(0, 0.4, 0);
    insideHeart.scale.set(0.001, 0.001, 0.001); // starts hidden inside
    boxGroup.add(insideHeart);

    scene.add(boxGroup);

    // ==========================================
    // HERO 2: 3D Multi-Tier Birthday Cake (Scene 2)
    // ==========================================
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -1.2, 0);

    // 1. Decorative Gold Cake Stand
    const standGeo = new THREE.CylinderGeometry(2.35, 2.5, 0.22, 48);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const cakeStand = new THREE.Mesh(standGeo, standMat);
    cakeStand.position.y = 0.11;
    cakeStand.receiveShadow = !isHeadless;
    cakeGroup.add(cakeStand);

    // 2. Bottom Tier Cake (Rose Velvet & Strawberry Cream)
    const tier1Geo = new THREE.CylinderGeometry(2.0, 2.0, 1.1, 48);
    const cakeFrostingMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe4e6,
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.2,
      map: glitterTex,
    });
    const tier1 = new THREE.Mesh(tier1Geo, cakeFrostingMat);
    tier1.position.y = 0.77;
    tier1.castShadow = !isHeadless;
    tier1.receiveShadow = !isHeadless;
    cakeGroup.add(tier1);

    // Frosting Rose Ribbon bottom tier
    const ribbonCakeMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
      metalness: 0.2,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.07, 16, 48), ribbonCakeMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.25;
    cakeGroup.add(ring1);

    // 3. Top Tier Cake
    const tier2Geo = new THREE.CylinderGeometry(1.3, 1.3, 0.9, 48);
    const tier2 = new THREE.Mesh(tier2Geo, cakeFrostingMat);
    tier2.position.y = 1.77;
    tier2.castShadow = !isHeadless;
    tier2.receiveShadow = !isHeadless;
    cakeGroup.add(tier2);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.06, 16, 48), ribbonCakeMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 1.34;
    cakeGroup.add(ring2);

    // 4. Strawberry / Cherry pearls on top
    const pearlGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.8,
    });
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(Math.cos(angle) * 1.15, 2.24, Math.sin(angle) * 1.15);
      cakeGroup.add(pearl);
    }

    // 5. Celebration Birthday Candles (with flickering point lights & flames!)
    const candleGroup = new THREE.Group();
    const candleMeshList: THREE.Mesh[] = [];
    const flameList: { mesh: THREE.Mesh; light: THREE.PointLight; baseIntensity: number }[] = [];

    const candleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.55, 16);
    const candleWaxMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.3,
      metalness: 0.1,
    });
    const flameGeo = new THREE.SphereGeometry(0.075, 12, 12);
    flameGeo.scale(1, 1.8, 1);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.95,
    });

    // 5 candles arranged gracefully in center
    const candlePositions = [
      { x: 0, z: 0 },
      { x: 0.45, z: 0.2 },
      { x: -0.45, z: 0.2 },
      { x: 0.28, z: -0.4 },
      { x: -0.28, z: -0.4 },
    ];

    candlePositions.forEach((pos) => {
      const c = new THREE.Mesh(candleGeo, candleWaxMat);
      c.position.set(pos.x, 2.5, pos.z);
      candleGroup.add(c);
      candleMeshList.push(c);

      // Flame
      const flame = new THREE.Mesh(flameGeo, flameMat.clone());
      flame.position.set(pos.x, 2.86, pos.z);
      candleGroup.add(flame);

      const flameLight = new THREE.PointLight(0xff7700, 1.6, 3.5);
      flameLight.position.set(pos.x, 2.88, pos.z);
      candleGroup.add(flameLight);

      flameList.push({ mesh: flame, light: flameLight, baseIntensity: 1.6 });
    });

    cakeGroup.add(candleGroup);

    // Golden "19" topper on cake
    const numberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
    });
    // Create decorative circular frame with 19
    const plaqueGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.06, 32);
    const plaque = new THREE.Mesh(plaqueGeo, numberMat);
    plaque.rotation.x = Math.PI / 2;
    plaque.position.set(0, 3.25, 0);
    cakeGroup.add(plaque);

    const littleHeartGeo = new THREE.ShapeGeometry(createHeartShape(0.24));
    const littleHeartOnCake = new THREE.Mesh(littleHeartGeo, rubyGemMat);
    littleHeartOnCake.rotation.x = Math.PI;
    littleHeartOnCake.position.set(0, 3.28, 0.04);
    cakeGroup.add(littleHeartOnCake);

    scene.add(cakeGroup);

    // ==========================================
    // HERO 3: Floating 3D Hearts & Starlight Galaxy
    // ==========================================
    const floatingHeartsGroup = new THREE.Group();
    const heartMeshes: {
      mesh: THREE.Mesh;
      baseY: number;
      speed: number;
      rotSpeed: number;
      offset: number;
    }[] = [];

    const smallHeartShape = createHeartShape(0.3);
    const smallHeartGeo = new THREE.ExtrudeGeometry(smallHeartShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });

    const heartColors = [0xf43f5e, 0xfb7185, 0xfbbf24, 0xec4899, 0xf472b6];

    for (let i = 0; i < 28; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: heartColors[i % heartColors.length],
        metalness: 0.4,
        roughness: 0.25,
        clearcoat: 0.8,
        emissive: heartColors[i % heartColors.length],
        emissiveIntensity: 0.25,
      });
      const hMesh = new THREE.Mesh(smallHeartGeo, mat);
      const angle = (i / 28) * Math.PI * 2;
      const radius = 2.8 + (i % 5) * 0.7;
      const y = -1.0 + (i % 7) * 0.7;
      hMesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius - 0.5);
      hMesh.rotation.x = Math.PI + (Math.random() - 0.5);
      hMesh.rotation.y = Math.random() * Math.PI;
      const s = 0.5 + Math.random() * 0.5;
      hMesh.scale.set(s, s, s);

      floatingHeartsGroup.add(hMesh);
      heartMeshes.push({
        mesh: hMesh,
        baseY: y,
        speed: 0.6 + Math.random() * 0.8,
        rotSpeed: 0.4 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
      });
    }

    scene.add(floatingHeartsGroup);

    // Golden Twinkling Starlight Particles (Instanced)
    const starCount = 350;
    const starGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0xfff0f5,
      transparent: true,
      opacity: 0.75,
    });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, starCount);
    starInstanced.frustumCulled = false;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < starCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12 + 1,
        (Math.random() - 0.5) * 14 - 2
      );
      const sc = 0.4 + Math.random() * 1.4;
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      starInstanced.setMatrixAt(i, dummy.matrix);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    scene.add(starInstanced);

    // Smoke particles for candle extinguishing
    const smokeGroup = new THREE.Group();
    const smokePuffs: { mesh: THREE.Mesh; vy: number; life: number }[] = [];
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const smokeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    for (let i = 0; i < 20; i++) {
      const sm = new THREE.Mesh(smokeGeo, smokeMat.clone());
      sm.position.set(0, -999, 0);
      smokeGroup.add(sm);
      smokePuffs.push({ mesh: sm, vy: 0.02, life: 0 });
    }
    scene.add(smokeGroup);

    // ==========================================
    // Interaction: Raycasting & Pointer Movement
    // ==========================================
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let isDragging = false;
    let prevMouseX = 0;
    let boxTargetRotY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check if clicking the Gift Box in Scene 1
      if (stateRef.current.currentScene === 'scene1') {
        const intersects = raycaster.intersectObjects(boxGroup.children, true);
        if (intersects.length > 0 && onBoxClick) {
          onBoxClick();
        }
      }

      // Check if clicking the Cake/Candles in Scene 2
      if (stateRef.current.currentScene === 'scene2') {
        const intersects = raycaster.intersectObjects(cakeGroup.children, true);
        if (intersects.length > 0 && onCandleClick) {
          onCandleClick();
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.x = normX;
      mouse.y = normY;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        boxTargetRotY += deltaX * 0.008;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // Render Loop with Silky Damping
    // ==========================================
    const clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      const { currentScene: sceneMode, boxUnlocked: isUnlocked, candlesBlown: isBlown } = stateRef.current;

      const isMobile = window.innerWidth < 640;
      const zoomFactor = isMobile ? 1.35 : 1.0;

      // 1. Camera transitions smoothly depending on active scene
      if (sceneMode === 'scene1') {
        _targetCameraPos.set(mouse.x * 0.25, (isMobile ? 0.9 : 1.2) - mouse.y * 0.2, 5.2 * zoomFactor);
        _targetLookAt.set(0, isMobile ? 0.3 : 0.1, 0);
      } else if (sceneMode === 'scene2') {
        _targetCameraPos.set(mouse.x * 0.3, (isMobile ? 1.4 : 2.0) - mouse.y * 0.25, 5.0 * zoomFactor);
        _targetLookAt.set(0, isMobile ? 0.9 : 0.8, 0);
      } else {
        // Scene 3: Love letter & Memory universe
        _targetCameraPos.set(mouse.x * 0.3, 1.2 - mouse.y * 0.2, 6.0 * zoomFactor);
        _targetLookAt.set(0, 0.4, 0);
      }

      // Smooth exponential damping on camera
      camera.position.lerp(_targetCameraPos, 0.06);
      _currentLookAt.lerp(_targetLookAt, 0.06);
      camera.lookAt(_currentLookAt);

      // 2. Scene 1 Gift Box Animations & Unlocking
      if (sceneMode === 'scene1') {
        boxGroup.visible = true;
        // Smooth rotation drag + natural breathing float
        boxGroup.rotation.y = THREE.MathUtils.damp(boxGroup.rotation.y, boxTargetRotY + Math.sin(time * 0.8) * 0.15, 6, delta);
        boxGroup.position.y = THREE.MathUtils.damp(boxGroup.position.y, -0.1 + Math.sin(time * 1.5) * 0.08, 4, delta);

        if (isUnlocked) {
          // Lid lifts off into the air
          lidGroup.position.y = THREE.MathUtils.damp(lidGroup.position.y, 2.8, 4, delta);
          lidGroup.rotation.x = THREE.MathUtils.damp(lidGroup.rotation.x, -0.4, 4, delta);
          lidGroup.rotation.z = THREE.MathUtils.damp(lidGroup.rotation.z, 0.3, 4, delta);

          // Radiant heart emerges, rotates and glows
          insideHeart.position.y = THREE.MathUtils.damp(insideHeart.position.y, 1.4 + Math.sin(time * 2.5) * 0.15, 4, delta);
          insideHeart.scale.lerp(_vec3.set(1.2, 1.2, 1.2), 0.08);
          insideHeart.rotation.y = time * 1.2;
          glowingHeartMat.emissiveIntensity = 1.0 + Math.sin(time * 4) * 0.4;
        } else {
          lidGroup.position.y = THREE.MathUtils.damp(lidGroup.position.y, 0.88, 6, delta);
          lidGroup.rotation.set(0, 0, 0);
          insideHeart.scale.set(0.001, 0.001, 0.001);
        }
      } else {
        boxGroup.visible = false;
      }

      // 3. Scene 2 Birthday Cake Animations & Candles
      if (sceneMode === 'scene2') {
        cakeGroup.visible = true;
        cakeGroup.rotation.y += delta * 0.22;
        cakeGroup.position.y = THREE.MathUtils.damp(cakeGroup.position.y, -0.8 + Math.sin(time * 1.2) * 0.04, 3, delta);

        flameList.forEach((f, idx) => {
          if (!isBlown) {
            // Flickering candle flame
            f.mesh.visible = true;
            const flicker = Math.sin(time * 15 + idx * 3) * 0.15 + (Math.random() - 0.5) * 0.1;
            f.mesh.scale.set(1 + flicker, 1.8 + flicker * 1.5, 1 + flicker);
            f.light.intensity = f.baseIntensity + flicker * 0.8;
          } else {
            // Blown out
            f.mesh.visible = false;
            f.light.intensity = THREE.MathUtils.damp(f.light.intensity, 0, 8, delta);
          }
        });

        // If blown, trigger gentle smoke rising
        if (isBlown) {
          smokePuffs.forEach((puff, idx) => {
            const sm = puff.mesh;
            const mat = sm.material as THREE.MeshBasicMaterial;
            if (mat.opacity <= 0.01 && Math.random() < 0.1) {
              const candle = candleMeshList[idx % candleMeshList.length];
              sm.position.set(candle.position.x + (Math.random() - 0.5) * 0.1, 2.9, candle.position.z + (Math.random() - 0.5) * 0.1);
              mat.opacity = 0.45;
              puff.life = 1.0;
            }
            if (puff.life > 0) {
              sm.position.y += 0.015;
              sm.position.x += Math.sin(time * 3 + idx) * 0.004;
              mat.opacity *= 0.96;
              puff.life -= delta;
            }
          });
        }
      } else {
        cakeGroup.visible = false;
      }

      // 4. Floating 3D Hearts Animation
      heartMeshes.forEach((item, idx) => {
        const m = item.mesh;
        m.position.y = item.baseY + Math.sin(time * item.speed + item.offset) * 0.35;
        m.rotation.y = time * item.rotSpeed + item.offset;
        m.rotation.z = Math.sin(time * 0.5 + idx) * 0.2;
      });

      // 5. Star Twinkle
      starInstanced.rotation.y = time * 0.015;
      starInstanced.rotation.x = Math.sin(time * 0.01) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      // Dispose resources
      scene.clear();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden"
    />
  );
};
