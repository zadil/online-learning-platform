import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { config } from '@/config';

export default function Home() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) setCourses(data);
      } catch {
        console.error('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cours disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <div key={course.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description?.String || 'Pas de description'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
