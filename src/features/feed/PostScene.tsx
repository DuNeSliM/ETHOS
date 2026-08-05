import type { ScenePalette, SceneId } from '@/types';

/**
 * Drawn stand-ins for the posts' pictures and clips.
 *
 * The prototype ships no photographs and no film. A grey box with a caption
 * under it, though, is not what a participant scrolls past in real life - and
 * the whole point of this feed is that it should feel like one, so that people
 * pay attention to the assistance layer rather than to an unfamiliar surface.
 *
 * So each post gets a flat illustration of what its clip would show, drawn as
 * SVG: no copyright questions, no external files, no network request, and it
 * scales to any screen. Where a scene stands for a video, parts of it move
 * while the simulated playback is running (`isPlaying`).
 *
 * Real footage can replace any of these at any time - set `src` on the post's
 * media and the file wins over the drawing. See `public/media/README.md`.
 */
export function PostScene({
  scene,
  palette,
  isPlaying = false,
}: {
  scene: SceneId;
  palette: ScenePalette;
  isPlaying?: boolean;
}) {
  const Scene = SCENES[scene];
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`size-full ${isPlaying ? 'scene-playing' : ''}`}
    >
      <Scene palette={palette} />
    </svg>
  );
}

type SceneProps = { palette: ScenePalette };

/* ------------------------------------------------------------------ */
/* v-humor: the one-handed egg, and the kitchen that lost              */
/* ------------------------------------------------------------------ */

function KitchenEgg({ palette }: SceneProps) {
  return (
    <>
      <defs>
        <linearGradient id="kitchen-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill="url(#kitchen-wall)" />

      {/* wall tiles */}
      <g opacity="0.18" stroke="#ffffff" strokeWidth="2">
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <line key={row} x1="0" y1={40 + row * 44} x2="400" y2={40 + row * 44} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
          <line key={col} x1={col * 52} y1="0" x2={col * 52} y2="300" />
        ))}
      </g>

      {/* worktop */}
      <rect x="0" y="300" width="400" height="200" fill="#f2e6d2" />
      <rect x="0" y="300" width="400" height="12" fill="#d9c7ab" />

      {/* the cook */}
      <g>
        <ellipse cx="150" cy="470" rx="86" ry="120" fill="#3e4a63" />
        <circle cx="150" cy="238" r="52" fill="#e8b490" />
        {/* hair */}
        <path d="M98 232a52 52 0 0 1 104 0c0-36-24-58-52-58s-52 22-52 58Z" fill="#40312a" />
        {/* squeezed-shut eyes, the universal sign of a plan going wrong */}
        <path
          d="M126 234q8-9 16 0M158 234q8-9 16 0"
          stroke="#40312a"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* open, laughing mouth */}
        <path d="M132 258q18 22 36 0Z" fill="#8c3b3b" />
      </g>

      {/* the raised, apologetic free hand */}
      <g className="scene-wobble" style={{ transformOrigin: '246px 330px' }}>
        <path
          d="M232 344c-6-20 2-40 14-46 10-5 18 2 20 12 3-12 14-14 20-8 6-8 18-4 18 8 8-2 14 6 10 18-6 20-18 34-38 38-18 4-38-6-44-22Z"
          fill="#e8b490"
        />
      </g>

      {/* bowl, and the shell that missed */}
      <ellipse cx="292" cy="404" rx="72" ry="26" fill="#ffffff" />
      <path d="M220 404a72 26 0 0 0 144 0v6a72 40 0 0 1-144 0Z" fill="#e4e8ee" />
      <ellipse cx="292" cy="404" rx="52" ry="16" fill="#f6d365" />
      <ellipse cx="286" cy="401" rx="14" ry="10" fill="#fff8e1" />

      <g className="scene-drop">
        <ellipse cx="330" cy="368" rx="13" ry="10" fill="#fdf6e6" />
        <ellipse cx="352" cy="382" rx="9" ry="7" fill="#fdf6e6" />
      </g>

      {/* splatter on the worktop */}
      <g fill="#f6d365" opacity="0.85">
        <ellipse cx="90" cy="430" rx="20" ry="7" />
        <circle cx="120" cy="446" r="5" />
        <circle cx="62" cy="450" r="4" />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* v-sarcasm: the platform, the board, the cup                         */
