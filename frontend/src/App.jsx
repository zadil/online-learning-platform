import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Catalog from './pages/Catalog';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TeacherPortal from './pages/TeacherPortal';
import "./App.css";

function App() {
  const { token, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    // Redirect to dashboard if user is a teacher/admin, otherwise to home
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Pages that should not show the navigation
  const noNavPages = ['/login', '/register', '/dashboard', '/teacher-portal'];
  const showNav = !noNavPages.includes(location.pathname);

  // Pages that have their own full layout
  const fullLayoutPages = ['/dashboard', '/teacher-portal'];
  const isFullLayout = fullLayoutPages.includes(location.pathname);

  if (isFullLayout) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
        <Route path="/teacher-portal" element={<TeacherPortal user={user} token={token} />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation moderne */}
      {showNav && (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">École Moderne</span>
              </div>

              {/* Navigation links */}
              <div className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => navigate("/", { replace: true })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === "/" 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Accueil
                </button>
                <button
                  onClick={() => navigate("/catalog", { replace: true })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === "/catalog" 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Catalogue
                </button>
                {token && (
                  <button
                    onClick={() => navigate("/dashboard", { replace: true })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/dashboard" 
                        ? "bg-primary-50 text-primary-600" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Tableau de bord
                  </button>
                )}
                {token && (
                  <button
                    onClick={() => navigate("/teacher-portal", { replace: true })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/teacher-portal" 
                        ? "bg-primary-50 text-primary-600" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Portail Enseignant
                  </button>
                )}
                {token && (
                  <button
                    onClick={() => navigate("/profile", { replace: true })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/profile" 
                        ? "bg-primary-50 text-primary-600" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Profil
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {!token ? (
                  <>
                    <button
                      onClick={() => navigate("/login", { replace: true })}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-all duration-200"
                    >
                      Connexion
                    </button>
                    <button
                      onClick={() => navigate("/register", { replace: true })}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-all duration-200"
                    >
                      Inscription
                    </button>
                  </>
                ) : (
                  <>
                    {user && (
                      <span className="text-gray-600 text-sm">
                        Bonjour, {user.name}
                      </span>
                    )}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className={showNav ? "" : ""}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={() => navigate("/login", { replace: true })} />} />
          <Route path="/profile" element={<Profile token={token} />} />
          <Route path="/catalog" element={<Catalog user={user} token={token} />} />
          <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
          <Route path="/teacher-portal" element={<TeacherPortal user={user} token={token} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
