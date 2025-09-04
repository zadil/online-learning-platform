import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

// Icônes SVG
const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z" />
  </svg>
);

export default function TeacherPortal({ user, token }) {
  const [activeTab, setActiveTab] = useState('notes');
  const [newGrade, setNewGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  // Données simulées
  const classInfo = {
    name: 'Classe 6ème A',
    students: 28,
    subject: 'Mathématiques - Contrôle'
  };

  const students = [
    { id: 1, name: 'Zoé Lefevre', grade: 15 },
    { id: 2, name: 'Léo Marchand', grade: null },
    { id: 3, name: 'Inès Lambert', grade: 13 },
    { id: 4, name: 'Jules Moreau', grade: 17 },
    { id: 5, name: 'Emma Dubois', grade: null },
  ];

  const stats = {
    average: 15.2
  };

  const recentActivity = [
    { text: 'Note ajoutée pour Léo Marchand', time: 'Il y a 2 heures' },
    { text: 'Devoir de Sciences créé', time: 'Il y a 4 heures' }
  ];

  const tabs = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'devoirs', label: 'Devoirs', icon: '📚' },
    { id: 'presences', label: 'Présences', icon: '✅' },
    { id: 'bulletins', label: 'Bulletins', icon: '📄' }
  ];

  const handleAddGrade = () => {
    if (selectedStudent && newGrade) {
      // Ici on ajouterait la logique pour sauvegarder la note
      console.log(`Ajout de la note ${newGrade} pour l'étudiant ${selectedStudent}`);
      setNewGrade('');
      setSelectedStudent('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portail Enseignant</h1>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Notes Tab Content */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Class Info */}
            <div className="space-y-6">
              {/* Mes Classes Card */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookIcon className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold">Mes Classes</h3>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{classInfo.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-white/80 mt-1">{classInfo.students} élèves</p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques Rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.average}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Moyenne</p>
                  </div>
                </CardContent>
              </Card>

              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Notes */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{classInfo.subject}</CardTitle>
                  <Button>Ajouter une note</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Note
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.grade !== null ? (
                                <span className="text-lg font-bold text-gray-900">
                                  {student.grade}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedStudent(student.id)}
                              >
                                {student.grade !== null ? 'Modifier' : 'Ajouter'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Add Grade Form (appears when student is selected) */}
              {selectedStudent && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Ajouter/Modifier une note</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4 items-end">
                      <div className="flex-1">
                        <Input
                          label="Note (sur 20)"
                          type="number"
                          min="0"
                          max="20"
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                          placeholder="Ex: 15"
                        />
                      </div>
                      <Button onClick={handleAddGrade}>
                        Enregistrer
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedStudent('');
                          setNewGrade('');
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Autres onglets - contenu de base */}
        {activeTab === 'devoirs' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des devoirs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devoir</h3>
                <p className="text-gray-600 mb-6">Créez votre premier devoir pour commencer.</p>
                <Button>Créer un devoir</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'presences' && (
          <Card>
            <CardHeader>
              <CardTitle>Suivi des présences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des présences</h3>
                <p className="text-gray-600 mb-6">Suivez la présence de vos élèves en temps réel.</p>
                <Button>Prendre les présences</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'bulletins' && (
          <Card>
            <CardHeader>
              <CardTitle>Bulletins de notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Génération de bulletins</h3>
                <p className="text-gray-600 mb-6">Générez et consultez les bulletins de vos élèves.</p>
                <Button>Voir les bulletins</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}