/* ------------------------------------------------------------------ */

function RainyPlatform({ palette }: SceneProps) {
  return (
    <>
      <defs>
        <linearGradient id="platform-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[0]} />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill="url(#platform-sky)" />

      {/* canopy */}
      <path d="M0 0h400v78L200 96 0 78Z" fill="#2f3b48" />
      <rect x="188" y="90" width="16" height="150" fill="#46545f" />

      {/* the departure board */}
      <g>
        <rect x="96" y="104" width="208" height="104" rx="8" fill="#12181f" />
        <rect x="106" y="114" width="188" height="84" rx="4" fill="#0a0f14" />
        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(114 ${126 + row * 20})`}>
            <rect width="46" height="9" rx="2" fill="#f3b03c" opacity="0.9" />
            <rect x="56" width="72" height="9" rx="2" fill="#f3b03c" opacity="0.55" />
            {/* every single line delayed - the joke of the picture */}
            <rect x="138" width="34" height="9" rx="2" fill="#ef5a5a" />
          </g>
        ))}
      </g>

      {/* rails and platform edge */}
      <rect x="0" y="330" width="400" height="170" fill="#5c6672" />
      <rect x="0" y="330" width="400" height="10" fill="#7d8794" />
      <g fill="#c9ac3a">
        <rect x="0" y="352" width="400" height="7" opacity="0.75" />
      </g>

      {/* the cup, on its side */}
      <g transform="translate(250 396) rotate(-104)">
        <path d="M0 0h44l-6 46H6Z" fill="#ffffff" />
        <rect x="-3" y="-9" width="50" height="11" rx="4" fill="#9c5a34" />
      </g>
      <ellipse cx="222" cy="424" rx="46" ry="13" fill="#6b4a30" opacity="0.75" />

      {/* rain */}
      <g className="scene-rain" stroke="#dfe8f2" strokeWidth="2" opacity="0.55">
        {Array.from({ length: 26 }, (_, index) => {
          const x = (index * 37) % 400;
          const y = (index * 73) % 340;
          return <line key={index} x1={x} y1={y} x2={x - 9} y2={y + 30} />;
        })}
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* v-emotional: someone talking straight into the lens                 */
/* ------------------------------------------------------------------ */

function TalkingHead({ palette }: SceneProps) {
  return (
    <>
      <defs>
        <radialGradient id="room-light" cx="0.5" cy="0.3" r="0.9">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill="url(#room-light)" />

      {/* a room behind: shelf, plant, lamp glow */}
      <rect x="24" y="150" width="120" height="8" rx="3" fill="#000000" opacity="0.25" />
      <rect x="40" y="118" width="14" height="32" fill="#000000" opacity="0.22" />
      <rect x="60" y="126" width="11" height="24" fill="#000000" opacity="0.22" />
      <path
        d="M330 158c-14 0-26 12-26 30s12 34 26 34 26-16 26-34-12-30-26-30Z"
        fill="#000000"
        opacity="0.18"
      />
      <rect x="325" y="220" width="12" height="40" fill="#000000" opacity="0.18" />

      {/* shoulders and head, close to the camera the way a confessional is */}
      <path d="M60 500c0-92 62-150 140-150s140 58 140 150Z" fill="#2e2a44" />
      <circle cx="200" cy="252" r="86" fill="#e0a888" />
      <path
        d="M114 244c0-52 38-88 86-88s86 36 86 88c0-64-30-96-86-96s-86 32-86 96Z"
        fill="#2b2118"
      />

      {/* eyes, slightly downcast; no smile */}
      <g fill="#2b2118">
        <ellipse cx="172" cy="248" rx="7" ry="8" />
        <ellipse cx="228" cy="248" rx="7" ry="8" />
      </g>
      <path
        d="M158 228q14-10 28-2M214 226q14-8 28 2"
        stroke="#2b2118"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* a flat, level mouth - the scene must not read as either happy or angry */}
      <path
        d="M180 296q20 8 40 0"
        stroke="#8c5a52"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* the low-light grain of a phone camera indoors */}
      <rect width="400" height="500" fill="url(#room-light)" opacity="0" />
      <g className="scene-breathe" opacity="0.18" fill="#ffffff">
        <circle cx="86" cy="96" r="2" />
        <circle cx="312" cy="70" r="2" />
        <circle cx="248" cy="132" r="1.6" />
        <circle cx="132" cy="188" r="1.6" />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* v-ragebait: the street, the gestures, the caps lock                 */
/* ------------------------------------------------------------------ */

function StreetRant({ palette }: SceneProps) {
  return (
    <>
      <defs>
        <linearGradient id="street-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill="url(#street-bg)" />

      {/* traffic behind, blurred into blocks */}
      <g opacity="0.4">
        <rect x="0" y="250" width="400" height="90" fill="#1d232c" />
        {[10, 96, 190, 286].map((x) => (
          <g key={x}>
            <rect x={x} y="266" width="72" height="40" rx="8" fill="#39424f" />
            <rect x={x + 10} y="252" width="46" height="20" rx="6" fill="#39424f" />
            <circle cx={x + 60} cy="300" r="6" fill="#ffd76a" />
          </g>
        ))}
      </g>
      <rect x="0" y="340" width="400" height="160" fill="#232a33" />

      {/* the speaker, filling the frame */}
      <path d="M92 500c0-86 48-136 108-136s108 50 108 136Z" fill="#1f2733" />
      <circle cx="200" cy="286" r="72" fill="#dda57f" />
      <path d="M128 280c0-44 32-74 72-74s72 30 72 74c0-56-26-84-72-84s-72 28-72 84Z" fill="#221a14" />

      {/* raised brows and a wide, mid-sentence mouth */}
      <g fill="#221a14">
        <ellipse cx="176" cy="282" rx="6" ry="7" />
        <ellipse cx="224" cy="282" rx="6" ry="7" />
      </g>
      <path
        d="M162 258q14-14 28-6M210 252q14-8 28 6"
        stroke="#221a14"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="200" cy="322" rx="20" ry="13" fill="#6d2b2b" />

      {/* both hands up, mid-gesture */}
      <g className="scene-gesture">
        <ellipse cx="86" cy="392" rx="30" ry="38" fill="#dda57f" />
        <ellipse cx="314" cy="374" rx="30" ry="38" fill="#dda57f" />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* v-lowcontext: four seconds of nothing at all                        */
/* ------------------------------------------------------------------ */

function EmptyLot({ palette }: SceneProps) {
  return (
    <>
      <defs>
        <linearGradient id="lot-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette[1]} />
          <stop offset="60%" stopColor={palette[0]} />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill="url(#lot-sky)" />
      <rect x="0" y="250" width="400" height="250" fill="#6f7883" />

      {/* horizon: a fence and two far-off buildings, nothing else */}
      <rect x="0" y="236" width="400" height="16" fill="#57606b" />
      <rect x="40" y="196" width="70" height="42" fill="#5f6873" />
      <rect x="270" y="184" width="90" height="54" fill="#5f6873" />

      {/* parking bays, converging - the pan of an empty lot */}
      <g className="scene-pan" stroke="#e6e9ec" strokeWidth="5" opacity="0.75">
        <line x1="-40" y1="500" x2="120" y2="256" />
        <line x1="80" y1="500" x2="176" y2="256" />
        <line x1="200" y1="500" x2="232" y2="256" />
        <line x1="320" y1="500" x2="288" y2="256" />
        <line x1="440" y1="500" x2="344" y2="256" />
      </g>

      {/* one lamp post, because a truly empty frame reads as a bug */}
      <rect x="342" y="150" width="8" height="106" fill="#4d545d" />
      <rect x="330" y="144" width="32" height="9" rx="4" fill="#4d545d" />
    </>
  );
}

const SCENES: Record<SceneId, (props: SceneProps) => JSX.Element> = {
  'kitchen-egg': KitchenEgg,
  'rainy-platform': RainyPlatform,
  'talking-head': TalkingHead,
  'street-rant': StreetRant,
  'empty-lot': EmptyLot,
};
