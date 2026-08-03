import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [quote, setQuote] = useState(null);
  const [query, setQuery] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [libraryQuery, setLibraryQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/books/quote').then(({ data }) => setQuote(data.quote)).catch(() => {});
    api.get('/libraries').then(({ data }) => setLibraries(data.libraries)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const goToLibrary = (lib) => {
    navigate(`/search?libraryId=${lib.id}&libraryName=${encodeURIComponent(lib.name)}`);
  };

  const filteredLibraries = libraryQuery.trim()
    ? libraries.filter((l) =>
        l.name.toLowerCase().includes(libraryQuery.trim().toLowerCase()) ||
        l.city.toLowerCase().includes(libraryQuery.trim().toLowerCase())
      )
    : libraries;

  return (
    <div>
      <section className="relative overflow-hidden bg-shelf-glow">
        <div className="absolute inset-0 bg-spine-lines opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center relative">
          <span className="label text-shelf-400">ShelfX — Library Network</span>
          <h1 className="font-display text-4xl sm:text-5xl text-ink-50 mt-4 leading-tight">
            Find your next book,<br className="hidden sm:block" /> across every shelf.
          </h1>

          {quote && (
            <blockquote className="mt-8 max-w-xl mx-auto">
              <p className="font-display text-lg sm:text-xl text-ink-100 italic">"{quote.text}"</p>
              <footer className="mt-2 text-sm text-ink-500">— {quote.author}</footer>
            </blockquote>
          )}

          <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto flex gap-2">
            <input
              className="input-field flex-1"
              placeholder="Search by title or author…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary shrink-0">Search</button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-500">
            <span>Try:</span>
            {['Atomic Habits', 'Sapiens', 'Sherlock Holmes', 'Matt Haig'].map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                className="px-3 py-1 rounded-full border border-ink-600 hover:border-shelf-500 hover:text-shelf-300 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by library — search a library by name, then search books within it */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl text-ink-50">Search by library</h2>
          <p className="text-ink-500 mt-2 text-sm">
            Find a library by name or city, then search its shelves for a specific book.
          </p>
        </div>

        <input
          className="input-field max-w-lg mx-auto block"
          placeholder="Type a library name or city…"
          value={libraryQuery}
          onChange={(e) => setLibraryQuery(e.target.value)}
        />

        <div className="mt-6 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {filteredLibraries.length === 0 && (
            <p className="text-ink-600 text-sm sm:col-span-2 text-center">No libraries match "{libraryQuery}".</p>
          )}
          {filteredLibraries.slice(0, 6).map((lib) => (
            <button
              key={lib.id}
              onClick={() => goToLibrary(lib)}
              className="card p-4 text-left hover:border-shelf-500/50 transition-colors"
            >
              <p className="font-display text-ink-50">{lib.name}</p>
              <p className="text-xs text-ink-500 mt-1">{lib.address}, {lib.city}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-3 gap-6">
        {[
          { title: 'Real-time availability', body: 'See exactly which copy is free, its rack, and its book number before you walk in.' },
          { title: 'Libraries near you', body: 'Locate nearby libraries on an interactive map, using your current location.' },
          { title: 'Digital reading, too', body: 'Search a growing catalog of legally available e-books you can read online right now.' },
        ].map((f) => (
          <div key={f.title} className="card p-6">
            <h3 className="font-display text-lg text-ink-50">{f.title}</h3>
            <p className="text-sm text-ink-500 mt-2 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
