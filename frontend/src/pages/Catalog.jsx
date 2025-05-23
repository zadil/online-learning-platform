import { useEffect, useState } from "react";



export default function Catalog({ user, token }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    setLoading(true);
    fetch("http://localhost:8080/courses")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des cours");
        return res.json();
      })
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!title.trim()) { setError("Le titre est obligatoire"); return; }
    try {
      const res = await fetch("http://localhost:8080/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la création du cours");
      }
      setTitle(""); setDescription(""); setSuccess("Cours créé !");
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };


  if (loading) return <div>Chargement du catalogue...</div>;

  return (
    <div className="catalog-container">
      <h2>Catalogue des cours</h2>

      {/* Formulaire de création visible seulement pour formateur/admin */}
      {user && (user.role === "formateur" || user.role === "admin") && (
        <form onSubmit={handleCreate} className="course-form">
          <h3>Créer un nouveau cours</h3>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <input
            type="text"
            placeholder="Titre du cours"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optionnelle)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button type="submit">Créer</button>
        </form>
      )}

      {Array.isArray(courses) && courses.length === 0 ? (
        <div>Aucun cours disponible pour le moment.</div>
      ) : Array.isArray(courses) && courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description && typeof course.description === 'object' ? (course.description.Valid ? course.description.String : "") : course.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>Erreur lors du chargement des cours.</div>
      )}
    </div>
  );
}
