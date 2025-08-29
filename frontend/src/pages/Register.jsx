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
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-zinc-900 dark:text-white">Inscription</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-zinc-900 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-zinc-900 dark:text-white"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-zinc-900 dark:text-white"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-zinc-900 dark:text-white"
          >
            <option value="apprenant">Apprenant</option>
            <option value="formateur">Formateur</option>
          </select>
          <button type="submit" className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all">S'inscrire</button>
          {error && <div className="text-red-600 text-center font-semibold mt-2">{error}</div>}
          {success && <div className="text-green-600 text-center font-semibold mt-2">Inscription réussie !</div>}
        </form>
      </div>
    </div>
  );
}
