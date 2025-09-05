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

const TaskIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const StudentsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function SecretariatDashboard({ user, token }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [tasks, setTasks] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes, enrollmentsRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/secretariat/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${config.apiBaseUrl}/secretariat/tasks?status=pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${config.apiBaseUrl}/secretariat/students/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
        
        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json();
          setPendingEnrollments(enrollmentsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching secretariat data:', error);
        setLoading(false);
      }
    };
    
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleProcessEnrollment = async (enrollmentId, approve) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/secretariat/process-enrollment/${enrollmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approve })
      });
      
      if (res.ok) {
        // Recharger les inscriptions
        const updatedRes = await fetch(`${config.apiBaseUrl}/secretariat/students/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setPendingEnrollments(updatedData);
        }
      }
    } catch (error) {
      console.error('Error processing enrollment:', error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/secretariat/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        // Recharger les tâches
        const updatedRes = await fetch(`${config.apiBaseUrl}/secretariat/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setTasks(updatedData);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
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
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar className={`fixed lg:relative z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <SidebarHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">📋</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Secrétariat</h2>
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
            icon={TaskIcon}
            active={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
          >
            Tâches
            {stats.tasks_today > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.tasks_today}
              </span>
            )}
          </SidebarItem>
          <SidebarItem 
            icon={StudentsIcon}
            active={activeTab === 'enrollments'}
            onClick={() => setActiveTab('enrollments')}
          >
            Inscriptions
            {pendingEnrollments.length > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingEnrollments.length}
              </span>
            )}
          </SidebarItem>
          <SidebarItem 
            icon={CalendarIcon}
            active={activeTab === 'schedules'}
            onClick={() => setActiveTab('schedules')}
          >
            Emploi du temps
          </SidebarItem>
          <SidebarItem 
            icon={DocumentIcon}
            active={activeTab === 'documents'}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </SidebarItem>
        </SidebarContent>
      </Sidebar>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Secrétariat</h1>
              <p className="text-gray-600">Gestion administrative École Moderne</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-gray-700 block font-medium">{user.name}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <MetricCard
                  title="Inscriptions en attente"
                  value={stats.pending_enrollments?.toString() || '0'}
                  icon={StudentsIcon}
                  trend={stats.pending_enrollments > 0 ? "up" : "neutral"}
                  trendValue="À traiter"
                />
                <MetricCard
                  title="Tâches aujourd'hui"
                  value={stats.tasks_today?.toString() || '0'}
                  icon={TaskIcon}
                  trend={stats.high_priority_tasks > 0 ? "up" : "neutral"}
                  trendValue={`${stats.high_priority_tasks || 0} prioritaires`}
                />
                <MetricCard
                  title="Documents à vérifier"
                  value={stats.documents_to_check?.toString() || '0'}
                  icon={DocumentIcon}
                  trend="neutral"
                  trendValue="En attente"
                />
                <MetricCard
                  title="Conflits horaires"
                  value={stats.unresolved_conflicts?.toString() || '0'}
                  icon={ClockIcon}
                  trend={stats.unresolved_conflicts > 0 ? "down" : "up"}
                  trendValue="À résoudre"
                />
              </div>

              {/* Tâches urgentes et actions rapides */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TaskIcon className="w-5 h-5 mr-2 text-orange-500" />
                      Tâches Prioritaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Aucune tâche prioritaire</p>
                    ) : (
                      <div className="space-y-3">
                        {tasks
                          .filter(task => task.priority === 'high' && task.status !== 'completed')
                          .slice(0, 3)
                          .map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{task.title}</p>
                              <p className="text-sm text-gray-600">{task.type}</p>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                            >
                              Terminé
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <StudentsIcon className="w-5 h-5 mr-2 text-blue-500" />
                      Inscriptions Récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingEnrollments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Aucune inscription en attente</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingEnrollments.slice(0, 3).map((enrollment) => (
                          <div key={enrollment.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{enrollment.name}</p>
                              <p className="text-sm text-gray-600">Classe: {enrollment.class}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleProcessEnrollment(enrollment.id, false)}
                              >
                                Rejeter
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleProcessEnrollment(enrollment.id, true)}
                              >
                                Approuver
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Actions rapides */}
              <div className="mt-6 sm:mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setActiveTab('enrollments')}
                      >
                        <StudentsIcon className="w-4 h-4 mr-2" />
                        Gérer inscriptions ({pendingEnrollments.length})
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setActiveTab('tasks')}
                      >
                        <TaskIcon className="w-4 h-4 mr-2" />
                        Voir toutes les tâches
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setActiveTab('schedules')}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Emploi du temps
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des Tâches</h2>
                <Button>Nouvelle tâche</Button>
              </div>
              
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <TaskIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune tâche assignée</p>
                    </CardContent>
                  </Card>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{task.description}</p>
                            <p className="text-sm text-gray-500">Type: {task.type}</p>
                          </div>
                          {task.status !== 'completed' && (
                            <div className="flex space-x-2">
                              {task.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                >
                                  Commencer
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => updateTaskStatus(task.id, 'completed')}
                              >
                                Terminé
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'enrollments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Inscriptions</h2>
              
              {pendingEnrollments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <StudentsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune inscription en attente</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingEnrollments.map((enrollment) => (
                    <Card key={enrollment.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{enrollment.name}</h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm"><span className="font-medium">Classe demandée:</span> {enrollment.class}</p>
                              <p className="text-sm"><span className="font-medium">Contact parent:</span> {enrollment.parentContact || 'Non fourni'}</p>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-medium">Documents fournis:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {enrollment.documents?.map((doc, index) => (
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
                              onClick={() => handleProcessEnrollment(enrollment.id, false)}
                            >
                              Rejeter
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleProcessEnrollment(enrollment.id, true)}
                            >
                              Approuver
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

          {activeTab === 'schedules' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des Emplois du Temps</h2>
              <Card>
                <CardContent className="text-center py-8">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Interface de gestion des horaires à développer</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des Documents</h2>
              <Card>
                <CardContent className="text-center py-8">
                  <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Interface de gestion des documents à développer</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}