import { useEffect, useState } from "react";

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/protected/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur d'accès au profil");
        }
        return res.json();
      })
      .then(setUser)
      .catch((err) => setError(err.message));
  }, [token]);

  if (!token) return <div>Veuillez vous connecter pour voir votre profil.</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div>Chargement du profil...</div>;

  return (
    <div className="profile-container">
      <h2>Mon Profil</h2>
      <ul>
        <li><b>ID :</b> {user.user_id}</li>
        <li><b>Email :</b> {user.email}</li>
        <li><b>Rôle :</b> {user.role}</li>
        <li><b>Date d'inscription :</b> {user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</li>
      </ul>
    </div>
  );
}
