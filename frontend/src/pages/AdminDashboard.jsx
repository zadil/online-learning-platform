import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { config } from '@/config';

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

const TeacherIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CourseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z" />
  </svg>
);

const ValidateIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function AdminDashboard({ user, token }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, requestsRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/admin/dashboard-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${config.apiBaseUrl}/admin/teacher-requests`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setTeacherRequests(requestsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      }
    };
    
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleValidateTeacher = async (teacherId, approve, comments = '') => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/admin/validate-teacher`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          approve,
          comments
        })
      });
      
      if (res.ok) {
        // Recharger les demandes
        const updatedRes = await fetch(`${config.apiBaseUrl}/admin/teacher-requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setTeacherRequests(updatedData);
        }
      }
    } catch (error) {
      console.error('Error validating teacher:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔐</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Administration</h2>
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
            icon={ValidateIcon}
            active={activeTab === 'teacher-validation'}
            onClick={() => setActiveTab('teacher-validation')}
          >
            Validation Enseignants
            {teacherRequests.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {teacherRequests.length}
              </span>
            )}
          </SidebarItem>
          <SidebarItem 
            icon={UsersIcon}
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          >
            Gestion Utilisateurs
          </SidebarItem>
          <SidebarItem 
            icon={CourseIcon}
            active={activeTab === 'courses'}
            onClick={() => setActiveTab('courses')}
          >
            Gestion Cours
          </SidebarItem>
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600">Gestion et supervision École Moderne</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-gray-700 block font-medium">{user.name}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user.name ? user.name.charAt(0).toUpperCase() : 'A'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Étudiants"
                  value={stats.total_students?.toString() || '0'}
                  icon={UsersIcon}
                  trend="up"
                  trendValue=""
                />
                <MetricCard
                  title="Enseignants"
                  value={`${stats.validated_teachers || 0}/${stats.total_teachers || 0}`}
                  icon={TeacherIcon}
                  trend={stats.pending_teacher_requests > 0 ? "down" : "up"}
                  trendValue={`${stats.pending_teacher_requests || 0} en attente`}
                />
                <MetricCard
                  title="Cours"
                  value={stats.total_courses?.toString() || '0'}
                  icon={CourseIcon}
                  trend={stats.courses_needing_teacher > 0 ? "down" : "up"}
                  trendValue={`${stats.courses_needing_teacher || 0} sans enseignant`}
                />
                <MetricCard
                  title="Validations"
                  value={stats.pending_teacher_requests?.toString() || '0'}
                  icon={ValidateIcon}
                  trend={stats.pending_teacher_requests > 0 ? "down" : "up"}
                  trendValue="En attente"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('teacher-validation')}
                    >
                      <ValidateIcon className="w-4 h-4 mr-2" />
                      Valider les enseignants ({teacherRequests.length})
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('users')}
                    >
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Gérer les utilisateurs
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('courses')}
                    >
                      <CourseIcon className="w-4 h-4 mr-2" />
                      Superviser les cours
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vue d'ensemble</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Enseignants validés</span>
                        <span className="font-semibold text-green-600">
                          {stats.validated_teachers || 0} / {stats.total_teachers || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cours actifs</span>
                        <span className="font-semibold text-blue-600">
                          {(stats.total_courses || 0) - (stats.courses_needing_teacher || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Validations en attente</span>
                        <span className={`font-semibold ${stats.pending_teacher_requests > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {stats.pending_teacher_requests || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'teacher-validation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Validation des Enseignants</h2>
              
              {teacherRequests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <ValidateIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune demande de validation en attente</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {teacherRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                            <p className="text-gray-600">{request.email}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm"><span className="font-medium">Département:</span> {request.department}</p>
                              <p className="text-sm"><span className="font-medium">Spécialisation:</span> {request.specialization}</p>
                              <p className="text-sm"><span className="font-medium">Expérience:</span> {request.experience}</p>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-medium">Documents:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {request.documents?.map((doc, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleValidateTeacher(request.id, false, 'Dossier incomplet')}
                            >
                              Rejeter
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleValidateTeacher(request.id, true, 'Validation approuvée')}
                            >
                              Valider
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des Utilisateurs</h2>
              <Card>
                <CardContent className="text-center py-8">
                  <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Interface de gestion des utilisateurs à développer</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des Cours</h2>
              <Card>
                <CardContent className="text-center py-8">
                  <CourseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Interface de gestion des cours à développer</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}