import { Medication } from '../data/medications.ts';

export interface SafetyAlert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  involvedMeds: string[];
}

/**
 * Checks for drug-drug interactions and duplicate active ingredients
 */
export function evaluateCartSafety(cartItems: { med: Medication; quantity: number }[]): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  if (cartItems.length < 2) return alerts;

  const meds = cartItems.map((c) => c.med);

  // 1. Check for Duplicate Acetaminophen (Toxicity Warning)
  const acetaminophenMeds = meds.filter((m) =>
    m.genericName.toLowerCase().includes('acetaminophen') ||
    m.activeIngredients.some((ai) => ai.name.toLowerCase().includes('acetaminophen'))
  );

  if (acetaminophenMeds.length > 1) {
    alerts.push({
      id: 'duplicate-acetaminophen',
      type: 'danger',
      title: 'Acetaminophen Overdose Caution',
      description: `You have multiple medications containing Acetaminophen (${acetaminophenMeds.map((m) => m.name.split(' ')[0]).join(' and ')}). Exceeding 4,000 mg in 24 hours can cause severe liver damage.`,
      involvedMeds: acetaminophenMeds.map((m) => m.id),
    });
  }

  // 2. Check for Multiple NSAIDs (Stomach bleed risk: Ibuprofen, Naproxen, Diclofenac)
  const nsaidKeywords = ['ibuprofen', 'naproxen', 'diclofenac', 'aspirin'];
  const nsaidMeds = meds.filter((m) =>
    nsaidKeywords.some((k) => m.genericName.toLowerCase().includes(k))
  );

  if (nsaidMeds.length > 1) {
    alerts.push({
      id: 'nsaid-duplication',
      type: 'warning',
      title: 'Combined NSAID Alert',
      description: `Combining multiple NSAIDs (${nsaidMeds.map((m) => m.name.split(' ')[0]).join(' + ')}) significantly increases the risk of gastric bleeding and kidney strain. Consult your pharmacist before concurrent use.`,
      involvedMeds: nsaidMeds.map((m) => m.id),
    });
  }

  // 3. Check for specific dangerous cross-interactions (e.g. NSAID + ACE Inhibitor like Lisinopril)
  const hasNsaid = nsaidMeds.length > 0;
  const hasAceInhibitor = meds.some((m) => m.genericName.toLowerCase().includes('lisinopril'));

  if (hasNsaid && hasAceInhibitor) {
    const aceMed = meds.find((m) => m.genericName.toLowerCase().includes('lisinopril'))!;
    alerts.push({
      id: 'nsaid-lisinopril',
      type: 'warning',
      title: 'NSAID + ACE Inhibitor Interaction',
      description: `NSAIDs may diminish the blood pressure lowering effect of ${aceMed.name} and increase the risk of acute renal dysfunction.`,
      involvedMeds: [aceMed.id, ...nsaidMeds.map((m) => m.id)],
    });
  }

  return alerts;
}
