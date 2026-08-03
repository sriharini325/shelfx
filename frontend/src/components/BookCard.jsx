export default function BookCard({ book, onBorrow, borrowing }) {
  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-shelf-500/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-ink-50 leading-snug">{book.title}</h3>
          <p className="text-sm text-ink-500 mt-0.5">by {book.author}</p>
        </div>
        {book.isAvailable ? (
          <span className="badge-available shrink-0">● Available</span>
        ) : (
          <span className="badge-unavailable shrink-0">● Checked out</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="label">Library</p>
          <p className="text-ink-100">{book.library?.name || '—'}</p>
        </div>
        <div>
          <p className="label">City</p>
          <p className="text-ink-100">{book.library?.city || '—'}</p>
        </div>
        <div>
          <p className="label">Rack No.</p>
          <p className="text-ink-100 font-mono">{book.rackNumber}</p>
        </div>
        <div>
          <p className="label">Book No.</p>
          <p className="text-ink-100 font-mono">{book.bookNumber}</p>
        </div>
      </div>

      {!book.isAvailable && book.expectedAvailableDate && (
        <p className="text-xs text-amber-400/90 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
          Expected available on{' '}
          <span className="font-medium">
            {new Date(book.expectedAvailableDate).toLocaleDateString(undefined, {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </p>
      )}

      {onBorrow && (
        <button
          onClick={() => onBorrow(book)}
          disabled={!book.isAvailable || borrowing}
          className="btn-primary mt-1 !py-2 text-sm"
        >
          {borrowing ? 'Borrowing…' : book.isAvailable ? 'Borrow this copy' : 'Currently unavailable'}
        </button>
      )}
    </div>
  );
}
