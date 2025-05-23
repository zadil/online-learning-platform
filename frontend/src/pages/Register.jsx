import { useState } from "react";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("apprenant");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        // Si la réponse n'est pas du JSON
        setError("Erreur serveur: réponse inattendue");
        return;
      }
      if (res.ok && data.id) {
        setSuccess(true);
        onRegister && onRegister();
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Erreur d'inscription");
      }
    } catch (err) {
      setError("Erreur réseau");
    }
  };


  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="apprenant">Apprenant</option>
          <option value="formateur">Formateur</option>
        </select>
        <button type="submit">S'inscrire</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Inscription réussie !</div>}
      </form>
    </div>
  );
}
