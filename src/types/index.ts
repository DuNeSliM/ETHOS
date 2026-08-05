/**
 * Central domain types for the ContextLens prototype.
 *
 * Naming rule enforced throughout the codebase:
 *  - `...Analysis`      -> a statement about the CONTENT of a post.
 *  - `estimated...`     -> a machine GUESS about the current viewer.
 *  - `selfReported...`  -> something the viewer actively TOLD us.
 * These three must never be merged into one value or one UI element.
 */

/* ------------------------------------------------------------------ */
/* Content analysis                                                    */
/* ------------------------------------------------------------------ */

export type ProbableTone =
  | 'neutral'
  | 'humorous'
  | 'sarcastic'
  | 'ironic'
  | 'frustrated'
  | 'aggressive'
  | 'unclear';

export type Confidence = 'low' | 'medium' | 'high';

export type PolarizationLevel = 'low' | 'medium' | 'high';

/**
 * The presentation variant of the assistant card. Derived from the analysis
 * rather than stored per post, so a card style can never contradict its data.
 */
export type AssistantCardVariant =
  | 'sarcasm'
  | 'irony'
  | 'emotional'
  | 'exaggeration'
  | 'ragebait'
  | 'ambiguous'
  | 'insufficient-context';

export type ContentAnalysis = {
  postId: string;
  probableTone: ProbableTone;
  confidence: Confidence;
  /** One or two plain-language sentences. Always hedged. */
  explanation: string;
  /** Concrete, checkable observations the estimate is built on. */
  indicators: string[];
  polarizationLevel: PolarizationLevel;
  possibleRagebait: boolean;
  /** What this analysis cannot know. Rendered verbatim in the UI. */
  limitations: string[];
  /** Present when the content carries emotionalising or loaded wording. */
  emotionalLanguage?: {
    present: boolean;
    examples: string[];
  };
  /**
   * Only for video posts: what is visible in the creator's face. A
   * description of appearance, never a claim about an inner state.
   */
  visibleFacialExpression?: {
    label: string;
    note: string;
  };
  /** Only for video/audio posts. */
  toneOfVoice?: {
    label: string;
    note: string;
  };
  /** Possible communicative intent, phrased as a hypothesis. */
  possibleIntent?: string;
  /** Alternative readings offered under "Andere Interpretation". */
  alternativeReadings: string[];
};

/* ------------------------------------------------------------------ */
/* Posts                                                               */
/* ------------------------------------------------------------------ */

export type FeedMode = 'visual' | 'discussion';

export type PostKind = 'video' | 'image' | 'text-post' | 'thread';

/** The drawn scenes in `features/feed/PostScene.tsx`. */
export type SceneId =
  | 'kitchen-egg'
  | 'rainy-platform'
  | 'talking-head'
  | 'street-rant'
  | 'empty-lot';

/** Two colours a scene builds its gradients from. */
export type ScenePalette = [string, string];

export type SimulatedMedia = {
  kind: 'video' | 'image';
  /** Short caption describing what the media shows. */
  altText: string;
  /** Colours the drawn scene is built from. */
  palette: ScenePalette;
  /** Seconds. Only meaningful for `kind: 'video'`. */
  durationSeconds?: number;
  /** Which illustration stands in for the missing footage. */
  scene: SceneId;
  /**
   * Path to a real file under `public/media/`. When present it replaces the
   * drawing entirely - that is how a real clip gets into the demo. See
   * `public/media/README.md`.
   */
  src?: string;
  /** Poster frame for a real video, same folder. */
  poster?: string;
  /**
   * Caption burned into the picture, the way this genre's jokes carry their
   * punchline. Rendered over the media, not as part of the post text.
   */
  overlayText?: { top?: string; bottom?: string };
};

export type Comment = {
  id: string;
  author: string;
  body: string;
  upvotes: number;
  /** Comments can carry their own analysis (e.g. a sarcastic reply). */
  hasAnalysis: boolean;
};

export type Post = {
  id: string;
  mode: FeedMode;
  kind: PostKind;
  author: string;
  authorHandle: string;
  /** Discussion-feed posts have a headline; visual posts usually do not. */
  title?: string;
  body: string;
  /** Community/board name for the discussion feed. */
  community?: string;
  postedAgo: string;
  likes: number;
  commentCount: number;
  media?: SimulatedMedia;
  comments?: Comment[];
  /**
   * Short label describing which research question this example was built
   * for. Shown only in Research Mode, never in the plain feed.
   */
  researchNote: string;
};

