import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, getProject } from '@/lib/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProject(params.slug);
  if (!p) return { title: 'Not found' };
  return {
    title: `${p.title} · Amna Pervez`,
    description: p.blurb,
    // hidden: keep these out of search indexes
    robots: { index: false, follow: false },
  };
}

export default function ProjectPage({ params }) {
  const p = getProject(params.slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <main className="detail">
      <div className="bar">
        <Link href="/"><span className="arr">←</span> Back to experience</Link>
        <span>{p.index} / {String(projects.length).padStart(2, '0')}</span>
      </div>

      <header className="hero">
        <img src={p.hero} alt={p.title} />
        <div className="scrim" />
        <div className="htext">
          <div className="idx">PROJECT {p.index} · {p.category}</div>
          <h1>{p.title}</h1>
        </div>
      </header>

      <div className="wrap">
        <div className="metarow">
          <div className="cell"><div className="k">Location</div><div className="v">{p.location}</div></div>
          <div className="cell"><div className="k">Year</div><div className="v">{p.year}</div></div>
          <div className="cell"><div className="k">Type</div><div className="v">{p.type}</div></div>
          <div className="cell"><div className="k">Scale</div><div className="v">{p.scale}</div></div>
        </div>

        <div className="body">
          {p.body.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        <div className="gallery">
          {p.gallery.map((src, idx) => (
            <figure key={idx}>
              <img src={src} alt={`${p.title}, view ${idx + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>

        <nav className="nav">
          <Link href={`/work/${prev.slug}`}>
            <span className="lbl">Previous</span>← {prev.title}
          </Link>
          <Link className="r" href={`/work/${next.slug}`}>
            <span className="lbl">Next</span>{next.title} →
          </Link>
        </nav>
      </div>
    </main>
  );
}
