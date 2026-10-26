import * as THREE from 'three';
import { Medication } from '../data/medications.ts';
import {
  createBottleLabelTexture,
  createBoxTexture,
  createAisleSignTexture,
  createShelfEdgeTexture,
} from '../utils/proceduralTextures.ts';

// Shared geometries and materials for performance
const _cylinderGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.95, 32);
const _neckGeo = new THREE.CylinderGeometry(0.25, 0.36, 0.22, 24);
const _capGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.24, 32);
const _boxGeo = new THREE.BoxGeometry(0.72, 1.1, 0.42);

/**
 * Creates an authentic multi-part procedural 3D medicine container (Group of 4-7 parts)
 */
export function createMedication3DObject(med: Medication): THREE.Group {
  const group = new THREE.Group();
  group.name = `med_${med.id}`;
  group.userData = { medication: med, isMedication: true };

  const isBottle = med.type === 'bottle' || med.type === 'amber-bottle';
  const isAmber = med.type === 'amber-bottle';
  const isSpray = med.type === 'spray';
  const isBox = med.type === 'box';

  if (isBottle || isSpray) {
    // 1. Bottle Primary Body
    const bottleMat = new THREE.MeshStandardMaterial({
      color: isAmber ? 0xb45309 : 0xffffff,
      roughness: isAmber ? 0.15 : 0.25,
      metalness: isAmber ? 0.1 : 0.05,
      transparent: isAmber,
      opacity: isAmber ? 0.9 : 1.0,
    });

    const body = new THREE.Mesh(_cylinderGeo, bottleMat);
    body.position.y = 0.95 / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 2. Wrap-around Label
    const labelTex = createBottleLabelTexture(med);
    const labelGeo = new THREE.CylinderGeometry(0.385, 0.385, 0.72, 32, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.35,
      metalness: 0.05,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = 0.95 / 2 - 0.02;
    label.rotation.y = -Math.PI / 2; // Face forward
    group.add(label);

    // 3. Shoulder & Neck
    const neck = new THREE.Mesh(_neckGeo, bottleMat);
    neck.position.y = 0.95 + 0.11;
    neck.castShadow = true;
    group.add(neck);

    if (isSpray) {
      // Spray Pump Flange & Nozzle
      const pumpMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.1,
      });
      const flangeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 24);
      const flange = new THREE.Mesh(flangeGeo, pumpMat);
      flange.position.y = 1.18;
      group.add(flange);

      const nozzleGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.35, 16);
      const nozzle = new THREE.Mesh(nozzleGeo, pumpMat);
      nozzle.position.y = 1.38;
      group.add(nozzle);

      // Translucent protective cap
      const sprayCapGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.5, 24);
      const sprayCapMat = new THREE.MeshPhysicalMaterial({
        color: 0x059669,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
      });
      const cap = new THREE.Mesh(sprayCapGeo, sprayCapMat);
      cap.position.y = 1.4;
      group.add(cap);
    } else {
      // 4. Ribbed Child-Resistant Safety Cap
      const capMat = new THREE.MeshStandardMaterial({
        color: med.packageStyle.capColor,
        roughness: 0.45,
        metalness: 0.05,
      });
      const cap = new THREE.Mesh(_capGeo, capMat);
      cap.position.y = 0.95 + 0.22 + 0.12;
      cap.castShadow = true;
      group.add(cap);

      // Cap ridges detail
      const ringGeo = new THREE.TorusGeometry(0.28, 0.02, 8, 24);
      const ring = new THREE.Mesh(ringGeo, capMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = cap.position.y;
      group.add(ring);

      // Tamper-evident seal band
      const sealMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.3,
      });
      const sealGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.05, 24);
      const seal = new THREE.Mesh(sealGeo, sealMat);
      seal.position.y = 0.95 + 0.18;
      group.add(seal);
    }
  } else {
    // 1. Box Package Body
    const boxTex = createBoxTexture(med);
    const boxMat = new THREE.MeshStandardMaterial({
      map: boxTex,
      roughness: 0.3,
      metalness: 0.05,
    });
    const box = new THREE.Mesh(_boxGeo, boxMat);
    box.position.y = 1.1 / 2;
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);

    // Hologram foil edge accent
    const foilMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
    });
    const foilGeo = new THREE.BoxGeometry(0.18, 0.08, 0.43);
    const foil = new THREE.Mesh(foilGeo, foilMat);
    foil.position.set(0.26, 1.05, 0);
    group.add(foil);
  }

  // Contact Shadow Plane at base
  const shadowGeo = new THREE.PlaneGeometry(0.9, 0.9);
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sctx = shadowCanvas.getContext('2d')!;
  const sgrad = sctx.createRadialGradient(64, 64, 10, 64, 64, 60);
  sgrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  sgrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  sctx.fillStyle = sgrad;
  sctx.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);

  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.5,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.01;
  group.add(contactShadow);

  // Soft Interactive Hover Halo (initially invisible)
  const haloGeo = new THREE.RingGeometry(0.35, 0.48, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: med.packageStyle.accentGlow || 0x10b981,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.name = 'hoverHalo';
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.02;
  group.add(halo);

  return group;
}

