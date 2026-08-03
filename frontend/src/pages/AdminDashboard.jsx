import { useEffect, useState } from 'react';
import api from '../api/axios';

const TABS = ['Books', 'Libraries', 'Digital Library', 'Borrow Records', 'Users'];

const emptyBook = {
  title: '', author: '', genre: '', isbn: '', rackNumber: '', bookNumber: '',
  libraryId: '', isAvailable: true,
};
const emptyLibrary = {
  name: '', address: '', city: '', latitude: '', longitude: '', contactPhone: '', openingHours: '', hasApiIntegration: false,
};
const emptyDigital = { title: '', author: '', genre: '', source: '', license: '', readOnlineUrl: '' };

/* --------------------------- Books tab --------------------------- */
function BooksTab({ libraries }) {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get('/admin/books').then(({ data }) => setBooks(data.books));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/admin/books/${editingId}`, form);
    } else {
      await api.post('/admin/books', form);
    }
    setForm(emptyBook);
    setEditingId(null);
    load();
  };

  const edit = (b) => {
    setEditingId(b.id);
    setForm({
      title: b.title, author: b.author, genre: b.genre || '', isbn: b.isbn || '',
      rackNumber: b.rackNumber, bookNumber: b.bookNumber, libraryId: b.libraryId, isAvailable: b.isAvailable,
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this book copy?')) return;
    await api.delete(`/admin/books/${id}`);
    load();
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      <form onSubmit={submit} className="card p-6 flex flex-col gap-3 h-fit">
        <h3 className="font-display text-lg text-ink-50">{editingId ? 'Edit book' : 'Add book'}</h3>
        <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input-field" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
        <input className="input-field" placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
        <input className="input-field" placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input-field" placeholder="Rack number" value={form.rackNumber} onChange={(e) => setForm({ ...form, rackNumber: e.target.value })} required />
          <input className="input-field" placeholder="Book number" value={form.bookNumber} onChange={(e) => setForm({ ...form, bookNumber: e.target.value })} required />
        </div>
        <select className="input-field" value={form.libraryId} onChange={(e) => setForm({ ...form, libraryId: e.target.value })} required>
          <option value="">Select library…</option>
          {libraries.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-ink-100">
          <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
          Available
        </label>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn-primary flex-1">{editingId ? 'Save changes' : 'Add book'}</button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyBook); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-600/60">
              <th className="p-3">Title / Author</th>
              <th className="p-3">Library</th>
              <th className="p-3">Rack</th>
              <th className="p-3">Book #</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-b border-ink-600/30 hover:bg-ink-700/30">
                <td className="p-3">
                  <p className="text-ink-50">{b.title}</p>
                  <p className="text-ink-500 text-xs">{b.author}</p>
                </td>
                <td className="p-3 text-ink-100">{b.library?.name}</td>
                <td className="p-3 font-mono text-ink-100">{b.rackNumber}</td>
                <td className="p-3 font-mono text-ink-100">{b.bookNumber}</td>
                <td className="p-3">
                  {b.isAvailable
                    ? <span className="badge-available">Available</span>
                    : <span className="badge-unavailable">Checked out</span>}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => edit(b)} className="text-shelf-400 hover:text-shelf-300 mr-3">Edit</button>
                  <button onClick={() => remove(b.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------- Libraries tab -------------------------- */
function LibrariesTab({ libraries, reload }) {
  const [form, setForm] = useState(emptyLibrary);
  const [editingId, setEditingId] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) };
    if (editingId) await api.patch(`/admin/libraries/${editingId}`, payload);
    else await api.post('/admin/libraries', payload);
    setForm(emptyLibrary);
    setEditingId(null);
    reload();
  };

  const edit = (l) => {
    setEditingId(l.id);
    setForm({
      name: l.name, address: l.address, city: l.city, latitude: l.latitude, longitude: l.longitude,
      contactPhone: l.contactPhone || '', openingHours: l.openingHours || '', hasApiIntegration: l.hasApiIntegration,
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this library? Its books will be removed too.')) return;
    await api.delete(`/admin/libraries/${id}`);
    reload();
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      <form onSubmit={submit} className="card p-6 flex flex-col gap-3 h-fit">
        <h3 className="font-display text-lg text-ink-50">{editingId ? 'Edit library' : 'Add library'}</h3>
        <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input-field" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <input className="input-field" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="input-field" placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required />
          <input className="input-field" placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required />
        </div>
        <input className="input-field" placeholder="Contact phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        <input className="input-field" placeholder="Opening hours" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-ink-100">
          <input type="checkbox" checked={form.hasApiIntegration} onChange={(e) => setForm({ ...form, hasApiIntegration: e.target.checked })} />
          Has API integration (unchecked = manual inventory updates)
        </label>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn-primary flex-1">{editingId ? 'Save changes' : 'Add library'}</button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyLibrary); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {libraries.map((l) => (
          <div key={l.id} className="card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-ink-50">{l.name}</p>
              <p className="text-xs text-ink-500">{l.address}, {l.city}</p>
              <p className="text-[11px] text-ink-600 font-mono mt-1">
                {l.hasApiIntegration ? 'API integrated' : 'Manually managed inventory'}
              </p>
            </div>
            <div className="whitespace-nowrap">
              <button onClick={() => edit(l)} className="text-shelf-400 hover:text-shelf-300 mr-3 text-sm">Edit</button>
              <button onClick={() => remove(l.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------ Digital library tab ------------------------ */
function DigitalTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyDigital);
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get('/digital-books/search', { params: { q: '' } }).then(({ data }) => setItems(data.results));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) await api.patch(`/admin/digital-books/${editingId}`, form);
    else await api.post('/admin/digital-books', form);
    setForm(emptyDigital);
    setEditingId(null);
    load();
  };

  const edit = (b) => {
    setEditingId(b.id);
    setForm({
      title: b.title, author: b.author, genre: b.genre || '', source: b.source,
      license: b.license || '', readOnlineUrl: b.readOnlineUrl,
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this digital title?')) return;
    await api.delete(`/admin/digital-books/${id}`);
    load();
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      <form onSubmit={submit} className="card p-6 flex flex-col gap-3 h-fit">
        <h3 className="font-display text-lg text-ink-50">{editingId ? 'Edit title' : 'Add digital title'}</h3>
        <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input-field" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
        <input className="input-field" placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
        <input className="input-field" placeholder="Source (e.g. Project Gutenberg)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required />
        <input className="input-field" placeholder="License (e.g. Public Domain)" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} />
        <input className="input-field" placeholder="Read-online URL" value={form.readOnlineUrl} onChange={(e) => setForm({ ...form, readOnlineUrl: e.target.value })} required />
        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn-primary flex-1">{editingId ? 'Save changes' : 'Add title'}</button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyDigital); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {items.map((b) => (
          <div key={b.id} className="card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-ink-50">{b.title}</p>
              <p className="text-xs text-ink-500">{b.author} · {b.source}</p>
            </div>
            <div className="whitespace-nowrap">
              <button onClick={() => edit(b)} className="text-shelf-400 hover:text-shelf-300 mr-3 text-sm">Edit</button>
              <button onClick={() => remove(b.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------- Borrow records tab ------------------------- */
function BorrowRecordsTab() {
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => api.get('/admin/borrow-records', { params: statusFilter ? { status: statusFilter } : {} })
    .then(({ data }) => setRecords(data.records));

  useEffect(() => { load(); }, [statusFilter]);

  const markPaid = async (id) => {
    await api.patch(`/admin/borrow-records/${id}/mark-paid`);
    load();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {['', 'borrowed', 'overdue', 'returned'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs border capitalize ${
              statusFilter === s ? 'bg-shelf-600 border-shelf-600 text-white' : 'border-ink-600 text-ink-500 hover:text-ink-100'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-600/60">
              <th className="p-3">User</th>
              <th className="p-3">Book</th>
              <th className="p-3">Library</th>
              <th className="p-3">Due</th>
              <th className="p-3">Status</th>
              <th className="p-3">Fine</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-ink-600/30 hover:bg-ink-700/30">
                <td className="p-3">
                  <p className="text-ink-50">{r.user.name}</p>
                  <p className="text-ink-500 text-xs">{r.user.email}</p>
                </td>
                <td className="p-3 text-ink-100">{r.book.title}</td>
                <td className="p-3 text-ink-500">{r.book.library?.name}</td>
                <td className="p-3 font-mono text-ink-100">{new Date(r.dueDate).toLocaleDateString()}</td>
                <td className="p-3 capitalize text-ink-100">{r.status}</td>
                <td className="p-3">
                  {r.fineAmount > 0 ? (
                    <span className={r.finePaid ? 'text-emerald-400' : 'text-red-400'}>
                      ₹{r.fineAmount} {r.finePaid ? '(paid)' : ''}
                    </span>
                  ) : '—'}
                </td>
                <td className="p-3 text-right">
                  {r.fineAmount > 0 && !r.finePaid && (
                    <button onClick={() => markPaid(r.id)} className="text-shelf-400 hover:text-shelf-300 text-xs">
                      Mark paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------ Users tab ------------------------------ */
function UsersTab() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get('/admin/users').then(({ data }) => setUsers(data.users)); }, []);

  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-500 border-b border-ink-600/60">
            <th className="p-3">Name</th>
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-ink-600/30 hover:bg-ink-700/30">
              <td className="p-3 text-ink-50">{u.name}</td>
              <td className="p-3 text-ink-100">@{u.username}</td>
              <td className="p-3 text-ink-500">{u.email}</td>
              <td className="p-3 text-ink-500">{u.phone}</td>
              <td className="p-3 capitalize text-ink-100">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------- Page -------------------------------- */
export default function AdminDashboard() {
  const [tab, setTab] = useState('Books');
  const [libraries, setLibraries] = useState([]);

  const reloadLibraries = () => api.get('/libraries').then(({ data }) => setLibraries(data.libraries));
  useEffect(() => { reloadLibraries(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl text-ink-50 mb-1">Admin dashboard</h1>
      <p className="text-ink-500 mb-8">Manage books, libraries, digital titles, and borrowing records.</p>

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

      {tab === 'Books' && <BooksTab libraries={libraries} />}
      {tab === 'Libraries' && <LibrariesTab libraries={libraries} reload={reloadLibraries} />}
      {tab === 'Digital Library' && <DigitalTab />}
      {tab === 'Borrow Records' && <BorrowRecordsTab />}
      {tab === 'Users' && <UsersTab />}
    </div>
  );
}
