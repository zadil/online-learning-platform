docker-compose up -dimport { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Catalog from "./pages/Catalog";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");

  const handleLogin = (tok) => {
    setToken(tok);
    localStorage.setItem("jwt", tok);
    setPage("home");
  };
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("jwt");
    setPage("login");
  };

  return (
    <div className="container">
      <nav>
        <button onClick={() => setPage("home")}>Accueil</button>
        <button onClick={() => setPage("catalog")}>Catalogue</button>
        {token && <button onClick={() => setPage("profile")}>Profil</button>}
        {!token && <button onClick={() => setPage("login")}>Connexion</button>}
        {!token && <button onClick={() => setPage("register")}>Inscription</button>}
        {token && <button onClick={handleLogout}>Déconnexion</button>}
      </nav>
      <main>
        {page === "login" && <Login onLogin={handleLogin} />}
        {page === "register" && <Register onRegister={() => setPage("login")} />}
        {page === "profile" && <Profile token={token} />}
        {page === "catalog" && <Catalog />}
        {page === "home" && (
          <>
            <h1>Bienvenue sur la plateforme d'apprentissage !</h1>
            {token ? (
              <p>Vous êtes connecté 🎉</p>
            ) : (
              <p>Merci de vous connecter ou de créer un compte.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
