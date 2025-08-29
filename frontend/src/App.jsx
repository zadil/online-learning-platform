import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Catalog from './pages/Catalog';
import Home from './pages/Home';
import "./App.css";

function App() {
  const { token, login, logout } = useAuth();
  const navigate = useNavigate();

  // Extraction du user depuis le profil si connecté
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!token) { setUser(null); return; }
    fetch("http://localhost:8080/protected/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, [token]);

  const handleLogin = (tok) => {
    login(tok);
    navigate("/", { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-blue-50 dark:from-zinc-900 dark:to-zinc-800">
      {/* Navigation modernisée */}
      <nav className="sticky top-0 z-20 w-full flex flex-wrap gap-2 items-center justify-center bg-zinc-900/90 dark:bg-zinc-950/80 shadow-lg py-3 px-2 rounded-b-2xl mb-8">
        <button
          onClick={() => navigate("/", { replace: true })}
          className={`mx-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/70 text-white ${window.location.pathname === "/" ? "bg-blue-600 shadow-lg" : "hover:bg-zinc-800/80"}`}
        >
          Accueil
        </button>
        <button
          onClick={() => navigate("/catalog", { replace: true })}
          className={`mx-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/70 text-white ${window.location.pathname === "/catalog" ? "bg-blue-600 shadow-lg" : "hover:bg-zinc-800/80"}`}
        >
          Catalogue
        </button>
        {token && (
          <button
            onClick={() => navigate("/profile", { replace: true })}
            className={`mx-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/70 text-white ${window.location.pathname === "/profile" ? "bg-blue-600 shadow-lg" : "hover:bg-zinc-800/80"}`}
          >
            Profil
          </button>
        )}
        {!token && (
          <button
            onClick={() => navigate("/login", { replace: true })}
            className={`mx-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/70 text-white ${window.location.pathname === "/login" ? "bg-blue-600 shadow-lg" : "hover:bg-zinc-800/80"}`}
          >
            Connexion
          </button>
        )}
        {!token && (
          <button
            onClick={() => navigate("/register", { replace: true })}
            className={`mx-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/70 text-white ${window.location.pathname === "/register" ? "bg-blue-600 shadow-lg" : "hover:bg-zinc-800/80"}`}
          >
            Inscription
          </button>
        )}
        {token && (
          <button
            onClick={handleLogout}
            className="mx-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Déconnexion
          </button>
        )}
      </nav>
      <main className="max-w-6xl mx-auto px-8 pb-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={() => navigate("/login", { replace: true })} />} />
          <Route path="/profile" element={<Profile token={token} />} />
          <Route path="/catalog" element={<Catalog user={user} token={token} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
