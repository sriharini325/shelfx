import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    isActive ? 'text-shelf-300 bg-shelf-500/10' : 'text-ink-100 hover:text-shelf-300'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-600/60 bg-ink-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-shelf-500 to-shelf-800 flex items-center justify-center shadow-glow">
            <span className="font-display text-white text-sm">X</span>
          </span>
          <span className="font-display text-lg tracking-wide text-ink-50 group-hover:text-shelf-300 transition-colors">
            Shelf<span className="text-shelf-400">X</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/search" className={linkClass}>Search</NavLink>
          <NavLink to="/libraries" className={linkClass}>Libraries</NavLink>
          <NavLink to="/digital-library" className={linkClass}>Digital Library</NavLink>
          {user && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-ink-500">
                Hi, <span className="text-ink-100">{user.name.split(' ')[0]}</span>
              </span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="btn-secondary !px-4 !py-1.5 text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-1.5 text-sm">Log in</Link>
              <Link to="/register" className="btn-primary !px-4 !py-1.5 text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/search" className={linkClass}>Search</NavLink>
        <NavLink to="/libraries" className={linkClass}>Libraries</NavLink>
        <NavLink to="/digital-library" className={linkClass}>Digital</NavLink>
        {user && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
      </nav>
    </header>
  );
}
