import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = { name: '', username: '', phone: '', email: '', password: '' };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink-50">Create your account</h1>
          <p className="text-ink-500 mt-2">Join ShelfX to borrow books and track due dates.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="label mb-1.5 block">Full name</label>
            <input className="input-field" value={form.name} onChange={update('name')} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label mb-1.5 block">Username</label>
              <input className="input-field" value={form.username} onChange={update('username')} required />
            </div>
            <div>
              <label className="label mb-1.5 block">Phone</label>
              <input className="input-field" value={form.phone} onChange={update('phone')} required />
            </div>
          </div>

          <div>
            <label className="label mb-1.5 block">Email</label>
            <input type="email" className="input-field" value={form.email} onChange={update('email')} required />
          </div>

          <div>
            <label className="label mb-1.5 block">Password</label>
            <input type="password" className="input-field" value={form.password} onChange={update('password')} minLength={6} required />
            <p className="text-xs text-ink-600 mt-1">At least 6 characters.</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-sm text-center text-ink-500 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-shelf-400 hover:text-shelf-300">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
