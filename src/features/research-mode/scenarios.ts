import type { ResearchScenarioId } from '@/types';

export type Scenario = {
  id: ResearchScenarioId;
  title: string;
  /** What the moderator wants to learn. Shown to the participant too. */
  goal: string;
  /** Numbered steps the participant works through. */
  steps: string[];
  /** Where the task starts. */
  startPath: string;
  startLabel: string;
};

/**
 * The three guided tasks from the brief.
 *
 * Tasks are phrased as goals ("find out whether...") rather than as click paths
 * ("press the button at the bottom right"), because half of what we want to
 * learn is whether people can find the controls unaided.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: 'sarcasm',
    title: 'Szenario 1: Sarkasmus in einem Beitrag verstehen',
    goal:
      'Wir möchten wissen, ob die Assistenzkarte verständlich macht, dass ein Beitrag vermutlich nicht wörtlich gemeint ist – und ob die Unsicherheit der Einschätzung ankommt.',
    steps: [
      'Öffne den Visual Feed und suche den Beitrag von Jonas Reiter über die Zugverspätung.',
      'Lies die Bildunterschrift und überlege dir zuerst selbst, wie sie gemeint ist.',
      'Öffne dann „Kontext erklären“ an diesem Beitrag.',
      'Sieh dir an, wie sicher die Einschätzung ist und woran sie festgemacht wird.',
      'Öffne auch „Warum wird das so eingeschätzt?“.',
    ],
    startPath: '/instagram',
    startLabel: 'Visual Feed öffnen',
  },
  {
    id: 'community',
    title: 'Szenario 2: Community-Reaktionen eines polarisierenden Posts einordnen',
    goal:
      'Wir möchten wissen, ob die Trennung zwischen automatischen Schätzungen und aktiven Selbstauskünften verstanden wird – und ob der Hinweis auf fehlende Repräsentativität ankommt.',
    steps: [
      'Öffne im Visual Feed den Beitrag von „Klartext Daily“ über das Autofahren.',
      'Lies die Einschätzung der Assistenzschicht zu diesem Beitrag.',
      'Öffne die getrennte Analyseansicht über „ETHOS-Auswertung“.',
      'Sieh dir die Community-Reaktionen an und wechsle zwischen „Automatische Schätzungen“ und „Aktive Selbstauskünfte“.',
      'Überlege: Was sagen diese Zahlen aus – und was nicht?',
    ],
    startPath: '/instagram/post/v-ragebait/ethos',
    startLabel: 'Beitrag direkt öffnen',
  },
  {
    id: 'correction',
    title: 'Szenario 3: Eigene Reaktion korrigieren und Datenschutzoptionen finden',
    goal:
      'Wir möchten wissen, ob die Korrekturfunktion gefunden wird, ob die Trennung von Schätzung und eigener Angabe klar ist – und ob Pausieren und Löschen auffindbar sind.',
    steps: [
      'Schalte die simulierte eigene Reaktionserfassung ein, falls sie aus ist.',
      'Öffne einen Beitrag im Feed. Die Schätzung erscheint als kleiner Hinweis am Beitrag.',
      'Die Schätzung passt bei „Klartext Daily“ absichtlich nicht. Korrigiere sie auf die Reaktion, die für dich stimmt.',
      'Prüfe, ob du danach noch erkennen kannst, was geschätzt und was von dir angegeben wurde.',
      'Finde anschließend die Möglichkeit, den Assistenten zu pausieren und alle Daten zu löschen.',
    ],
    startPath: '/ethos/settings',
    startLabel: 'Einstellungen öffnen',
  },
];

export function getScenario(id: ResearchScenarioId): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}
