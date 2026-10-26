import * as THREE from 'three';
import { Medication } from '../data/medications.ts';

/**
 * Creates high-fidelity pharmaceutical bottle label texture
 */
export function createBottleLabelTexture(med: Medication): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Clean sterile pharmaceutical white/off-white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Left 25%: Drug facts & directions
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 260, canvas.height);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 260, canvas.height);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DRUG FACTS', 20, 36);

  ctx.fillStyle = '#475569';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Active Ingredient / Purpose', 20, 60);
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  const firstIng = med.activeIngredients[0];
  ctx.fillText(`${firstIng.name} ${firstIng.amount}`, 20, 78);
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(firstIng.purpose.slice(0, 30), 20, 94);

  // Indications & Uses
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Uses & Relief:', 20, 130);
  ctx.fillStyle = '#475569';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  med.indications.slice(0, 3).forEach((ind, i) => {
    ctx.fillText(`• ${ind}`, 20, 150 + i * 18);
  });

  // Warnings
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Safety Warnings:', 20, 225);
  ctx.fillStyle = '#64748b';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Keep out of reach of children.', 20, 245);
  ctx.fillText('Tamper evident: do not use if broken.', 20, 262);

  // Barcode
  ctx.fillStyle = '#0f172a';
  for (let b = 0; b < 40; b++) {
    const bw = (b % 3 === 0 ? 4 : 2);
    ctx.fillRect(20 + b * 5, 410, bw, 45);
  }
  ctx.font = '11px monospace';
  ctx.fillText(med.ndcCode, 20, 475);

  // Center 50%: Hero Front Label
  const cx = 260;
  const cw = 500;

  // Top color banner with primary color
  const grad = ctx.createLinearGradient(cx, 0, cx + cw, 0);
  grad.addColorStop(0, med.packageStyle.primaryColor);
  grad.addColorStop(1, med.packageStyle.accentGlow || med.packageStyle.primaryColor);
  ctx.fillStyle = grad;
  ctx.fillRect(cx, 0, cw, 110);

  // Pharmacy brand header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.brand.toUpperCase(), cx + 24, 38);

  // Medical Badge
  ctx.fillStyle = med.requiresPrescription ? '#ef4444' : '#10b981';
  ctx.beginPath();
  ctx.roundRect(cx + cw - 120, 20, 100, 28, 6);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(med.requiresPrescription ? 'Rx ONLY' : 'OTC CARE', cx + cw - 70, 39);
  ctx.textAlign = 'left';

  // Product Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
  // Split name if long
  const words = med.name.split(' ');
  const line1 = words.slice(0, 3).join(' ');
  const line2 = words.slice(3).join(' ');
  ctx.fillText(line1, cx + 24, 160);
  if (line2) {
    ctx.fillText(line2, cx + 24, 196);
  }

  // Generic name
  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`(${med.genericName})`, cx + 24, 228);

  // Strength pill badge
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.roundRect(cx + 24, 250, 160, 48, 8);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = med.packageStyle.primaryColor;
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.strength, cx + 38, 283);

  // Dosage form & count
  ctx.fillStyle = '#334155';
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.dosageForm, cx + 200, 280);

  // Secondary badge strip
  if (med.badge) {
    ctx.fillStyle = med.packageStyle.secondaryColor || '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(cx + 24, 320, 180, 28, 4);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`★ ${med.badge.toUpperCase()}`, cx + 36, 339);
  }

  // Bottom safety guarantee
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cx, 440, cw, 72);
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(cx, 440);
  ctx.lineTo(cx + cw, 440);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('AuraPharm Certified Quality • Tamper Evident Safety Cap', cx + 24, 475);

  // Right 25%: Dosing chart & warnings
  const rx = cx + cw;
  const rw = canvas.width - rx;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(rx, 0, rw, canvas.height);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(rx, 0, rw, canvas.height);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DOSAGE & STORAGE', rx + 20, 36);

  ctx.fillStyle = '#475569';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Directions for use:', rx + 20, 68);

  const dirWords = med.directions.split(' ');
  let line = '';
  let y = 90;
  for (const w of dirWords) {
    if ((line + w).length > 28) {
      ctx.fillText(line, rx + 20, y);
      line = w + ' ';
      y += 18;
    } else {
      line += w + ' ';
    }
  }
  if (line) ctx.fillText(line, rx + 20, y);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Storage Information:', rx + 20, 240);
  ctx.fillStyle = '#475569';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Room temperature: 20-25°C', rx + 20, 260);
  ctx.fillText('Protect from excessive humidity', rx + 20, 276);

  // Tamper mark
  ctx.strokeStyle = '#94a3b8';
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(rx + 20, 320, rw - 40, 60);
  ctx.setLineDash([]);
  ctx.fillStyle = '#64748b';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LOT: 2026-X992A', rx + rw / 2, 345);
  ctx.fillText('EXP: 11/2028', rx + rw / 2, 362);
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates texture for medicine boxes
 */
