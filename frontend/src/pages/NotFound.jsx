import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-shelf-500 mb-2">404</p>
      <h1 className="font-display text-3xl text-ink-50 mb-3">This shelf is empty.</h1>
      <p className="text-ink-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}