/**
 * Creates an architectural retail pharmacy shelving unit (Gondola Bay)
 */
export function createShelvingBay(
  bayIndex: number,
  title: string,
  categoryColor: string,
  aisleNum: number
): THREE.Group {
  const bay = new THREE.Group();
  bay.name = `shelving_bay_${bayIndex}`;

  const shelfWidth = 5.2;
  const shelfDepth = 1.0;
  const totalHeight = 4.2;

  // Frame Material (Sleek dark anthracite steel)
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.8,
  });

  // Shelf Surfaces Material (Clean medical satin white laminate)
  const shelfMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.2,
    metalness: 0.1,
  });

  // Back panel (Soft grey perforated acoustic panel)
  const backGeo = new THREE.BoxGeometry(shelfWidth, totalHeight - 0.4, 0.1);
  const backMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
    metalness: 0.1,
  });
  const backPanel = new THREE.Mesh(backGeo, backMat);
  backPanel.position.set(0, totalHeight / 2, -shelfDepth / 2 + 0.05);
  backPanel.receiveShadow = true;
  bay.add(backPanel);

  // Left & Right Vertical Uprights
  const postGeo = new THREE.BoxGeometry(0.12, totalHeight, shelfDepth);
  const leftPost = new THREE.Mesh(postGeo, metalMat);
  leftPost.position.set(-shelfWidth / 2 - 0.06, totalHeight / 2, 0);
  leftPost.castShadow = true;
  bay.add(leftPost);

  const rightPost = new THREE.Mesh(postGeo, metalMat);
  rightPost.position.set(shelfWidth / 2 + 0.06, totalHeight / 2, 0);
  rightPost.castShadow = true;
  bay.add(rightPost);

  // 3 Shelves (Tier 0: bottom, Tier 1: middle, Tier 2: top)
  const shelfHeights = [0.8, 1.9, 3.0];
  const shelfGeo = new THREE.BoxGeometry(shelfWidth, 0.08, shelfDepth);

  shelfHeights.forEach((h, tierIdx) => {
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, h, 0);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    bay.add(shelf);

    // LED under-shelf glow strip (emits light downwards on items below)
    const ledStripGeo = new THREE.BoxGeometry(shelfWidth - 0.1, 0.02, 0.06);
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe, // crisp 5000K clean white/ice light
    });
    const ledStrip = new THREE.Mesh(ledStripGeo, ledMat);
    ledStrip.position.set(0, h - 0.05, shelfDepth / 2 - 0.1);
    bay.add(ledStrip);

    // Digital e-ink edge price & category runner
    const edgeTex = createShelfEdgeTexture(`${title} • Tier ${3 - tierIdx}`, categoryColor);
    const edgeMat = new THREE.MeshBasicMaterial({ map: edgeTex });
    const edgeGeo = new THREE.PlaneGeometry(shelfWidth, 0.07);
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.set(0, h, shelfDepth / 2 + 0.005);
    bay.add(edge);
  });

  // Base plinth
  const plinthGeo = new THREE.BoxGeometry(shelfWidth + 0.2, 0.35, shelfDepth + 0.1);
  const plinth = new THREE.Mesh(plinthGeo, metalMat);
  plinth.position.set(0, 0.175, 0);
  bay.add(plinth);

  // Top Illuminated Header Canopy
  const canopyGeo = new THREE.BoxGeometry(shelfWidth + 0.3, 0.45, shelfDepth + 0.1);
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.3,
    metalness: 0.6,
  });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, totalHeight - 0.1, 0);
  bay.add(canopy);

  // Canopy glowing sign
  const signTex = createAisleSignTexture(aisleNum, title);
  const signMat = new THREE.MeshBasicMaterial({ map: signTex });
  const signGeo = new THREE.PlaneGeometry(shelfWidth * 0.7, 0.35);
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, totalHeight - 0.1, shelfDepth / 2 + 0.06);
  bay.add(sign);

  return bay;
}

