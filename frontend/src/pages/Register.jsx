import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressSteps } from "@/components/ui/progress-steps";

export default function Register({ onRegister }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    name: "",
    firstName: "",
    birthDate: "",
    email: "",
    phone: "",
    // Étape 2: Informations de compte
    password: "",
    confirmPassword: "",
    role: "student",
    // Étape 3: Préférences
    newsletter: true,
    terms: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const stepErrors = {};
    if (!formData.name.trim()) stepErrors.name = "Le nom est requis";
    if (!formData.firstName.trim()) stepErrors.firstName = "Le prénom est requis";
    if (!formData.email.trim()) stepErrors.email = "L'email est requis";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = "Email invalide";
    if (!formData.phone.trim()) stepErrors.phone = "Le téléphone est requis";
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors = {};
    if (!formData.password) stepErrors.password = "Le mot de passe est requis";
    if (formData.password && formData.password.length < 6) stepErrors.password = "Le mot de passe doit faire au moins 6 caractères";
    if (!formData.confirmPassword) stepErrors.confirmPassword = "Confirmez le mot de passe";
    if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    const stepErrors = {};
    if (!formData.terms) stepErrors.terms = "Vous devez accepter les conditions d'utilisation";
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: `${formData.firstName} ${formData.name}`,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          birthDate: formData.birthDate
        }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        setError("Erreur serveur: réponse inattendue");
        return;
      }
      if (res.ok && data.id) {
        setSuccess(true);
        setTimeout(() => {
          onRegister && onRegister();
        }, 2000);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Erreur d'inscription");
      }
    } catch (err) {
      setError("Erreur réseau");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription réussie !</h2>
            <p className="text-gray-600">Vous allez être redirigé vers la page de connexion...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Nouvelle inscription
          </h1>
          
          <ProgressSteps 
            steps={['Informations personnelles', 'Compte', 'Finalisation']} 
            currentStep={currentStep - 1} 
          />
          
          <form onSubmit={handleSubmit}>
            {/* Étape 1: Informations personnelles */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Informations personnelles
                </h2>
                
                <div className="space-y-4">
                  <Input
                    label="Nom"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    error={errors.name}
                    required
                    placeholder="Votre nom"
                  />
                  
                  <Input
                    label="Prénom"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    error={errors.firstName}
                    required
                    placeholder="Votre prénom"
                  />
                  
                  <Input
                    label="Date de naissance"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateFormData('birthDate', e.target.value)}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    error={errors.email}
                    required
                    placeholder="votre@email.com"
                  />
                  
                  <Input
                    label="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    error={errors.phone}
                    required
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    className="w-full"
                    size="lg"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 2: Informations de compte */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Informations de compte
                </h2>
                
                <div className="space-y-4 mb-6">
                  <Input
                    label="Mot de passe"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    error={errors.password}
                    required
                    placeholder="Minimum 6 caractères"
                  />
                  
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                    placeholder="Confirmer votre mot de passe"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de compte
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => updateFormData('role', e.target.value)}
                      className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-sm text-gray-900 transition-all duration-200"
                    >
                      <option value="student">Apprenant</option>
                      <option value="teacher">Formateur</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button" 
                    onClick={handlePrev}
                    variant="secondary"
                    className="flex-1"
                    size="lg"
                  >
                    Précédent
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    className="flex-1"
                    size="lg"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 3: Finalisation */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Finalisation
                </h2>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={(e) => updateFormData('newsletter', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">
                      Je souhaite recevoir les actualités et offres par email
                    </span>
                  </label>
                  
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => updateFormData('terms', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">
                      J'accepte les{' '}
                      <a href="#" className="text-primary-500 underline">
                        conditions d'utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="#" className="text-primary-500 underline">
                        politique de confidentialité
                      </a>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-sm text-red-500">{errors.terms}</p>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button" 
                    onClick={handlePrev}
                    variant="secondary"
                    className="flex-1"
                    size="lg"
                  >
                    Précédent
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1"
                    size="lg"
                  >
                    Créer mon compte
                  </Button>
                </div>
              </div>
            )}
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
