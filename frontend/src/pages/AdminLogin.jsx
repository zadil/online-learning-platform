import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);

  // Vérifier si l'utilisateur est déjà bloqué
  useEffect(() => {
    const blockedUntil = localStorage.getItem('adminLoginBlocked');
    if (blockedUntil) {
      const blockTime = new Date(blockedUntil);
      const now = new Date();
      if (now < blockTime) {
        setBlocked(true);
        const minutes = Math.ceil((blockTime - now) / (1000 * 60));
        setError(`Accès temporairement bloqué. Réessayez dans ${minutes} minute(s).`);
      } else {
        localStorage.removeItem('adminLoginBlocked');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (blocked) {
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      // Authentification admin avec clé supplémentaire
      const res = await fetch("http://localhost:8080/bo/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          adminKey,
          source: 'admin_backoffice' 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token && data.user?.role === 'admin') {
        // Réinitialiser les tentatives en cas de succès
        localStorage.removeItem('adminLoginAttempts');
        localStorage.removeItem('adminLoginBlocked');
        
        login(data.token);
        navigate('/bo/admin/dashboard', { replace: true });
      } else {
        // Incrémenter les tentatives échouées
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('adminLoginAttempts', newAttempts.toString());
        
        if (newAttempts >= 3) {
          // Bloquer pendant 15 minutes après 3 tentatives
          const blockUntil = new Date(Date.now() + 15 * 60 * 1000);
          localStorage.setItem('adminLoginBlocked', blockUntil.toISOString());
          setBlocked(true);
          setError("Trop de tentatives échouées. Accès bloqué pendant 15 minutes pour des raisons de sécurité.");
        } else {
          setError(data.error || `Identifiants invalides. Tentative ${newAttempts}/3`);
        }
      }
    } catch (err) {
      setError("Erreur de connexion. Vérifiez votre connexion réseau.");
    } finally {
      setLoading(false);
    }
  };

  // Redirection si pas sur la bonne URL
  useEffect(() => {
    if (window.location.pathname !== '/bo/admin') {
      navigate('/bo/admin', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
      {/* Warning overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
      
      <Card className="w-full max-w-md mx-4 relative z-10 border-red-800 shadow-2xl bg-gray-900/90 backdrop-blur-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            {/* Icône de sécurité */}
            <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Administration</h1>
            <p className="text-gray-300">Accès sécurisé - Back Office</p>
            <div className="mt-2 text-xs text-red-300">
              🔒 Zone restreinte - Accès autorisé uniquement
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email administrateur"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={blocked}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
            
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={blocked}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />

            <Input
              label="Clé d'accès administrateur"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Clé de sécurité supplémentaire"
              required
              disabled={blocked}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />

            <Button 
              type="submit" 
              disabled={loading || blocked}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Vérification...
                </div>
              ) : (
                'Accès Admin'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="text-xs text-gray-400 space-y-1">
              <div>⚠️ Connexion enregistrée et monitored</div>
              <div>🔐 Authentification à double facteur requise</div>
              <div>📊 IP: {window.location.hostname}</div>
            </div>
          </div>

          {/* Lien de retour (discret) */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-500 hover:text-gray-400 underline"
            >
              ← Retour au site principal
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Particles effect pour le style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-32 left-32 w-1 h-1 bg-red-400 rounded-full opacity-40 animate-pulse"></div>
      </div>
    </div>
  );
}