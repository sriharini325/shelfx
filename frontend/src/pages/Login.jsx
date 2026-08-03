import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.identifier, form.password);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink-50">Welcome back</h1>
          <p className="text-ink-500 mt-2">Log in to borrow, track, and discover books.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="label mb-1.5 block">Username or email</label>
            <input
              className="input-field"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder="asha or asha@example.com"
              required
            />
          </div>

          <div>
            <label className="label mb-1.5 block">Password</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <p className="text-sm text-center text-ink-500 mt-2">
            New to ShelfX?{' '}
            <Link to="/register" className="text-shelf-400 hover:text-shelf-300">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
