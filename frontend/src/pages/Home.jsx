import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { config } from '@/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { useNavigate } from 'react-router-dom';

// Icônes SVG
const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function Home({ user }) {
  const { token } = useAuth();
  const navigate = useNavigate();
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

    if (token) {
      fetchCourses();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8 pt-20 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
              Modernisez
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                la gestion
              </span>
              <br />
              de votre école
            </h1>
            <p className="mt-6 text-xl leading-8 text-blue-100 max-w-2xl mx-auto">
              Des inscriptions aux bulletins, tout en un seul clic.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
                onClick={() => token ? navigate('/catalog') : navigate('/register')}
              >
                {token ? 'Voir les cours' : 'Commencer gratuitement'}
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Découvrir
              </Button>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              Découvrir nos fonctionnalités
            </p>
          </div>

          {/* Glass Cards Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Tableau de bord Card */}
            <Card variant="glass" className="p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">Tableau de bord</div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUpIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-lg text-gray-700 mb-1">
                  Bienvenue {user ? user.name : 'Visiteur'}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Nouv. registrés</span>
                  <span className="text-sm text-gray-600">Tuition</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">12</span>
                  <span className="text-xl font-bold">15 450 €</span>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-sm text-gray-600">Bulletins</span>
                  <div className="w-16 h-8 bg-blue-100 rounded"></div>
                </div>
                <div className="text-lg font-bold">134</div>
              </div>
            </Card>

            {/* Rapport mensuel Card */}
            <Card variant="glass" className="p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-4">Rapport mensuel</div>
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-full"></div>
                </div>
              </div>
            </Card>

            {/* Statistiques Card */}
            <Card variant="glass" className="p-6 transform hover:scale-105 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">Statistiques</div>
                <div className="flex justify-between items-end h-16">
                  <div className="w-6 bg-blue-400 h-8 rounded"></div>
                  <div className="w-6 bg-blue-500 h-12 rounded"></div>
                  <div className="w-6 bg-blue-600 h-10 rounded"></div>
                  <div className="w-6 bg-blue-700 h-16 rounded"></div>
                  <div className="w-6 bg-blue-800 h-6 rounded"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {token && (
        <div className="bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Aperçu de votre école</h2>
              <p className="text-blue-100">Statistiques en temps réel</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <MetricCard
                title="Élèves"
                value="1,247"
                icon={UsersIcon}
                trend="up"
                trendValue="+12%"
                className="backdrop-blur-lg bg-white/90"
              />
              <MetricCard
                title="Enseignants"
                value="89"
                icon={BookIcon}
                trend="up"
                trendValue="+5%"
                className="backdrop-blur-lg bg-white/90"
              />
              <MetricCard
                title="Classes"
                value="23"
                icon={BookIcon}
                trend="up"
                trendValue="+2%"
                className="backdrop-blur-lg bg-white/90"
              />
            </div>

            {/* Course Grid */}
            {courses.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 text-center">Cours disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <Card key={course.id} variant="glass" className="backdrop-blur-lg bg-white/90 hover:bg-white/95 transition-all duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{course.title}</h3>
                        <p className="text-gray-600 mb-4">{course.description?.String || 'Pas de description'}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Voir le cours
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