/* ------------------------------------------------------------------ */
/* Viewer reaction (machine estimate + self report)                    */
/* ------------------------------------------------------------------ */

export type EstimatedExpression =
  | 'smile'
  | 'surprise'
  | 'tense'
  | 'neutral'
  | 'unclear';

export type SelfReportedReaction =
  | 'amused'
  | 'interested'
  | 'surprised'
  | 'confused'
  | 'annoyed'
  | 'angry'
  | 'uncomfortable'
  | 'neutral'
  | 'other';

export type ViewerReaction = {
  postId: string;
  /** Epoch ms. */
  timestamp: number;
  estimatedExpression: EstimatedExpression;
  /** 0..1 - how sure the simulated detector claims to be. */
  confidence: number;
  selfReportedReaction?: SelfReportedReaction;
  /** Free text when `selfReportedReaction === 'other'`. */
  selfReportedNote?: string;
};

/** One segment of the simulated reaction timeline under a video. */
export type ReactionTimelineSegment = {
  fromSeconds: number;
  toSeconds: number;
  expression: EstimatedExpression;
  /** Reaction word shown to the user, e.g. "amüsiert". */
  label: string;
  confidence: number;
};

/* ------------------------------------------------------------------ */
/* Community reactions                                                 */
/* ------------------------------------------------------------------ */

export type CommunityReactionSummary = {
  postId: string;
  participantCount: number;
  /** Share in percent, keyed by reaction id. Camera estimates. */
  estimatedReactions: Record<string, number>;
  /** Share in percent, keyed by reaction id. Active self reports. */
  selfReportedReactions: Record<string, number>;
  /** How many of the participants actively answered rather than being estimated. */
  selfReportedParticipantCount: number;
  representativeWarning: string;
  /** Plain-language description of where these numbers come from. */
  sourceExplanation: string;
};

export type CommunitySource = 'estimated' | 'self-reported';

/* ------------------------------------------------------------------ */
/* Settings & consent                                                  */
/* ------------------------------------------------------------------ */

/**
 * Every assistance feature is opt-in and independently switchable.
 * `simulatedCameraCapture` and `shareAnonymousReaction` MUST default to false.
 */
export type Settings = {
  contentAnalysis: boolean;
  sarcasmHints: boolean;
  ragebaitHints: boolean;
  /** The simulated own-reaction detection. Never on by default. */
  simulatedCameraCapture: boolean;
  /** Optional live camera preview (display only). Never on by default. */
  liveCameraPreview: boolean;
  shareAnonymousReaction: boolean;
  showCommunityReactions: boolean;
  /** Persist the reaction history to localStorage. */
  storeReactionHistory: boolean;
  /** Assistant hints appear collapsed (default) or auto-expanded. */
  hintVisibility: 'on-demand' | 'subtle-auto';
  theme: 'system' | 'light' | 'dark';
  /** Master pause - keeps settings but stops all analysis. */
  assistantPaused: boolean;
};

/* ------------------------------------------------------------------ */
/* History                                                             */
/* ------------------------------------------------------------------ */

export type HistoryEntry = {
  id: string;
  postId: string;
  viewedAt: number;
  /** Undefined when the camera simulation was off while viewing. */
  estimatedExpression?: EstimatedExpression;
  selfReportedReaction?: SelfReportedReaction;
  selfReportedNote?: string;
  /** Snapshot so the overview stays readable after a demo reset. */
  contentCategory: ContentCategory;
  openedAssistant: boolean;
};

export type ContentCategory =
  | 'humor'
  | 'sarcasm'
  | 'emotional'
  | 'polarising'
  | 'informational';

/* ------------------------------------------------------------------ */
/* Research mode                                                       */
/* ------------------------------------------------------------------ */

export type ResearchScenarioId = 'sarcasm' | 'community' | 'correction';

export type ResearchRatingKey =
  | 'understandable'
  | 'helpful'
  | 'intrusive'
  | 'trust';

export type ResearchResult = {
  scenarioId: ResearchScenarioId;
  completedAt: number;
  /** 1..5 per question. */
  ratings: Record<ResearchRatingKey, number | null>;
  freeText: string;
  /** Wall-clock seconds the participant spent in the scenario. */
  durationSeconds: number;
};

/* ------------------------------------------------------------------ */
/* Feedback on the assistant itself                                    */
/* ------------------------------------------------------------------ */

export type AssistantFeedback = {
  postId: string;
  at: number;
  kind: 'not-helpful' | 'other-interpretation';
  note?: string;
};
