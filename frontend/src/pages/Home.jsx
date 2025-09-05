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
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${config.apiBaseUrl}/protected/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const coursesData = coursesRes.ok ? await coursesRes.json() : [];
        const usersData = usersRes.ok ? await usersRes.json() : [];
        
        setCourses(coursesData);
        
        // Calculate real statistics
        const students = usersData.filter(u => u.role === 'student');
        const teachers = usersData.filter(u => u.role === 'teacher');
        
        setStats({
          students: students.length,
          teachers: teachers.length,
          courses: coursesData.length
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600">
      {/* Hero Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="w-full">
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
                onClick={() => {
                  if (!token) {
                    navigate('/register');
                  } else if (user) {
                    // Redirection intelligente selon le rôle
                    switch (user.role) {
                      case 'admin':
                        navigate('/admin-dashboard');
                        break;
                      case 'secretariat':
                        navigate('/secretariat-dashboard');
                        break;
                      case 'teacher':
                        if (user.status === 'validated') {
                          navigate('/teacher-portal');
                        } else {
                          navigate('/catalog'); // Enseignant non validé peut voir les cours
                        }
                        break;
                      default:
                        navigate('/catalog');
                    }
                  } else {
                    navigate('/catalog');
                  }
                }}
              >
                {!token ? 'Commencer gratuitement' :
                 user?.role === 'admin' ? 'Administration' :
                 user?.role === 'secretariat' ? 'Secrétariat' :
                 user?.role === 'teacher' && user?.status === 'validated' ? 'Portail Enseignant' :
                 'Voir les cours'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/catalog')}
              >
                Découvrir
              </Button>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              Découvrir nos fonctionnalités
            </p>
          </div>

          {/* Message spécial pour enseignants non validés */}
          {user && user.role === 'teacher' && user.status === 'pending_validation' && (
            <div className="mt-16 px-4 sm:px-6 lg:px-8">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-yellow-600 text-2xl">⏳</span>
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-800 mb-2">Compte en attente de validation</h3>
                  <p className="text-yellow-700 mb-4">
                    Bonjour {user.name}, votre demande d'enseignant est en cours de traitement par l'administration. 
                    Vous recevrez un email dès que votre compte sera validé.
                  </p>
                  <div className="text-sm text-yellow-600">
                    <p><strong>Statut :</strong> En attente de validation</p>
                    <p><strong>Département :</strong> {user.department || 'Non spécifié'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Glass Cards Section */}
          <div className={`${user && user.role === 'teacher' && user.status === 'pending_validation' ? 'mt-8' : 'mt-24'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8`}>
            {/* Tableau de bord Card */}
            <Card variant="glass" className="p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">Profil Utilisateur</div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUpIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-lg text-gray-700 mb-1">
                  Bienvenue {user ? user.name : 'Visiteur'}
                </div>
                {user && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm text-gray-600">Rôle</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</span>
                      <span className={`text-sm font-medium capitalize ${
                        user.role === 'admin' ? 'text-red-600' :
                        user.role === 'secretariat' ? 'text-green-600' :
                        user.role === 'teacher' ? 'text-purple-600' :
                        'text-blue-600'
                      }`}>
                        {user.role === 'student' ? 'Apprenant' : 
                         user.role === 'teacher' ? 'Enseignant' :
                         user.role === 'secretariat' ? 'Secrétariat' :
                         user.role === 'admin' ? 'Administrateur' : user.role}
                      </span>
                    </div>
                    {user.role === 'teacher' && (
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'validated' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending_validation' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status === 'validated' ? 'Validé' :
                           user.status === 'pending_validation' ? 'En attente' : user.status}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 flex justify-between">
                      <span className="text-sm text-gray-600">Membre depuis</span>
                      <div className="text-sm text-gray-500">
                        {user.CreatedAt ? new Date(user.CreatedAt).toLocaleDateString('fr-FR') : 'Récemment'}
                      </div>
                    </div>
                  </>
                )}
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
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Aperçu de votre école</h2>
              <p className="text-blue-100">Statistiques en temps réel</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <MetricCard
                title="Étudiants"
                value={stats.students.toString()}
                icon={UsersIcon}
                trend="up"
                trendValue="+0%"
                className="backdrop-blur-lg bg-white/90"
              />
              <MetricCard
                title="Enseignants"
                value={stats.teachers.toString()}
                icon={BookIcon}
                trend="up"
                trendValue="+0%"
                className="backdrop-blur-lg bg-white/90"
              />
              <MetricCard
                title="Cours"
                value={stats.courses.toString()}
                icon={BookIcon}
                trend="up"
                trendValue="+0%"
                className="backdrop-blur-lg bg-white/90"
              />
            </div>

            {/* Course Grid */}
            {courses.length > 0 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">Cours disponibles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {courses.map(course => (
                    <Card key={course.id} variant="glass" className="backdrop-blur-lg bg-white/90 hover:bg-white/95 transition-all duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{course.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">{course.description?.String || 'Pas de description'}</p>
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