/**
 * Creates the Pharmacist Prescription Service Counter & Dispensing Lab Desk
 */
export function createPharmacistCounter(): THREE.Group {
  const counter = new THREE.Group();
  counter.name = 'pharmacist_counter';

  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.25,
    metalness: 0.4,
  });

  const surfaceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.1,
  });

  // Main Counter Island (8m long, 1.1m high)
  const deskBase = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.05, 1.4), deskMat);
  deskBase.position.set(0, 1.05 / 2, 0);
  deskBase.castShadow = true;
  deskBase.receiveShadow = true;
  counter.add(deskBase);

  // Countertop Marble / Corian surface
  const top = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.08, 1.5), surfaceMat);
  top.position.set(0, 1.05 + 0.04, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  counter.add(top);

  // Glass safety shield with dispensing cut-out
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.4,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.9,
    ior: 1.5,
  });
  const glass = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.0, 0.06), glassMat);
  glass.position.set(0, 1.05 + 0.08 + 0.5, 0.25);
  counter.add(glass);

  // Dispensing Pass-Through Slot
  const slotMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3 });
  const slot = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.5), slotMat);
  slot.position.set(0, 1.05 + 0.09, 0.25);
  counter.add(slot);

  // Pharmacy Terminal Screen
  const monitorGeo = new THREE.BoxGeometry(0.8, 0.5, 0.04);
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 512;
  screenCanvas.height = 320;
  const sctx = screenCanvas.getContext('2d')!;
  sctx.fillStyle = '#0f172a';
  sctx.fillRect(0, 0, 512, 320);
  sctx.fillStyle = '#10b981';
  sctx.font = 'bold 24px monospace';
  sctx.fillText('AURAPHARM DISPENSARY Rx', 30, 45);
  sctx.fillStyle = '#94a3b8';
  sctx.font = '16px monospace';
  sctx.fillText('ACTIVE PRESCRIPTIONS: 14', 30, 95);
  sctx.fillText('DISPENSING BOT STATUS: READY', 30, 130);
  sctx.fillText('INTERACTION ENGINE: ONLINE', 30, 165);
  sctx.fillStyle = '#38bdf8';
  sctx.fillRect(30, 210, 450, 4);

  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  const monitorMat = new THREE.MeshBasicMaterial({ map: screenTex });
  const monitor = new THREE.Mesh(monitorGeo, monitorMat);
  monitor.position.set(-1.8, 1.05 + 0.08 + 0.35, 0);
  monitor.rotation.y = 0.2;
  counter.add(monitor);

  // Monitor stand
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12), deskMat);
  stand.position.set(-1.8, 1.05 + 0.08 + 0.175, 0);
  counter.add(stand);

  return counter;
}

/**
 * Creates 3D pill / capsule models for the exploded/inspection pop-out view
 */
export function createCapsuleModel(primaryColor: string, secondaryColor: string): THREE.Group {
  const capsuleGroup = new THREE.Group();

  // Top half capsule
  const topMat = new THREE.MeshPhysicalMaterial({
    color: primaryColor,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1.0,
  });
  const botMat = new THREE.MeshPhysicalMaterial({
    color: secondaryColor,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1.0,
  });

  const topGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.22, 24);
  const topCyl = new THREE.Mesh(topGeo, topMat);
  topCyl.position.y = 0.11;
  capsuleGroup.add(topCyl);

  const topDomeGeo = new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const topDome = new THREE.Mesh(topDomeGeo, topMat);
  topDome.position.y = 0.22;
  capsuleGroup.add(topDome);

  // Bottom half capsule
  const botGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.22, 24);
  const botCyl = new THREE.Mesh(botGeo, botMat);
  botCyl.position.y = -0.11;
  capsuleGroup.add(botCyl);

  const botDomeGeo = new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const botDome = new THREE.Mesh(botDomeGeo, botMat);
  botDome.rotation.x = Math.PI;
  botDome.position.y = -0.22;
  capsuleGroup.add(botDome);

  // Center joining seam ring
  const seamGeo = new THREE.TorusGeometry(0.122, 0.008, 8, 24);
  const seamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const seam = new THREE.Mesh(seamGeo, seamMat);
  seam.rotation.x = Math.PI / 2;
  capsuleGroup.add(seam);

  capsuleGroup.rotation.z = Math.PI / 3;
  return capsuleGroup;
}
