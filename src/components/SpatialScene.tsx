import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Medication } from '../data/medications.ts';
import {
  createMedication3DObject,
  createShelvingBay,
  createPharmacistCounter,
  createCapsuleModel,
} from './Pharmacy3DModels.ts';
import { createFloorTexture } from '../utils/proceduralTextures.ts';
import { soundManager } from '../utils/audio.ts';

interface SpatialSceneProps {
  medications: Medication[];
  selectedMedication: Medication | null;
  onSelectMedication: (med: Medication | null) => void;
  hoveredMedication: Medication | null;
  onHoverMedication: (med: Medication | null) => void;
  activeView: 'overview' | 'aisle-1' | 'aisle-2' | 'aisle-3' | 'counter';
  onViewChange: (view: 'overview' | 'aisle-1' | 'aisle-2' | 'aisle-3' | 'counter') => void;
  filterCategory: string;
  isPillExploded: boolean;
}

// Pre-allocated math helpers to ensure zero GC in animation loop
const _tempVecA = new THREE.Vector3();
const _tempVecB = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

export const SpatialScene: React.FC<SpatialSceneProps> = ({
  medications,
  selectedMedication,
  onSelectMedication,
  hoveredMedication,
  onHoverMedication,
  activeView,
  isPillExploded,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Store medication mesh maps for fast lookups
  const medMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const interactiveObjectsRef = useRef<THREE.Object3D[]>([]);

  // Camera targets
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 6.5, 13.5));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.8, 0));
  const inspectionCapsuleRef = useRef<THREE.Group | null>(null);

  // Save base positions of items so they return smoothly when deselected
  const basePositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  // Keep latest props in refs for animation loop
  const selectedMedRef = useRef(selectedMedication);
  selectedMedRef.current = selectedMedication;
  const isPillExplodedRef = useRef(isPillExploded);
  isPillExplodedRef.current = isPillExploded;

  // Camera presets
  useEffect(() => {
    if (selectedMedication) {
      // Focus directly in front of the selected medication
      const mesh = medMeshesRef.current.get(selectedMedication.id);
      if (mesh) {
        const basePos = basePositionsRef.current.get(selectedMedication.id) || mesh.position;
        targetCamPos.current.set(basePos.x, basePos.y + 0.25, basePos.z + 1.85);
        targetLookAt.current.set(basePos.x, basePos.y + 0.2, basePos.z);
        return;
      }
    }

    switch (activeView) {
      case 'aisle-1': // Pain & Cold
        targetCamPos.current.set(-6.2, 2.7, 4.4);
        targetLookAt.current.set(-6.2, 1.9, 0);
        break;
      case 'aisle-2': // Digestive & Vitamins
        targetCamPos.current.set(0, 2.7, 4.4);
        targetLookAt.current.set(0, 1.9, 0);
        break;
      case 'aisle-3': // Prescription Care
        targetCamPos.current.set(6.2, 2.7, 4.4);
        targetLookAt.current.set(6.2, 1.9, 0);
        break;
      case 'counter': // Pharmacist Desk
        targetCamPos.current.set(0, 2.4, -1.8);
        targetLookAt.current.set(0, 1.4, -6.5);
        break;
      case 'overview':
      default:
        targetCamPos.current.set(0, 6.8, 14.0);
        targetLookAt.current.set(0, 1.8, 0);
        break;
    }
  }, [activeView, selectedMedication]);

  // Main Scene Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.Fog(0x0a0f1d, 18, 38);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      46,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.copy(targetCamPos.current);
    cameraRef.current = camera;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent dipping beneath floor
    controls.minDistance = 1.2;
    controls.maxDistance = 24.0;
    controls.target.copy(targetLookAt.current);
    controlsRef.current = controls;

    // 5. Studio Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback if environment generation fails
    }

    // 6. Balanced 3-Point Studio Lighting
    // Cool ambient ceiling hemisphere
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.9);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    // Warm Key Light (casts soft architectural shadows)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    keyLight.position.set(8, 14, 12);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 40;
      keyLight.shadow.bias = -0.0004;
      const d = 14;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    // Subtle Rim & Fill
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(-10, 8, -6);
    scene.add(fillLight);

    // Architectural Downlights over aisles
    const aisleGlow1 = new THREE.PointLight(0x10b981, 1.2, 10);
    aisleGlow1.position.set(-6.2, 4.2, 1.5);
    scene.add(aisleGlow1);

    const aisleGlow2 = new THREE.PointLight(0x06b6d4, 1.2, 10);
    aisleGlow2.position.set(0, 4.2, 1.5);
    scene.add(aisleGlow2);

    const aisleGlow3 = new THREE.PointLight(0x6366f1, 1.2, 10);
    aisleGlow3.position.set(6.2, 4.2, 1.5);
    scene.add(aisleGlow3);

    // 7. Terrazzo Floor
    const floorTex = createFloorTexture();
    const floorGeo = new THREE.PlaneGeometry(36, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.22,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Pharmacy Back Wall & Glowing Cross Emblem
    const wallGeo = new THREE.PlaneGeometry(36, 9);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0b1329,
      roughness: 0.6,
      metalness: 0.2,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 4.5, -9);
    scene.add(backWall);

    // Pharmacy Green Cross Neon Emblem on back wall
    const crossGroup = new THREE.Group();
    const crossBarMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.05), crossBarMat);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.05), crossBarMat);
    crossGroup.add(crossH);
    crossGroup.add(crossV);
    crossGroup.position.set(0, 5.2, -8.9);
    scene.add(crossGroup);

    // Pharmacist Dispensing Counter Island
    const counter = createPharmacistCounter();
    counter.position.set(0, 0, -6.2);
    scene.add(counter);

    // 8. Build 3 Retail Gondola Shelving Bays
    // Bay 1: Pain & Respiratory (X: -6.2)
    const bay1 = createShelvingBay(1, 'Aisle 1 • Pain & Cold Care', '#10b981', 1);
    bay1.position.set(-6.2, 0, 0);
    scene.add(bay1);

    // Bay 2: Digestive & Vitamins (X: 0)
    const bay2 = createShelvingBay(2, 'Aisle 2 • Digestive & Wellness', '#0ea5e9', 2);
    bay2.position.set(0, 0, 0);
    scene.add(bay2);

    // Bay 3: Prescription Care & Daily Therapy (X: 6.2)
    const bay3 = createShelvingBay(3, 'Aisle 3 • Prescription Rx & Heart', '#8b5cf6', 3);
    bay3.position.set(6.2, 0, 0);
    scene.add(bay3);

    // 9. Populate Medications onto Shelves
    const shelfHeights = [0.84, 1.94, 3.04];
    const bayXOffsets = { 1: -6.2, 2: 0, 3: 6.2 };
    const interactiveList: THREE.Object3D[] = [];

    medications.forEach((med) => {
      const medGroup = createMedication3DObject(med);

      const bx = bayXOffsets[med.shelfLocation.aisle as 1 | 2 | 3] || 0;
      const by = shelfHeights[med.shelfLocation.tier];
      // Slot spacing along 5m shelf
      const slotX = (med.shelfLocation.slot - 0.7) * 1.5;
      const bz = 0.05;

      const worldPos = new THREE.Vector3(bx + slotX, by, bz);
      medGroup.position.copy(worldPos);

      scene.add(medGroup);
      medMeshesRef.current.set(med.id, medGroup);
      basePositionsRef.current.set(med.id, worldPos.clone());

      // Register interactive child meshes for raycasting
      medGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name !== 'hoverHalo') {
          child.userData = { parentMedId: med.id, med };
          interactiveList.push(child);
        }
      });
    });

    interactiveObjectsRef.current = interactiveList;

    // Inspection Floating 3D Capsule (Pop-out pill view)
    const capsule = createCapsuleModel('#0ea5e9', '#ffffff');
    capsule.position.set(0, -10, 0);
    capsule.visible = false;
    scene.add(capsule);
    inspectionCapsuleRef.current = capsule;

    // 10. Animation Loop with Exponential Damping & Zero GC
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);

      // Smooth camera interpolation towards target
      camera.position.lerp(targetCamPos.current, 0.08);
      controls.target.lerp(targetLookAt.current, 0.08);
      controls.update();

      // Smoothly animate selected medicine rotation or return
      const currentSelected = selectedMedRef.current;
      medMeshesRef.current.forEach((mesh, medId) => {
        const basePos = basePositionsRef.current.get(medId);
        if (!basePos) return;

        if (currentSelected && currentSelected.id === medId) {
          // Lift item forward for close inspection
          _tempVecA.set(basePos.x, basePos.y + 0.22, basePos.z + 0.55);
          mesh.position.lerp(_tempVecA, 0.1);
          // Continuous smooth gentle inspection turn
          mesh.rotation.y += 0.8 * delta;

          // Capsule pop-out inspection view
          if (inspectionCapsuleRef.current) {
            inspectionCapsuleRef.current.visible = isPillExplodedRef.current;
            if (isPillExplodedRef.current) {
              inspectionCapsuleRef.current.position.set(
                mesh.position.x + 0.65,
                mesh.position.y + 0.15,
                mesh.position.z + 0.1
              );
              inspectionCapsuleRef.current.rotation.x += 1.2 * delta;
              inspectionCapsuleRef.current.rotation.y += 1.6 * delta;
            }
          }
        } else {
          // Return smoothly to base shelf position
          mesh.position.lerp(basePos, 0.12);
          mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, 0, 8, delta);
        }
      });

      // Neon cross subtle breath
      crossGroup.rotation.z = Math.sin(clock.getElapsedTime() * 0.8) * 0.02;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    // 11. Raycasting & Interaction Listeners
    function handlePointerMove(e: MouseEvent) {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const intersects = _raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const med = hit.object.userData?.med as Medication | undefined;
        if (med) {
          if (mountRef.current) mountRef.current.style.cursor = 'pointer';
          onHoverMedication(med);

          // Update halo visibility on mesh
          const mesh = medMeshesRef.current.get(med.id);
          const halo = mesh?.getObjectByName('hoverHalo') as THREE.Mesh | undefined;
          if (halo && halo.material instanceof THREE.MeshBasicMaterial) {
            halo.material.opacity = 0.8;
          }
          return;
        }
      }

      if (mountRef.current) mountRef.current.style.cursor = 'default';
      onHoverMedication(null);

      // Reset all halos
      medMeshesRef.current.forEach((mesh) => {
        const halo = mesh.getObjectByName('hoverHalo') as THREE.Mesh | undefined;
        if (halo && halo.material instanceof THREE.MeshBasicMaterial) {
          halo.material.opacity = 0;
        }
      });
    }

    function handleClick(e: MouseEvent) {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const intersects = _raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const med = hit.object.userData?.med as Medication | undefined;
        if (med) {
          soundManager.playClick();
          onSelectMedication(med);
        }
      }
    }

    function handleResize() {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [medications, onHoverMedication, onSelectMedication]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Hover Tooltip over Canvas */}
      {hoveredMedication && !selectedMedication && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200">
          <div className="bg-slate-900/95 border border-emerald-500/40 text-slate-100 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: hoveredMedication.packageStyle.accentGlow || '#10b981' }}
            />
            <div>
              <p className="text-xs font-semibold text-emerald-400">
                {hoveredMedication.categoryLabel}
              </p>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {hoveredMedication.name}
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  ${hoveredMedication.price.toFixed(2)}
                </span>
              </h4>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono ml-1">
              Click to inspect
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
