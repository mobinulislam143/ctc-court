import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEO from '@/components/SEO';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { Home, ArrowRight,  Circle, Square } from 'lucide-react';
import picable from '/tiles/picable.jpg'
import basketball from '/tiles/basketball.jpg'

const OPTIONS = [

  {
    key: 'basketball',
    title: 'Basketball Courts',
    desc: 'Half court or full court with regulation 12′×19′ key, 3-point arc and free-throw circle.',
    img: basketball,
    accent: '#DC2626',
    size: '30 × 30 ft (half)',
  },
  {
    key: 'pickleball',
    title: 'Pickleball Courts',
    desc: 'Regulation 20′×44′ playing area with 7′ kitchen and centered net. Single or dual layouts.',
    img: picable,
    accent: '#2563EB',
    size: '30 × 60 ft',
  },
];

export default function CourtSelect() {
  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO
        title="Choose Your Court — Coast to Coast Courts"
        description="Pick a court type to start designing: multi-sport, basketball, or pickleball."
        canonical="/CourtSelect"
      />
      <SiteNav />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Interactive Court Designer
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Choose the court that fits your space and sport. Each designer is pre-loaded
              with exact regulation dimensions — then customize colors, size, and accessories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OPTIONS.map(opt => {
              const Img = opt.img;
              return (
                <div
                  key={opt.key}
                  className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-50 w-full"
                  >
                    <img src={opt.img} alt={opt.title} className="h-full object-cover w-full" />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h2 className="text-lg font-bold text-gray-900">{opt.title}</h2>
                    <p className="mt-2 text-sm text-gray-600 flex-1">{opt.desc}</p>
                    <p className="mt-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {opt.size}
                    </p>
                    <Link
                      to={`${createPageUrl('Builder')}?sport=${opt.key}`}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: opt.accent }}
                    >
                      Start Designing <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to={createPageUrl('Home')}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <Home className="h-4 w-4" /> Back to home
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
