import type { ContentAnalysis } from '@/types';

/**
 * Fixed, hand-authored analysis per post.
 *
 * NOTHING here is produced by a model. These are scripted answers chosen so
 * every assistant card variant and every confidence level appears at least
 * once during a test session.
 *
 * Wording constraint: each `explanation` must stay hedged and each analysis
 * must name at least one thing it cannot know in `limitations`.
 */
export const ANALYSES: Record<string, ContentAnalysis> = {
  'v-humor': {
    postId: 'v-humor',
    probableTone: 'humorous',
    confidence: 'high',
    explanation:
      'Der Beitrag ist wahrscheinlich als Witz über eigenes Missgeschick gemeint. Die Person übertreibt das Scheitern, statt sich zu beschweren.',
    indicators: [
      'Selbstironische Formulierung („Die Küche hat verloren“)',
      'Übertreibung als Pointe, nicht als Vorwurf',
      'Im Video sichtbares Lachen der Person',
    ],
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: [
      'Humor ist stark vom persönlichen Geschmack abhängig.',
      'Ob du den Beitrag witzig findest, kann die Analyse nicht wissen.',
    ],
    visibleFacialExpression: {
      label: 'Sichtbares Lachen',
      note: 'Beschreibt nur, was im Bild zu sehen ist – nicht, wie sich die Person wirklich fühlt.',
    },
    toneOfVoice: {
      label: 'Locker, mit Lachen in der Stimme',
      note: 'Simulierte Tonanalyse. Betonung und Lautstärke wirken entspannt.',
    },
    possibleIntent: 'Möchte vermutlich unterhalten und Alltagspech teilen.',
    alternativeReadings: [
      'Könnte auch als ernst gemeinte Frustration über die Aufgabe gelesen werden.',
      'Könnte ein bewusst gestellter Clip für Reichweite sein.',
    ],
  },

  'v-sarcasm': {
    postId: 'v-sarcasm',
    probableTone: 'sarcastic',
    confidence: 'medium',
    explanation:
      'Der Satz ist vermutlich nicht wörtlich gemeint. Die stark positive Formulierung steht im Widerspruch zum beschriebenen Problem.',
    indicators: [
      'Übertrieben positive Wortwahl („perfekt“, „ein Traum“)',
      'Widersprüchlicher Kontext: 50 Minuten Verspätung',
      'Verstärkende Schlussformel („Besser geht es kaum“)',
    ],
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: [
      'Ohne Tonfall bleibt Sarkasmus im Text unsicher.',
      'Manche Menschen formulieren tatsächlich so positiv.',
      'Die Analyse kennt die Vorgeschichte dieser Person nicht.',
    ],
    emotionalLanguage: {
      present: true,
      examples: ['„absolut perfekt“', '„wirklich ein Traum“'],
    },
    possibleIntent:
      'Möchte vermutlich Ärger über die Verspätung ausdrücken, ohne ihn direkt zu benennen.',
    alternativeReadings: [
      'Die Person könnte es ernst meinen und den Tag trotz Verspätung genießen.',
      'Es könnte ein Zitat oder eine Anspielung sein, die hier fehlt.',
    ],
  },

  'v-emotional': {
    postId: 'v-emotional',
    probableTone: 'frustrated',
    confidence: 'medium',
    explanation:
      'Der Beitrag wirkt persönlich und belastet. Die Person beschreibt eine schwierige Phase und benennt sie direkt, ohne Vorwurf an andere.',
    indicators: [
      'Direkte Ich-Formulierungen über eigene Belastung',
      'Hinweis, dass bewusst nichts herausgeschnitten wurde',
      'Im Video mehrfach hörbares tiefes Durchatmen',
    ],
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: [
      'Die Analyse kann nicht wissen, wie es der Person tatsächlich geht.',
      'Ein angespannter Ausdruck kann viele Ursachen haben, auch Müdigkeit oder Kameraangst.',
      'Der Beitrag könnte älter sein als die beschriebene Situation.',
    ],
    emotionalLanguage: {
      present: true,
      examples: ['„es ist gerade viel“', '„wollte das nicht wegschneiden“'],
    },
    visibleFacialExpression: {
      label: 'Sichtbarer angespannter Gesichtsausdruck',
      note: 'Beschreibt Augenbrauen und Mundwinkel im Bild. Kein Rückschluss auf das echte Empfinden.',
    },
    toneOfVoice: {
      label: 'Ruhig, aber mit Pausen und Stimmzittern',
      note: 'Simulierte Tonanalyse. Sprechtempo langsamer als im Kanaldurchschnitt.',
    },
    possibleIntent:
      'Möchte vermutlich etwas Persönliches teilen und Anteilnahme oder Verständnis finden.',
    alternativeReadings: [
      'Könnte auch eine bewusst inszenierte Erzählung für Aufmerksamkeit sein.',
      'Könnte eine Ankündigung sein, dass eine Pause folgt.',
    ],
  },

  'v-ragebait': {
    postId: 'v-ragebait',
    probableTone: 'aggressive',
    confidence: 'medium',
    explanation:
      'Der Beitrag könnte auf Reaktionen ausgerichtet sein. Er stellt eine große Gruppe pauschal als uninformiert dar und fordert danach ausdrücklich zum Kommentieren auf.',
    indicators: [
      'Pauschale Abwertung einer großen Gruppe',
      'Behauptung, niemand traue sich die Wahrheit zu sagen',
      'Direkte Aufforderung zum Kommentieren („ich lese ALLES“)',
      'Großbuchstaben als Verstärkung',
    ],
    polarizationLevel: 'high',
    possibleRagebait: true,
    limitations: [
      'Ob eine Reaktion beabsichtigt ist, lässt sich von außen nicht beweisen.',
      'Auch ein ehrlich gemeinter Beitrag kann so formuliert sein.',
      'Die Analyse bewertet die Formulierung, nicht die Sachfrage selbst.',
    ],
    emotionalLanguage: {
      present: true,
      examples: [
        '„niemand traut sich“',
        '„den Ernst der Lage nicht verstanden“',
        '„ich lese ALLES“',
      ],
    },
    visibleFacialExpression: {
      label: 'Sichtbar angespannte Mimik mit weit geöffneten Augen',
      note: 'Beschreibt nur das Bild. Mimik kann für die Kamera gespielt sein.',
    },
    toneOfVoice: {
      label: 'Schnell, laut, stark betont',
      note: 'Simulierte Tonanalyse. Hohe Lautstärke und kurze Pausen.',
    },
    possibleIntent:
      'Könnte darauf ausgelegt sein, Widerspruch zu erzeugen und damit Reichweite zu gewinnen.',
    alternativeReadings: [
      'Die Person könnte ehrlich empört sein und einfach deutlich formulieren.',
      'Der Beitrag könnte eine Zuspitzung eines längeren, sachlicheren Videos sein.',
      'Die Aufforderung zum Kommentieren könnte reine Gewohnheit des Formats sein.',
    ],
  },

  'v-lowcontext': {
    postId: 'v-lowcontext',
    probableTone: 'unclear',
    confidence: 'low',
    // Deliberately empty `indicators`: this is what drives the
    // "insufficient-context" card variant.
    indicators: [],
    explanation:
      'Für eine Einschätzung fehlt zu viel. Der Clip enthält keine Sprache, der Text besteht aus einem Wort, und es gibt keinen erkennbaren Bezug.',
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: [
      'Ohne Sprache, Text oder Kontext ist keine sinnvolle Aussage möglich.',
      'Der Beitrag könnte eine Antwort auf einen anderen Beitrag sein, den die Analyse nicht sieht.',
      'Ein Insiderwitz wäre von außen nicht erkennbar.',
    ],
    alternativeReadings: [
      'Könnte ein Test-Upload sein.',
      'Könnte ein Insiderwitz für Stammzuschauer sein.',
      'Könnte eine Reaktion auf ein Gespräch außerhalb der Plattform sein.',
    ],
  },

  'd-sarcasm': {
    postId: 'd-sarcasm',
    probableTone: 'sarcastic',
    confidence: 'high',
    explanation:
      'Der Beitrag ist mit hoher Wahrscheinlichkeit sarkastisch. Positive Bewertungen stehen direkt neben Angaben, die das Gegenteil beschreiben.',
    indicators: [
      'Direkter Widerspruch: „Läuft super“ neben „kippt nach links“',
      'Zitat der Werbeaussage „in 20 Minuten aufgebaut“ nach vier Stunden',
      'Abschließende Dankesformel als Zuspitzung („vielen Dank auch“)',
    ],
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: [
      'Die Analyse kann nicht prüfen, ob die Zeitangaben stimmen.',
      'Sarkasmus wird von manchen Lesenden trotzdem wörtlich verstanden.',
    ],
    emotionalLanguage: {
      present: true,
      examples: ['„Läuft super. Wirklich.“', '„extrem realistisch“'],
    },
    possibleIntent:
      'Möchte vermutlich Frust über die Aufbauanleitung humorvoll teilen.',
    alternativeReadings: [
      'Könnte in Teilen ernst gemeint sein, wenn die Person mit dem Ergebnis zufrieden ist.',
    ],
  },

  'd-doom-video': {
    postId: 'd-doom-video',
    probableTone: 'humorous',
    confidence: 'low',
    explanation:
      'Der Titel wirkt wie eine bewusst dramatische Fan-Zuspitzung. Ohne gesicherten Ursprung oder Kontext könnte der Clip ebenso ein Zusammenschnitt, eine Parodie oder eine spekulative Szene sein.',
    indicators: [
      'Titel verrät ein extremes Handlungsergebnis',
      'Video wird in einer Fan-Community geteilt',
      'Der Beitrag liefert keine Quelle oder Einordnung zum Clip',
    ],
    polarizationLevel: 'medium',
    possibleRagebait: false,
    limitations: [
      'Die Analyse kann Echtheit, Rechteinhaber und Entstehung des Videos nicht prüfen.',
      'Der Clip kann Spoiler, Fan-Montage oder inszeniertes Material enthalten.',
      'Aus Titel und Bildmaterial lässt sich keine offizielle Filmhandlung ableiten.',
    ],
    possibleIntent:
      'Möchte vermutlich unterhalten und eine Diskussion über eine dramatische Fan-Theorie auslösen.',
    alternativeReadings: [
      'Könnte eine ernst gemeinte Zusammenfassung einer Szene sein.',
      'Könnte eine Parodie oder ein Fan-Edit sein.',
      'Könnte absichtlich wie ein Spoiler formuliert sein, um Klicks zu bekommen.',
    ],
  },

  'd-kerle-meme': {
    postId: 'd-kerle-meme',
    probableTone: 'humorous',
    confidence: 'high',
    explanation:
      'Der Beitrag ist wahrscheinlich als wiederkehrender Mittwochs-Witz gemeint. Die feierliche Anrede und das absurde Tiermotiv wirken wie eine bewusst übertriebene Grußformel.',
    indicators: [
      'Bekräftigende Bildunterschrift „Es ist Mittwoch meine Kerle“',
      'Absurde Kombination aus Tierfigur, Hut und Bierflasche',
      'Kurzer Gruß ohne sachliche Behauptung oder Aufforderung',
    ],
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: [
      'Die Analyse kennt die Herkunft und frühere Verwendung des Bildes nicht.',
      'Ob einzelne Personen den Insiderwitz verstehen oder lustig finden, kann sie nicht wissen.',
    ],
    possibleIntent:
      'Möchte vermutlich mit einem bekannten Wochenritual unterhalten und Gemeinschaft erzeugen.',
    alternativeReadings: [
      'Könnte einfach als freundlicher Wochengruß ohne Insiderbezug gemeint sein.',
      'Könnte ein wiederverwendetes Bild ohne besondere persönliche Bedeutung sein.',
    ],
  },

  'd-irony': {
    postId: 'd-irony',
    probableTone: 'ironic',
    confidence: 'low',
    explanation:
      'Der Beitrag könnte ironisch gemeint sein, ist aber nicht eindeutig. Die Überschrift lobt, die Angaben im Text beschreiben eine Verschlechterung.',
    indicators: [
      'Lob in der Überschrift („echter Gewinn“) ohne Beleg im Text',
      'Sachangaben beschreiben eine Verschlechterung (30 statt 10 Minuten)',
      'Zurückhaltende Schlussformel, die auch ernst gemeint sein kann',
    ],
    polarizationLevel: 'medium',
    possibleRagebait: false,
    limitations: [
      'Trockene Ironie ist im Text besonders schwer zu erkennen.',
      'Die Formulierung wäre auch als sachliche Beschreibung möglich.',
      'Ein Kommentar im Thread deutet darauf hin, dass selbst Lesende sich uneinig sind.',
    ],
    emotionalLanguage: {
      present: false,
      examples: [],
    },
    possibleIntent:
      'Könnte Kritik am neuen Fahrplan sein, ohne sie direkt auszusprechen.',
    alternativeReadings: [
      'Die Person könnte den Fahrplan wirklich gut finden und die Nachteile nur nennen.',
      'Es könnte eine neutrale Zusammenfassung einer Pressemitteilung sein.',
      'Es könnte Kritik an der Kommunikation des Verkehrsverbunds sein, nicht am Fahrplan.',
    ],
  },

  'd-aggressive-headline': {
    postId: 'd-aggressive-headline',
    probableTone: 'unclear',
    confidence: 'medium',
    explanation:
      'Überschrift und Inhalt passen nicht zusammen. Die Überschrift ist stark zugespitzt, der Text darunter ist überwiegend sachlich und nennt konkrete Belege. Welcher Teil die eigentliche Aussage ist, ist nicht eindeutig.',
    indicators: [
      'Überschrift mit starker Wertung („Chaos“, „ruiniert“) und Ausrufezeichen',
      'Textteil nennt Termine, Protokollpunkte und Gründe',
      'Keine Abwertung von Personengruppen im Textteil',
    ],
    polarizationLevel: 'medium',
    possibleRagebait: false,
    limitations: [
      'Die Analyse kann nicht prüfen, ob die Angaben im Text zutreffen.',
      'Eine zugespitzte Überschrift ist üblich und nicht automatisch irreführend.',
      'Warum die Überschrift so gewählt wurde, ist von außen nicht erkennbar.',
    ],
    emotionalLanguage: {
      present: true,
      examples: ['„Schluss mit dem Chaos“', '„ruiniert unser Viertel“'],
    },
    possibleIntent:
      'Die Überschrift könnte auf Aufmerksamkeit ausgerichtet sein, der Text auf Information.',
    alternativeReadings: [
      'Die Überschrift könnte die ehrliche Meinung sein und der Text die Begründung.',
      'Der Beitrag könnte aus einem Newsletter übernommen sein, dessen Überschrift jemand anderes geschrieben hat.',
    ],
  },

  'd-polarising': {
    postId: 'd-polarising',
    probableTone: 'aggressive',
    confidence: 'high',
    explanation:
      'Der Beitrag wirkt stark zuspitzend formuliert. Er stellt zwei Gruppen gegeneinander und schließt eine sachliche Antwort rhetorisch von vornherein aus. Ob das so gemeint ist oder nur scharf klingt, kann die Analyse nicht entscheiden.',
    indicators: [
      'Pauschalaussage über eine ganze Gruppe („kein Zuhause oder keine Argumente“)',
      'Unterstellung eines Motivs („Kontrollfantasie“)',
      'Rhetorische Herausforderung statt Frage („Ich warte“)',
    ],
    polarizationLevel: 'high',
    // Not flagged as ragebait: the thread does receive substantive answers,
    // and the author engages with the topic rather than only farming replies.
    possibleRagebait: false,
    limitations: [
      'Eine scharfe Formulierung heißt nicht, dass die Sachposition falsch ist.',
      'Ob Reaktionen beabsichtigt sind, kann die Analyse nicht feststellen.',
      'Die Kommentare widersprechen sich – das ist ein Hinweis, kein Beweis.',
    ],
    emotionalLanguage: {
      present: true,
      examples: ['„Kontrollfantasie“', '„keine Argumente“', '„Ich warte“'],
    },
    possibleIntent:
      'Könnte eine echte Position zuspitzen, um Widerspruch einzufordern.',
    alternativeReadings: [
      'Die Person könnte schlechte Erfahrungen gemacht haben und deshalb scharf formulieren.',
      'Die Zuspitzung könnte ein Stilmittel für diese Community sein.',
      'Die Frage könnte ernst gemeint sein, trotz der Formulierung.',
    ],
  },
};

