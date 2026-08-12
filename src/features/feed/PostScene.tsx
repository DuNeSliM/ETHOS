import type { ScenePalette, SceneId } from '@/types';

/**
 * Graphic scene stand-ins for the posts' pictures and clips.
 *
 * The prototype ships no real photography or footage. To preserve the feed's
 * draft-like feel without falling back to the old comic-style placeholder, the
 * app now emits more grounded, photo-inspired SVG scenes: local geometry,
 * soft light, visible surfaces and environment cues instead of cleanly comic
 * linework. The scenes still stay local and deterministic so the browser does
 * not need a network request to feel complete.
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
        <radialGradient id="kitchen-glow" cx="0.78" cy="0.15" r="0.65">
          <stop offset="0" stopColor="#fffaf2" stopOpacity="0.96" />
          <stop offset="1" stopColor="#f8e2c2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill="url(#kitchen-wall)" />
      <rect width="400" height="500" fill="url(#kitchen-glow)" opacity="0.68" />

      <rect x="22" y="34" width="356" height="128" rx="10" fill="#f9f2e8" opacity="0.12" />
      <rect x="44" y="54" width="96" height="88" rx="8" fill="#efe7d5" opacity="0.8" />
      <rect x="154" y="54" width="96" height="88" rx="8" fill="#efe7d5" opacity="0.75" />
      <rect x="265" y="54" width="96" height="88" rx="8" fill="#efe7d5" opacity="0.78" />

      <rect x="0" y="286" width="400" height="214" fill="#eadfd0" />
      <rect x="0" y="286" width="400" height="16" fill="#b59471" opacity="0.92" />
      <rect x="16" y="308" width="368" height="82" rx="8" fill="#fffdf9" opacity="0.75" />
      <rect x="40" y="335" width="317" height="12" rx="6" fill="#e2d9cd" />

      <ellipse cx="125" cy="451" rx="112" ry="42" fill="#3a3131" opacity="0.88" />
      <ellipse cx="118" cy="415" rx="94" ry="44" fill="#201c22" opacity="0.92" />
      <ellipse cx="116" cy="244" rx="56" ry="54" fill="#ebbd9c" />
      <path d="M63 230c6-50 46-88 96-84 44 3 83 28 91 97-43-12-110-11-151-13Z" fill="#514137" opacity="0.95" />
      <path d="M100 246c10-20 46-19 50 8 2 23-20 12-50 3Z" fill="#d8bfa0" opacity="0.75" />
      <path d="M103 265q20 12 38 0" stroke="#885730" strokeWidth="4" fill="none" strokeLinecap="round" />

      <ellipse cx="256" cy="390" rx="94" ry="30" fill="#fbf9ee" />
      <ellipse cx="240" cy="388" rx="45" ry="22" fill="#ecb13d" opacity="0.95" />
      <path d="M334 426c-8-56 15-78 56-75 38 4 50 51 28 76Z" fill="#cbbba8" opacity="0.74" />

      <g className="scene-drop" opacity="0.92">
        <ellipse cx="301" cy="327" rx="15" ry="12" fill="#fffaf0" />
        <ellipse cx="326" cy="346" rx="11" ry="9" fill="#fffaf0" />
      </g>

      <g fill="#f7b4a9" opacity="0.88">
        <ellipse cx="84" cy="431" rx="22" ry="8" />
        <ellipse cx="115" cy="421" rx="14" ry="6" />
        <ellipse cx="60" cy="454" rx="12" ry="5" />
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
      <rect x="0" y="78" width="400" height="410" fill="#4d5968" opacity="0.16" />

      <path d="M0 0h400v82L200 96 0 82Z" fill="#293b40" opacity="0.88" />
      <rect x="150" y="80" width="100" height="180" rx="24" fill="#6a747f" opacity="0.8" />

      <rect x="88" y="116" width="224" height="104" rx="10" fill="#11151a" opacity="0.94" />
      <rect x="98" y="126" width="205" height="84" rx="6" fill="#27363b" opacity="0.8" />
      <g fill="#f1ba54">
        <rect x="112" y="137" width="38" height="9" rx="2" />
        <rect x="158" y="137" width="84" height="9" rx="2" />
        <rect x="112" y="166" width="28" height="9" rx="2" />
        <rect x="148" y="166" width="88" height="9" rx="2" />
        <rect x="244" y="137" width="40" height="9" rx="2" fill="#cb564b" />
      </g>

      <rect x="0" y="330" width="400" height="170" fill="#596a74" />
      <rect x="0" y="330" width="400" height="10" fill="#8798a5" />
      <g opacity="0.9">
        <rect x="0" y="356" width="400" height="2" fill="#c8be90" />
        <rect x="0" y="371" width="400" height="2" fill="#c8be90" />
      </g>

      <rect x="226" y="338" width="66" height="78" rx="10" fill="#eee7cb" />
      <rect x="235" y="346" width="40" height="34" rx="4" fill="#642d24" />
      <ellipse cx="250" cy="390" rx="58" ry="22" fill="#120d11" opacity="0.44" />

      <g className="scene-rain" stroke="#dbeaff" strokeWidth="2" opacity="0.85">
        {Array.from({ length: 28 }, (_, index) => {
          const x = (index * 35) % 400;
          const y = (index * 38) % 240;
          return <line key={index} x1={x} y1={y + 70} x2={x - 8} y2={y + 105} />;
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
        <radialGradient id="room-light" cx="0.5" cy="0.25" r="0.85">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill="url(#room-light)" />
      <rect x="24" y="34" width="352" height="432" rx="6" fill="#191b2a" opacity="0.14" />

      <rect x="24" y="128" width="116" height="24" rx="2" fill="#2e2b38" opacity="0.85" />
      <rect x="36" y="156" width="94" height="42" rx="2" fill="#867965" opacity="0.36" />
      <rect x="288" y="124" width="84" height="116" rx="4" fill="#a6aa9d" opacity="0.36" />

      <path d="M44 500c8-118 76-150 161-150s158 52 152 150Z" fill="#463e58" opacity="0.92" />
      <ellipse cx="204" cy="254" rx="88" ry="88" fill="#e7bda9" />
      <path d="M122 244c0-85 38-118 90-116 39 2 84 42 84 117-12-34-47-60-88-60-37 0-61 21-86 59Z" fill="#4f352e" opacity="0.96" />

      <g fill="#37251b">
        <ellipse cx="176" cy="252" rx="7" ry="8" />
        <ellipse cx="230" cy="252" rx="7" ry="8" />
      </g>
      <path d="M164 230q14-12 28-2M212 225q12-10 34 3" stroke="#32251a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M176 298q24 12 50-2" stroke="#7d453d" strokeWidth="5" fill="none" strokeLinecap="round" />

      <g className="scene-breathe" opacity="0.36" fill="#ffffff">
        <circle cx="100" cy="110" r="2" />
        <circle cx="360" cy="78" r="2" />
        <circle cx="326" cy="126" r="1.8" />
        <circle cx="118" cy="410" r="2" />
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
      <rect x="0" y="246" width="400" height="254" fill="#222a30" opacity="0.95" />

      <g opacity="0.36">
        <rect x="12" y="268" width="74" height="42" rx="8" fill="#48515d" />
        <rect x="104" y="268" width="68" height="42" rx="8" fill="#48515d" />
        <rect x="196" y="268" width="74" height="42" rx="8" fill="#48515d" />
        <rect x="292" y="268" width="88" height="42" rx="8" fill="#48515d" />
      </g>

      <rect x="28" y="342" width="344" height="158" rx="12" fill="#171a26" opacity="0.92" />
      <ellipse cx="200" cy="286" rx="80" ry="82" fill="#e3b394" />
      <path d="M116 272c3-88 58-120 102-110 48 12 75 55 75 107-39-54-105-62-130-26Z" fill="#1d1719" opacity="0.95" />

      <path d="M160 254q16-20 34 2M210 252q14-16 30 3" stroke="#2b201e" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="202" cy="318" rx="24" ry="13" fill="#8a452c" />

      <g className="scene-gesture">
        <ellipse cx="76" cy="388" rx="34" ry="54" fill="#e2a782" opacity="0.9" />
        <ellipse cx="330" cy="388" rx="34" ry="54" fill="#e2a782" opacity="0.9" />
      </g>

      <g fill="#f4d7c2" opacity="0.9">
        <path d="M96 388c6-7 28-5 30 5-2 15-23 12-30 9Z" />
        <path d="M300 384c8-5 26-2 28 9-3 10-20 14-30 8Z" />
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
      <rect x="0" y="248" width="400" height="252" fill="#69777f" opacity="0.95" />

      <rect x="0" y="242" width="400" height="14" fill="#45535b" />
      <rect x="30" y="164" width="100" height="82" rx="4" fill="#505b65" opacity="0.88" />
      <rect x="262" y="160" width="112" height="84" rx="4" fill="#505b65" opacity="0.88" />

      <g className="scene-pan" stroke="#eef1e8" strokeWidth="4" opacity="0.76">
        <line x1="-40" y1="500" x2="118" y2="260" />
        <line x1="80" y1="500" x2="184" y2="260" />
        <line x1="172" y1="500" x2="240" y2="260" />
        <line x1="306" y1="500" x2="292" y2="260" />
      </g>

      <rect x="330" y="142" width="6" height="106" fill="#424750" />
      <rect x="318" y="134" width="31" height="10" rx="4" fill="#4b565d" />
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
