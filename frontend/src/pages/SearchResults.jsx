import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const libraryId = searchParams.get('libraryId') || '';
  const libraryName = searchParams.get('libraryName') || '';

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [borrowingId, setBorrowingId] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(q);
    // Fetch whenever there's a text query OR a library filter selected —
    // picking a library alone (no typed query) should list everything on
    // its shelves.
    if (!q && !libraryId) { setResults([]); return; }
    setLoading(true);
    api.get('/books/search', { params: { q, libraryId: libraryId || undefined } })
      .then(({ data }) => setResults(data.results))
      .finally(() => setLoading(false));
  }, [q, libraryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = {};
    if (query.trim()) next.q = query.trim();
    if (libraryId) { next.libraryId = libraryId; next.libraryName = libraryName; }
    setSearchParams(next);
  };

  const clearLibrary = () => {
    const next = {};
    if (query.trim()) next.q = query.trim();
    setSearchParams(next);
  };

  const handleBorrow = async (book) => {
    if (!user) {
      navigate('/login', { state: { from: `/search?${searchParams.toString()}` } });
      return;
    }
    setMessage('');
    setBorrowingId(book.id);
    try {
      const { data } = await api.post('/borrow', { bookId: book.id });
      setResults((prev) => prev.map((b) => (b.id === book.id
        ? { ...b, isAvailable: false, expectedAvailableDate: data.dueDate }
        : b)));
      setMessage(`Borrowed "${book.title}" — due back ${new Date(data.dueDate).toLocaleDateString()}.`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not borrow this book.');
    } finally {
      setBorrowingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {libraryId && libraryName && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-shelf-300 bg-shelf-500/10 border border-shelf-500/30 rounded-full px-3 py-1.5">
            Searching in <strong>{libraryName}</strong>
          </span>
          <button
            onClick={clearLibrary}
            className="text-xs text-ink-500 hover:text-ink-100 underline underline-offset-2"
          >
            Search all libraries instead
          </button>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
        <input
          className="input-field flex-1"
          placeholder={libraryName ? `Search books in ${libraryName}…` : 'Search by title or author…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">Search</button>
      </form>

      {message && (
        <div className="mb-6 text-sm text-shelf-300 bg-shelf-500/10 border border-shelf-500/30 rounded-lg px-4 py-3">
          {message}
        </div>
      )}

      {!q && !libraryId && (
        <p className="text-ink-500">Search for a book by title or author, or pick a library from the home page to browse its shelves.</p>
      )}

      {(q || libraryId) && loading && <p className="text-ink-500">Searching…</p>}

      {(q || libraryId) && !loading && results.length === 0 && (
        <p className="text-ink-500">
          No results{q ? ` for "${q}"` : ''}{libraryName ? ` in ${libraryName}` : ''}. Try a different title, author, or library.
        </p>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-ink-500 mb-4">
            {results.length} result{results.length !== 1 && 's'}
            {q ? ` for "${q}"` : ''}
            {libraryName ? ` in ${libraryName}` : ''}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBorrow={handleBorrow}
                borrowing={borrowingId === book.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
