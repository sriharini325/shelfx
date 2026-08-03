import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TABS = ['Overview', 'Borrowed', 'History', 'Fines', 'Settings'];

function StatusPill({ status }) {
  const styles = {
    borrowed: 'text-shelf-300 bg-shelf-500/10 border-shelf-500/30',
    overdue: 'text-red-400 bg-red-500/10 border-red-500/30',
    returned: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${styles[status] || ''}`}>
      {status}
    </span>
  );
}

export default function Profile() {
  const { user, updateUserLocally } = useAuth();
  const [tab, setTab] = useState('Overview');
  const [borrowed, setBorrowed] = useState([]);
  const [history, setHistory] = useState([]);
  const [fines, setFines] = useState({ fines: [], totalOutstanding: 0 });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', username: user?.username || '', phone: user?.phone || '', email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  const loadAll = () => {
    api.get('/users/borrowed').then(({ data }) => setBorrowed(data.borrowed));
    api.get('/users/history').then(({ data }) => setHistory(data.history));
    api.get('/users/fines').then(({ data }) => setFines(data));
  };

  useEffect(() => { loadAll(); }, []);

  const handleReturn = async (recordId) => {
    await api.post('/borrow/return', { recordId });
    loadAll();
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.patch('/users/profile', profileForm);
      updateUserLocally(data.user);
      setMessage('Profile updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/users/change-password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setMessage('Password changed.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not change password.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-shelf-500 to-shelf-800 flex items-center justify-center font-display text-2xl text-white shadow-glow">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl text-ink-50">{user?.name}</h1>
          <p className="text-ink-500 text-sm">@{user?.username} · {user?.email}</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-ink-600/60 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'border-shelf-500 text-shelf-300' : 'border-transparent text-ink-500 hover:text-ink-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {message && (
        <div className="mb-6 text-sm text-shelf-300 bg-shelf-500/10 border border-shelf-500/30 rounded-lg px-4 py-3">
          {message}
        </div>
      )}

      {tab === 'Overview' && (
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="card p-6">
            <p className="label">Currently borrowed</p>
            <p className="font-display text-3xl text-ink-50 mt-2">{borrowed.length}</p>
          </div>
          <div className="card p-6">
            <p className="label">Total books read</p>
            <p className="font-display text-3xl text-ink-50 mt-2">
              {history.filter((h) => h.status === 'returned').length}
            </p>
          </div>
          <div className="card p-6">
            <p className="label">Outstanding fines</p>
            <p className="font-display text-3xl text-red-400 mt-2">₹{fines.totalOutstanding}</p>
          </div>
        </div>
      )}

      {tab === 'Borrowed' && (
        <div className="flex flex-col gap-4">
          {borrowed.length === 0 && <p className="text-ink-500">You have no books checked out.</p>}
          {borrowed.map((r) => (
            <div key={r.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-display text-ink-50">{r.book.title}</p>
                <p className="text-sm text-ink-500">{r.book.library?.name} · Rack {r.book.rackNumber} · #{r.book.bookNumber}</p>
                <p className="text-xs text-ink-600 mt-1 font-mono">Due {new Date(r.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={r.status} />
                <button onClick={() => handleReturn(r.id)} className="btn-secondary !py-1.5 !px-4 text-sm">
                  Mark returned
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'History' && (
        <div className="flex flex-col gap-4">
          {history.length === 0 && <p className="text-ink-500">No borrowing history yet.</p>}
          {history.map((r) => (
            <div key={r.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-display text-ink-50">{r.book.title}</p>
                <p className="text-sm text-ink-500">{r.book.library?.name}</p>
                <p className="text-xs text-ink-600 mt-1 font-mono">
                  Borrowed {new Date(r.borrowedAt).toLocaleDateString()}
                  {r.returnedAt && ` · Returned ${new Date(r.returnedAt).toLocaleDateString()}`}
                </p>
              </div>
              <StatusPill status={r.status} />
            </div>
          ))}
        </div>
      )}

      {tab === 'Fines' && (
        <div>
          <div className="card p-6 mb-6 flex items-center justify-between">
            <p className="text-ink-100">Total outstanding</p>
            <p className="font-display text-2xl text-red-400">₹{fines.totalOutstanding}</p>
          </div>
          <div className="flex flex-col gap-4">
            {fines.fines.length === 0 && <p className="text-ink-500">No fines on your account. Nicely done.</p>}
            {fines.fines.map((f) => (
              <div key={f.id} className="card p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-ink-50">{f.book.title}</p>
                  <p className="text-xs text-ink-600 mt-1 font-mono">Due {new Date(f.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-medium">₹{f.fineAmount}</p>
                  <p className="text-xs text-ink-500">{f.finePaid ? 'Paid' : 'Unpaid'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Settings' && (
        <div className="grid sm:grid-cols-2 gap-6">
          <form onSubmit={handleProfileSave} className="card p-6 flex flex-col gap-4">
            <h3 className="font-display text-lg text-ink-50">Edit profile</h3>
            <div>
              <label className="label mb-1.5 block">Name</label>
              <input className="input-field" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
            </div>
            <div>
              <label className="label mb-1.5 block">Username</label>
              <input className="input-field" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
            </div>
            <div>
              <label className="label mb-1.5 block">Phone</label>
              <input className="input-field" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
            </div>
            <div>
              <label className="label mb-1.5 block">Email</label>
              <input className="input-field" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary mt-2">Save changes</button>
          </form>

          <form onSubmit={handlePasswordChange} className="card p-6 flex flex-col gap-4">
            <h3 className="font-display text-lg text-ink-50">Change password</h3>
            <div>
              <label className="label mb-1.5 block">Current password</label>
              <input type="password" className="input-field" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
            </div>
            <div>
              <label className="label mb-1.5 block">New password</label>
              <input type="password" className="input-field" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} minLength={6} />
            </div>
            <button type="submit" className="btn-secondary mt-2">Update password</button>
          </form>
        </div>
      )}
    </div>
  );
}