/** Analyses for individual comments in the discussion feed. */
export const COMMENT_ANALYSES: Record<string, ContentAnalysis> = {
  'd-irony-c2': {
    postId: 'd-irony-c2',
    probableTone: 'neutral',
    confidence: 'medium',
    explanation:
      'Der Kommentar benennt die eigene Unsicherheit direkt. Er ist wahrscheinlich wörtlich gemeint.',
    indicators: [
      'Ausdrücklicher Hinweis auf eigene Unsicherheit („sicher bin ich mir auch nicht“)',
      'Keine Übertreibung und keine Wertung',
    ],
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: ['Kurze Kommentare liefern wenig Anhaltspunkte.'],
    alternativeReadings: ['Könnte selbst ironisch gemeint sein.'],
  },
  'd-pol-c3': {
    postId: 'd-pol-c3',
    probableTone: 'neutral',
    confidence: 'high',
    explanation:
      'Der Kommentar ist wahrscheinlich sachlich gemeint. Er benennt Bedingungen statt Positionen und stellt die Fragestellung selbst in Frage.',
    indicators: [
      'Nennt Bedingungen („kommt auf Rolle und Wohnsituation an“)',
      'Keine Abwertung einer Gruppe',
      'Kritik richtet sich an die Frage, nicht an Personen',
    ],
    polarizationLevel: 'low',
    possibleRagebait: false,
    limitations: [
      'Auch vermittelnde Kommentare können eine Position bevorzugen.',
    ],
    alternativeReadings: [
      'Könnte ein Versuch sein, einer klaren Aussage auszuweichen.',
    ],
  },
};

export function getAnalysis(postId: string): ContentAnalysis | undefined {
  return ANALYSES[postId] ?? COMMENT_ANALYSES[postId];
}
