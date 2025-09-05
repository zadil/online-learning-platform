import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { config } from '@/config';

// Icônes pour le back-office
const SecurityIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

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

const ValidateIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function BackOfficeAdminDashboard({ user, token }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('security');
  const [stats, setStats] = useState({});
  const [securityLogs, setSecurityLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Vérification de sécurité - access admin uniquement
  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      navigate('/bo/admin', { replace: true });
      return;
    }

    // Vérifier que l'utilisateur accède depuis la bonne route
    if (!window.location.pathname.startsWith('/bo/admin/')) {
      navigate('/bo/admin', { replace: true });
      return;
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchSecurityData = async () => {
      if (!token) return;
      
      try {
        const [statsRes, logsRes, healthRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/bo/admin/security-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${config.apiBaseUrl}/bo/admin/security-logs`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${config.apiBaseUrl}/bo/admin/system-health`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setSecurityLogs(logsData);
        }
        
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setSystemHealth(healthData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching security data:', error);
        setLoading(false);
      }
    };
    
    if (token && user?.role === 'admin') {
      fetchSecurityData();
      // Rafraîchir toutes les 30 secondes pour les données de sécurité
      const interval = setInterval(fetchSecurityData, 30000);
      return () => clearInterval(interval);
    }
  }, [token, user]);

  const handleSecureLogout = () => {
    // Log de déconnexion pour audit
    fetch(`${config.apiBaseUrl}/bo/admin/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {}); // Ne pas bloquer la déconnexion si l'API échoue
    
    // Nettoyer le localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminLoginAttempts');
    
    // Redirection vers la page de login admin
    navigate('/bo/admin', { replace: true });
    window.location.reload(); // Force refresh pour nettoyer l'état
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement du back-office sécurisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex relative">
      {/* Security Banner */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50 text-sm">
        🔒 BACK-OFFICE ADMINISTRATEUR - Session sécurisée - IP: {window.location.hostname}
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-14 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 text-gray-300 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar className={`fixed lg:relative z-40 transform transition-transform duration-300 ease-in-out bg-gray-800 border-gray-700 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <SidebarHeader className="border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔐</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Back Office</h2>
              <p className="text-sm text-gray-400">Administration Sécurisée</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarItem 
            icon={SecurityIcon} 
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Sécurité
          </SidebarItem>
          <SidebarItem 
            icon={DashboardIcon}
            active={activeTab === 'monitoring'}
            onClick={() => setActiveTab('monitoring')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Monitoring
          </SidebarItem>
          <SidebarItem 
            icon={UsersIcon}
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Gestion Utilisateurs
          </SidebarItem>
          <SidebarItem 
            icon={ValidateIcon}
            active={activeTab === 'validation'}
            onClick={() => setActiveTab('validation')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Validations
          </SidebarItem>
          <SidebarItem 
            icon={LogsIcon}
            active={activeTab === 'logs'}
            onClick={() => setActiveTab('logs')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Logs Système
          </SidebarItem>
          <SidebarItem 
            icon={SettingsIcon}
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Configuration
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
        <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4 mt-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Administration Back-Office</h1>
              <p className="text-gray-400">Contrôle et supervision système</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-white block font-medium">{user.name}</span>
                <span className="text-sm text-gray-400">Super Admin</span>
              </div>
              <Button
                onClick={handleSecureLogout}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Déconnexion Sécurisée
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-900">
          {activeTab === 'security' && (
            <>
              {/* Security Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <MetricCard
                  title="Tentatives de connexion"
                  value={stats.login_attempts?.toString() || '0'}
                  icon={SecurityIcon}
                  trend={stats.failed_logins > 0 ? "down" : "up"}
                  trendValue={`${stats.failed_logins || 0} échouées`}
                  className="bg-gray-800 text-white border-gray-700"
                />
                <MetricCard
                  title="Sessions actives"
                  value={stats.active_sessions?.toString() || '0'}
                  icon={UsersIcon}
                  trend="neutral"
                  trendValue="En temps réel"
                  className="bg-gray-800 text-white border-gray-700"
                />
                <MetricCard
                  title="Alertes sécurité"
                  value={stats.security_alerts?.toString() || '0'}
                  icon={ValidateIcon}
                  trend={stats.security_alerts > 0 ? "down" : "up"}
                  trendValue={stats.security_alerts > 0 ? "Attention" : "OK"}
                  className="bg-gray-800 text-white border-gray-700"
                />
                <MetricCard
                  title="Système"
                  value={systemHealth.status || 'OK'}
                  icon={DashboardIcon}
                  trend={systemHealth.status === 'OK' ? "up" : "down"}
                  trendValue={`${systemHealth.uptime || '99.9'}%`}
                  className="bg-gray-800 text-white border-gray-700"
                />
              </div>

              {/* Security Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Événements Sécurité Récents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {securityLogs.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">Aucun événement récent</p>
                    ) : (
                      <div className="space-y-3">
                        {securityLogs.slice(0, 5).map((log, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                            <div>
                              <p className="text-white text-sm">{log.event}</p>
                              <p className="text-gray-400 text-xs">{log.timestamp}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${
                              log.level === 'critical' ? 'bg-red-600 text-white' :
                              log.level === 'warning' ? 'bg-yellow-600 text-white' :
                              'bg-green-600 text-white'
                            }`}>
                              {log.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Contrôles de Sécurité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      🔒 Verrouiller toutes les sessions
                    </Button>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                      ⚠️ Mode maintenance
                    </Button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      📊 Générer rapport sécurité
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      🔄 Actualiser les données
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Autres onglets */}
          {activeTab !== 'security' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-8">
                <div className="text-gray-400 mb-4 text-6xl">🚧</div>
                <h3 className="text-white text-xl mb-2">Section en développement</h3>
                <p className="text-gray-400">Cette fonctionnalité sera disponible prochainement.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}