export function createBoxTexture(med: Medication): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Front face (center 512x512)
  const fx = 256;
  const fy = 256;
  const fw = 512;
  const fh = 512;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(fx, fy, fw, fh);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(fx, fy, fw, fh);

  // Gradient top
  const grad = ctx.createLinearGradient(fx, fy, fx + fw, fy + 120);
  grad.addColorStop(0, med.packageStyle.primaryColor);
  grad.addColorStop(1, med.packageStyle.accentGlow || med.packageStyle.primaryColor);
  ctx.fillStyle = grad;
  ctx.fillRect(fx, fy, fw, 110);

  // Brand banner
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.brand, fx + 30, fy + 45);

  // Badge
  ctx.fillStyle = med.requiresPrescription ? '#ef4444' : '#10b981';
  ctx.beginPath();
  ctx.roundRect(fx + fw - 110, fy + 24, 85, 30, 6);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(med.requiresPrescription ? 'Rx ONLY' : 'OTC', fx + fw - 68, fy + 44);
  ctx.textAlign = 'left';

  // Medicine Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.name.slice(0, 22), fx + 30, fy + 170);

  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.genericName, fx + 30, fy + 205);

  // Strength tag
  ctx.fillStyle = med.packageStyle.primaryColor;
  ctx.beginPath();
  ctx.roundRect(fx + 30, fy + 230, 160, 45, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.strength, fx + 50, fy + 262);

  // Dosage form
  ctx.fillStyle = '#334155';
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(med.dosageForm, fx + 210, fy + 260);

  // Hologram seal simulation
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(fx + 30, fy + 320, 100, 45);
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TAMPER SEAL', fx + 40, fy + 346);

  // Barcode
  ctx.fillStyle = '#0f172a';
  for (let b = 0; b < 32; b++) {
    const bw = (b % 2 === 0 ? 3 : 1.5);
    ctx.fillRect(fx + 30 + b * 5, fy + 430, bw, 40);
  }
  ctx.font = '10px monospace';
  ctx.fillText(med.ndcCode, fx + 30, fy + 485);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates luxury architectural pharmacy terrazzo floor texture
 */
export function createFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base terrazzo light warm porcelain tone
  ctx.fillStyle = '#eef2f6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Procedural stone aggregate specks (slate, marble, quartz)
  const speckColors = ['#cbd5e1', '#94a3b8', '#e2e8f0', '#059669', '#38bdf8', '#fbbf24'];
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2.2 + 0.6;
    ctx.fillStyle = speckColors[Math.floor(Math.random() * speckColors.length)];
    ctx.globalAlpha = Math.random() * 0.45 + 0.15;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Modern architectural brass inlay grid lines (every 256px)
  ctx.strokeStyle = '#d4af37'; // brass gold inlay
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.25;
  for (let p = 0; p <= 1024; p += 256) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(1024, p);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates digital e-ink shelf price tag runner texture
 */
export function createShelfEdgeTexture(title: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft glowing colored accent bar
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, 4);

  // Title text
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title.toUpperCase(), 20, 40);

  // Status icon
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(canvas.width - 30, 36, 6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates glowing suspended overhead aisle indicator banner
 */
export function createAisleSignTexture(aisleNum: number, category: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cyan/Mint border
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Aisle number
  ctx.fillStyle = '#10b981';
  ctx.font = '800 54px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`AISLE ${aisleNum}`, canvas.width / 2, 85);

  // Category line
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(category, canvas.width / 2, 145);

  // Small subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('AuraPharm • Smart Spatial Dispensary', canvas.width / 2, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
