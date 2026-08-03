import { Outlet, useLocation } from 'react-router-dom';

import { DeviceStatusBar } from '@/features/device/DeviceStatusBar';

/**
 * The simulated phone the whole demo runs inside.
 *
 * Why a device frame at all: ContextLens is pitched as an assistance layer
 * that sits *over* someone else's app on a phone. Shown as a normal web page
 * that claim stays abstract - a reviewer sees one website with a feed in it.
 * Inside a phone, with an OS status bar above it, a home screen behind it and
 * a floating extension button over the app, the relationship between the three
 * parties (device, platform, assistance layer) is visible without explanation.
 *
 * Two rendering modes, decided purely in CSS so there is no viewport
 * measurement and no hydration flicker:
 *
 *  - below `lg` the frame is a passthrough. The browser on a real phone is
 *    already the device; the app fills the screen and the page scrolls
 *    normally.
 *  - from `lg` upward the bezel is drawn, the screen becomes a fixed-size
 *    scroll container, and the layout is centred on a dark stage.
 *
 * The route decides which skin the screen wears, because the OS chrome has to
 * match the app that is in the foreground - that is what a real phone does.
 */
export function DeviceLayout() {
  const { pathname } = useLocation();

  const isPlatform =
    pathname.startsWith('/feed') || pathname.startsWith('/post');
  const isHomeScreen = pathname === '/phone';

  return (
    <div className="device-stage app-min-h lg:flex lg:items-center lg:justify-center lg:gap-10 lg:p-8">
      <DeviceCaption />

      <div
        className="
          lg:relative lg:shrink-0 lg:rounded-[3.1rem] lg:bg-[#0d1117] lg:p-[0.7rem]
          lg:shadow-[0_2rem_5rem_-1rem_rgb(0_0_0/0.85)] lg:ring-1 lg:ring-white/12
        "
      >
        {/* Hardware buttons. Pure decoration, never in the keyboard path. */}
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-32 hidden h-14 w-[3px] rounded-l bg-[#1b2430] lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-52 hidden h-14 w-[3px] rounded-l bg-[#1b2430] lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute -right-[3px] top-44 hidden h-20 w-[3px] rounded-r bg-[#1b2430] lg:block"
        />

        <div
          className={`
            device-screen bg-canvas
            lg:flex lg:h-[min(50rem,84dvh)] lg:w-[24.5rem] lg:flex-col
            lg:overflow-hidden lg:rounded-[2.5rem]
            ${isPlatform ? 'platform-skin' : ''}
          `}
        >
          <DeviceStatusBar onWallpaper={isHomeScreen} />

          <div
            id="app-viewport"
            className="relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain"
          >
            <Outlet />
          </div>

          {/* Home indicator. Overlaps the app, exactly like the real one. */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative z-40 hidden shrink-0 justify-center pb-2 pt-1.5 lg:flex"
          >
            <span
              className={`h-1 w-32 rounded-full ${
                isHomeScreen ? 'bg-white/80' : 'bg-ink/25'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Caption beside the phone on wide screens.
 *
 * The demo is shown on a projector during a presentation, where nobody can
 * read a paragraph of body copy. Three short lines that say what the frame is
 * and what it is not, nothing more.
 */
function DeviceCaption() {
  return (
    <aside className="hidden max-w-xs text-white xl:block">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
        Demo-Aufbau
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight">
        ContextLens läuft als Erweiterung über einer fremden App
      </h2>
      <ul className="mt-5 space-y-3 text-sm text-white/70">
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-white/40" />
          <span>
            Auf dem Telefon liegt eine simulierte Foto-App. Sie gehört nicht zu
            ContextLens und weiß nichts von ihm.
          </span>
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-white/40" />
          <span>
            Die Assistenzschicht meldet sich über das schwebende Symbol und über
            die Leiste unter der App-Kopfzeile.
          </span>
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-white/40" />
          <span>
            Der Rahmen ist Teil der Demo. Auf einem echten Telefon läuft
            dieselbe Ansicht bildschirmfüllend.
          </span>
        </li>
      </ul>
      <p className="mt-6 rounded-xl border border-white/15 bg-white/5 p-3 text-xs leading-relaxed text-white/60">
        Beiträge, Konten, Zahlen und Analysen sind erfunden. Es gibt keine
        Verbindung zu einem echten sozialen Netzwerk.
      </p>
    </aside>
  );
}
