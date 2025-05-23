import { useEffect, useState } from "react";



export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/courses")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des cours");
        return res.json();
      })
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement du catalogue...</div>;

  return (
    <div className="catalog-container">
      <h2>Catalogue des cours</h2>
      {courses.length === 0 ? (
        <div>Aucun cours disponible pour le moment.</div>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
