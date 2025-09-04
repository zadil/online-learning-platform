import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';

// Icônes SVG
const DashboardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const TeachersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z" />
  </svg>
);

const ReportsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MessageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default function Dashboard({ user, token }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Redirection si pas connecté
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder au tableau de bord.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Loading state while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Fetch real statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          fetch('http://localhost:8080/protected/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8080/courses', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const users = usersRes.ok ? await usersRes.json() : [];
        const courses = coursesRes.ok ? await coursesRes.json() : [];
        
        const students = users.filter(u => u.role === 'student');
        const teachers = users.filter(u => u.role === 'teacher');
        
        setStats({
          students: students.length,
          teachers: teachers.length,
          courses: courses.length
        });
        
        // Set recent activities based on user creation dates
        const recentUsers = users
          .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
          .slice(0, 3)
          .map(user => ({
            title: `Nouvel utilisateur: ${user.name}`,
            type: user.role === 'student' ? 'Inscription' : 'Enseignant',
            time: new Date(user.CreatedAt).toLocaleDateString('fr-FR')
          }));
        
        setRecentActivities(recentUsers);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };
    
    if (token) {
      fetchStats();
    }
  }, [token]);

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Real metrics based on fetched data
  const metrics = {
    students: { value: stats.students.toString(), trend: 'up', trendValue: '+0%' },
    teachers: { value: stats.teachers.toString(), trend: 'up', trendValue: '+0%' },
    classes: { value: stats.courses.toString(), trend: 'up', trendValue: '+0%' }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">📊</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Tableau de bord</h2>
              <p className="text-sm text-gray-500">École Moderne</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarItem 
            icon={DashboardIcon} 
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          >
            Tableau de bord
          </SidebarItem>
          <SidebarItem 
            icon={UsersIcon}
            active={activeTab === 'students'}
            onClick={() => setActiveTab('students')}
          >
            Élèves
          </SidebarItem>
          <SidebarItem 
            icon={TeachersIcon}
            active={activeTab === 'teachers'}
            onClick={() => setActiveTab('teachers')}
          >
            Enseignants
          </SidebarItem>
          <SidebarItem 
            icon={BookIcon}
            active={activeTab === 'classes'}
            onClick={() => setActiveTab('classes')}
          >
            Classes
          </SidebarItem>
          <SidebarItem 
            icon={ReportsIcon}
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          >
            Rapports
          </SidebarItem>
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600">École Moderne</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-gray-700 block font-medium">{user.name}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Élèves"
              value={metrics.students.value}
              icon={UsersIcon}
              trend={metrics.students.trend}
              trendValue={metrics.students.trendValue}
            />
            <MetricCard
              title="Enseignants"
              value={metrics.teachers.value}
              icon={TeachersIcon}
              trend={metrics.teachers.trend}
              trendValue={metrics.teachers.trendValue}
            />
            <MetricCard
              title="Classes"
              value={metrics.classes.value}
              icon={BookIcon}
              trend={metrics.classes.trend}
              trendValue={metrics.classes.trendValue}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Présence Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Présence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>20%</span>
                      <span>60%</span>
                      <span>100%</span>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-70" 
                           style={{ clipPath: 'polygon(0 80%, 20% 70%, 40% 75%, 60% 60%, 80% 50%, 100% 45%, 100% 100%, 0% 100%)' }}>
                      </div>
                      <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        96%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gains Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gains</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600 font-medium">Nouvel 61</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end h-32 space-x-2">
                    {[
                      { label: 'Jan', blue: 60, green: 40 },
                      { label: 'Fév', blue: 80, green: 55 },
                      { label: 'Mar', blue: 70, green: 65 },
                      { label: 'Jun', blue: 90, green: 75 },
                      { label: 'Juin', blue: 85, green: 60 }
                    ].map((month, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div className="flex flex-col space-y-1">
                          <div 
                            className="w-8 bg-blue-500 rounded-t"
                            style={{ height: `${month.blue}px` }}
                          ></div>
                          <div 
                            className="w-8 bg-green-500 rounded-b"
                            style={{ height: `${month.green}px` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{month.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Activity & Profile */}
            <div className="space-y-6">
              {/* User Profile Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Profil Utilisateur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Rôle</span>
                      <span className="text-sm font-medium text-blue-600 capitalize">
                        {user.role === 'student' ? 'Apprenant' : user.role === 'teacher' ? 'Formateur' : user.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Membre depuis</span>
                      <span className="text-sm text-gray-500">
                        {user.CreatedAt ? new Date(user.CreatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{stats.students + stats.teachers}</div>
                    <div className="text-sm text-gray-600">Utilisateurs total</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{stats.students}</div>
                      <div className="text-xs text-gray-500">Apprenants</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{stats.teachers}</div>
                      <div className="text-xs text-gray-500">Formateurs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Activités Récentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">👤</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-xs text-gray-600">{activity.type}</span>
                            <span className="text-xs text-gray-400">• {activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">📊</div>
                      <p className="text-sm text-gray-500">Aucune activité récente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}