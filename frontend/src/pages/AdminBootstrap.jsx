import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminBootstrap = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bootstrapKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bootstrapStatus, setBootstrapStatus] = useState(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  useEffect(() => {
    checkBootstrapAvailability();
  }, []);

  const checkBootstrapAvailability = async () => {
    try {
      const response = await fetch('http://localhost:8080/bo/setup/bootstrap');
      const data = await response.json();
      
      if (response.ok) {
        setBootstrapStatus(data);
        setAttemptsRemaining(data.attempts_remaining);
      } else {
        setError(data.error);
        // Mettre bootstrapStatus à false pour déclencher l'affichage  
        setBootstrapStatus(false);
        if (data.reason === 'déjà utilisé') {
          setTimeout(() => navigate('/bo/admin'), 3000);
        }
      }
    } catch (err) {
      console.error('Bootstrap API Error:', err);
      setError('Erreur de connexion au serveur: ' + err.message);
      // Mettre bootstrapStatus à false pour déclencher l'affichage
      setBootstrapStatus(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return false;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Un email valide est requis');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    if (!formData.bootstrapKey.trim()) {
      setError('La clé de bootstrap est requise');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/bo/setup/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          bootstrapKey: formData.bootstrapKey
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Premier administrateur créé avec succès !');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          bootstrapKey: ''
        });
        
        // Rediriger vers la page de connexion admin après 3 secondes
        setTimeout(() => {
          navigate('/bo/admin');
        }, 3000);
        
      } else {
        setError(data.error || 'Erreur lors de la création de l\'administrateur');
        if (data.attempts_remaining !== undefined) {
          setAttemptsRemaining(data.attempts_remaining);
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (!bootstrapStatus && !error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Vérification du statut bootstrap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Configuration Initiale
          </h2>
          <p className="text-gray-400 mb-6">
            Créez le premier compte administrateur pour accéder au système
          </p>
          
          {error && error.includes('déjà utilisé') && (
            <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg mb-4">
              <p>⚠️ Le bootstrap a déjà été utilisé.</p>
              <p className="text-sm mt-1">Redirection vers la page de connexion admin...</p>
            </div>
          )}
          
          {attemptsRemaining < 3 && attemptsRemaining > 0 && (
            <div className="bg-orange-900/50 border border-orange-600 text-orange-200 px-4 py-3 rounded-lg mb-4">
              <p>⚠️ Tentatives restantes: {attemptsRemaining}/3</p>
            </div>
          )}
        </div>

        {bootstrapStatus !== null && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Directeur Principal"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email administrateur *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@ecole-moderne.fr"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Mot de passe *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimum 8 caractères"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Répétez le mot de passe"
                />
              </div>
              
              <div>
                <label htmlFor="bootstrapKey" className="block text-sm font-medium text-gray-300 mb-2">
                  Clé de Bootstrap *
                </label>
                <input
                  id="bootstrapKey"
                  name="bootstrapKey"
                  type="password"
                  required
                  value={formData.bootstrapKey}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Clé secrète de configuration"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cette clé est fournie lors de l'installation du système
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-green-900/50 border border-green-600 text-green-200 px-4 py-3 rounded-lg">
                <p className="text-sm">{message}</p>
                <p className="text-xs mt-1">Redirection automatique vers la page de connexion...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (bootstrapStatus && !bootstrapStatus.available)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création en cours...
                </div>
              ) : (
                'Créer le Premier Administrateur'
              )}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                ← Retour à l'accueil
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminBootstrap;