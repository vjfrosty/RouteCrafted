import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left: Headline + Curator Tip */}
          <div className="lg:col-span-5 pt-4">
            <p className="text-primary font-label font-bold text-xs uppercase tracking-widest mb-4">
              AI Travel Planning
            </p>
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-on-surface leading-[1.08] tracking-tight mb-6">
              Where to{' '}
              <span className="italic text-primary">next?</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-md">
              AI-powered day-by-day travel plans with weather-aware replanning and Worth&nbsp;It&nbsp;/&nbsp;Skip&nbsp;It place cards.
            </p>

            {/* Curator's Tip card */}
            <div className="bg-surface-container-low p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[18px] text-primary">lightbulb</span>
                <p className="text-xs font-label font-bold text-primary uppercase tracking-wider">Curator's Tip</p>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                The best itineraries balance structured highlights with free exploration time. Let AI plan the must-sees — then leave afternoons open for wandering.
              </p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              {['AI Itineraries', 'Weather Replanning', 'Worth It / Skip It'].map((f) => (
                <span key={f} className="flex items-center gap-1.5 bg-surface-container rounded-full px-4 py-2 text-xs font-label font-semibold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Ledger card / Trip planner form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-card">
              <h2 className="font-headline font-bold text-2xl text-on-surface mb-8">Plan your next trip</h2>

              <div className="space-y-4">
                {/* Destination */}
                <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3.5 rounded-2xl">
                  <span className="material-symbols-outlined text-[20px] text-outline flex-shrink-0">location_on</span>
                  <span className="text-on-surface-variant text-sm font-label">Where to? — e.g. Tokyo, Japan</span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3.5 rounded-2xl">
                    <span className="material-symbols-outlined text-[20px] text-outline flex-shrink-0">calendar_today</span>
                    <span className="text-on-surface-variant text-sm font-label">Start date</span>
                  </div>
                  <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3.5 rounded-2xl">
                    <span className="material-symbols-outlined text-[20px] text-outline flex-shrink-0">event</span>
                    <span className="text-on-surface-variant text-sm font-label">End date</span>
                  </div>
                </div>

                {/* Budget chips */}
                <div>
                  <p className="text-xs font-label font-semibold text-on-surface-variant mb-2 px-1">Budget</p>
                  <div className="flex gap-2 flex-wrap">
                    {['Budget', 'Mid-range', 'Luxury', 'Ultra'].map((b, i) => (
                      <span
                        key={b}
                        className={`rounded-xl px-3 py-1.5 text-xs font-label font-semibold cursor-pointer transition ${
                          i === 1
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container'
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pacing segmented control */}
                <div>
                  <p className="text-xs font-label font-semibold text-on-surface-variant mb-2 px-1">Pacing</p>
                  <div className="bg-surface-container-low rounded-2xl p-1 flex">
                    {['Relaxed', 'Balanced', 'Fast'].map((p, i) => (
                      <span
                        key={p}
                        className={`flex-1 text-center text-xs font-label font-semibold px-3 py-2 rounded-xl cursor-pointer transition ${
                          i === 1
                            ? 'bg-surface-container-lowest shadow-sm text-primary'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/trips/new"
                  className="flex items-center justify-center gap-3 w-full horizon-gradient text-on-primary font-headline font-bold text-lg py-5 rounded-full shadow-card hover:opacity-90 transition mt-2"
                >
                  <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                  Craft my itinerary
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Trending Destinations ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary font-label font-bold text-xs uppercase tracking-widest mb-2">Destinations</p>
            <h2 className="font-headline font-extrabold text-3xl text-on-surface">Trending right now</h2>
          </div>
          <Link href="/trips/new" className="text-sm font-semibold text-primary hover:text-primary-container transition">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Tokyo — wide */}
          <div className="md:col-span-8 relative h-72 rounded-3xl overflow-hidden bg-surface-container-high group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute top-5 left-5 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-label font-bold px-3 py-1 rounded-full">Trending</span>
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-headline font-extrabold text-3xl">Tokyo</p>
              <p className="text-white/70 text-sm mt-1">Japan · Best in Spring</p>
            </div>
            <span className="absolute bottom-6 right-6 material-symbols-outlined text-white/60 text-[48px] group-hover:text-white/80 transition">arrow_outward</span>
          </div>
          {/* Paris — narrow */}
          <div className="md:col-span-4 relative h-72 rounded-3xl overflow-hidden bg-surface-container group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-headline font-extrabold text-2xl">Paris</p>
              <p className="text-white/70 text-sm mt-1">France · Year-round</p>
            </div>
          </div>
          {/* New York — narrow */}
          <div className="md:col-span-4 relative h-64 rounded-3xl overflow-hidden bg-surface-container-highest group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-headline font-extrabold text-2xl">New York</p>
              <p className="text-white/70 text-sm mt-1">USA · All seasons</p>
            </div>
          </div>
          {/* Amalfi — wide */}
          <div className="md:col-span-8 relative h-64 rounded-3xl overflow-hidden bg-surface-container-high group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute top-5 left-5 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-label font-bold px-3 py-1 rounded-full">Editor's pick</span>
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-headline font-extrabold text-2xl">Amalfi Coast</p>
              <p className="text-white/70 text-sm mt-1">Italy · Best May–Oct</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-surface-container-low p-10 rounded-[2.5rem]">
          <p className="text-primary font-label font-bold text-xs uppercase tracking-widest mb-3">Why RouteCrafted</p>
          <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-10">Everything your trip needs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: 'map', title: 'AI Itineraries', desc: 'Personalised day-by-day plans generated by Gemini AI, tailored to your style and budget.' },
              { icon: 'cloud', title: 'Weather Replanning', desc: 'Auto-rewrites affected days when the forecast changes — no more rainy-day surprises.' },
              { icon: 'star', title: 'Worth It / Skip It', desc: 'Honest editorial verdicts for every attraction so you spend time on what actually matters.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-surface-container-lowest rounded-3xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-primary text-[24px]">{feature.icon}</span>
                </div>
                <h3 className="font-headline font-bold text-on-surface text-lg mb-2">{feature.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">Ready to explore?</h2>
        <p className="text-on-surface-variant mb-8 text-lg max-w-lg mx-auto">
          Join thousands of travellers crafting smarter, more memorable trips.
        </p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 horizon-gradient text-on-primary font-headline font-bold rounded-full px-10 py-5 text-lg shadow-card hover:opacity-90 transition"
        >
          <span className="material-symbols-outlined text-[22px]">travel_explore</span>
          Get started — it's free
        </Link>
        <p className="mt-6 text-outline text-xs">
          Built with Next.js 15 · Expo · Drizzle ORM · Neon · Gemini 2.0 Flash
        </p>
      </section>

      {/* ── FAB (mobile) ── */}
      <Link
        href="/trips/new"
        className="md:hidden fixed bottom-24 right-6 w-16 h-16 rounded-full horizon-gradient shadow-card-hover flex items-center justify-center z-40"
        aria-label="Plan new trip"
      >
        <span className="material-symbols-outlined text-on-primary text-[28px]">add</span>
      </Link>
    </div>
  );
}
