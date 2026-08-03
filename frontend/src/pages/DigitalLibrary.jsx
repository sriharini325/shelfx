import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function DigitalLibrary() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = (q) => {
    setLoading(true);
    api.get('/digital-books/search', { params: { q } })
      .then(({ data }) => setResults(data.results))
      .finally(() => setLoading(false));
  };

  useEffect(() => { search(''); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl text-ink-50">Digital Library</h1>
      <p className="text-ink-500 mt-1 mb-8">
        Legally available e-books — public domain and openly licensed titles you can read online now.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 max-w-xl">
        <input
          className="input-field flex-1"
          placeholder="Search digital titles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">Search</button>
      </form>

      {loading && <p className="text-ink-500">Loading…</p>}

      {!loading && results.length === 0 && (
        <p className="text-ink-500">No digital titles found.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((book) => (
          <div key={book.id} className="card p-5 flex flex-col gap-3">
            <div>
              <h3 className="font-display text-lg text-ink-50 leading-snug">{book.title}</h3>
              <p className="text-sm text-ink-500 mt-0.5">by {book.author}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {book.genre && (
                <span className="px-2.5 py-1 rounded-full bg-ink-700 text-ink-100 border border-ink-600">{book.genre}</span>
              )}
              {book.license && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{book.license}</span>
              )}
            </div>
            <p className="text-xs text-ink-600 font-mono">Source: {book.source}</p>
            <a
              href={book.readOnlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2 text-sm mt-1 text-center"
            >
              Read online →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
