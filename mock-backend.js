const http = require('http');
const url = require('url');

// Mock data avec structure de rôles et statuts
const mockUsers = [
  // Administrateur (Directeur/Direction)
  { 
    id: 1, 
    name: 'Directeur Principal', 
    email: 'directeur@ecole-moderne.fr', 
    role: 'admin',
    status: 'active',
    permissions: ['all'],
    CreatedAt: new Date('2024-01-01').toISOString()
  },
  // Secrétariat
  { 
    id: 2, 
    name: 'Secrétaire Générale', 
    email: 'secretariat@ecole-moderne.fr', 
    role: 'secretariat',
    status: 'active',
    permissions: ['manage_students', 'manage_enrollments', 'view_reports', 'manage_schedules'],
    department: 'Administration',
    CreatedAt: new Date('2024-01-05').toISOString()
  },
  // Enseignants validés
  { 
    id: 3, 
    name: 'Marie Dubois', 
    email: 'marie.dubois@ecole-moderne.fr', 
    role: 'teacher',
    status: 'validated',
    permissions: ['manage_courses', 'view_students', 'manage_grades'],
    department: 'Mathématiques',
    specialization: 'Algèbre, Géométrie',
    validatedBy: 1,
    validatedAt: new Date('2024-02-01').toISOString(),
    CreatedAt: new Date('2024-01-28').toISOString()
  },
  { 
    id: 4, 
    name: 'Pierre Coefficient', 
    email: 'pierre.coefficient@ecole-moderne.fr', 
    role: 'teacher',
    status: 'validated',
    permissions: ['manage_courses', 'view_students', 'manage_grades'],
    department: 'Physique-Chimie',
    specialization: 'Physique Quantique, Chimie Organique',
    validatedBy: 1,
    validatedAt: new Date('2024-02-15').toISOString(),
    CreatedAt: new Date('2024-02-10').toISOString()
  },
  // Enseignant en attente de validation
  { 
    id: 5, 
    name: 'Sophie Laurent', 
    email: 'sophie.laurent@gmail.com', 
    role: 'teacher',
    status: 'pending_validation',
    permissions: ['limited_access'],
    department: 'Littérature',
    specialization: 'Littérature Française, Philosophie',
    documents: ['cv.pdf', 'diplomes.pdf', 'recommandations.pdf'],
    CreatedAt: new Date('2024-03-01').toISOString()
  },
  // Étudiants
  { 
    id: 6, 
    name: 'Votre Nom Réel', 
    email: 'votre.email@example.com', 
    role: 'student',
    status: 'active',
    permissions: ['view_courses', 'submit_assignments'],
    class: 'Terminale S',
    studentId: '2024-TS-001',
    parentContact: 'parent@example.com',
    CreatedAt: new Date('2024-01-15').toISOString()
  },
  { 
    id: 7, 
    name: 'Lucas Martin', 
    email: 'lucas.martin@etudiant.ecole.fr', 
    role: 'student',
    status: 'active',
    permissions: ['view_courses', 'submit_assignments'],
    class: '1ère ES',
    studentId: '2024-ES-015',
    parentContact: 'martin.parent@email.com',
    CreatedAt: new Date('2024-02-01').toISOString()
  }
];

const mockCourses = [
  { 
    id: 1, 
    title: 'Mathématiques - Terminale S',
    description: { String: 'Programme complet de mathématiques pour la Terminale S' },
    teacherId: 3,
    teacherName: 'Marie Dubois',
    class: 'Terminale S',
    schedule: 'Lundi 8h-10h, Mercredi 14h-16h, Vendredi 10h-12h',
    studentsCount: 28,
    status: 'active'
  },
  { 
    id: 2, 
    title: 'Physique-Chimie - Terminale S',
    description: { String: 'Cours de physique et chimie niveau Terminale scientifique' },
    teacherId: 4,
    teacherName: 'Pierre Coefficient',
    class: 'Terminale S',
    schedule: 'Mardi 9h-11h, Jeudi 15h-17h',
    studentsCount: 28,
    status: 'active'
  },
  { 
    id: 3, 
    title: 'Sciences Économiques - 1ère ES',
    description: { String: 'Introduction aux sciences économiques et sociales' },
    teacherId: null,
    teacherName: 'À assigner',
    class: '1ère ES',
    schedule: 'À définir',
    studentsCount: 24,
    status: 'need_teacher'
  }
];

// Données pour les demandes de validation d'enseignants
const teacherValidationRequests = [
  {
    id: 5,
    name: 'Sophie Laurent',
    email: 'sophie.laurent@gmail.com',
    department: 'Littérature',
    specialization: 'Littérature Française, Philosophie',
    experience: '5 ans d\'enseignement en lycée privé',
    documents: ['cv.pdf', 'diplomes.pdf', 'recommandations.pdf'],
    requestDate: new Date('2024-03-01').toISOString(),
    status: 'pending_review'
  }
];

// Données pour les tâches du secrétariat
const secretariatTasks = [
  {
    id: 1,
    type: 'student_enrollment',
    title: 'Traiter 3 nouvelles inscriptions',
    description: 'Valider les dossiers d\'inscription et assigner les classes',
    priority: 'high',
    dueDate: new Date().toISOString(),
    assignedTo: 2,
    status: 'pending'
  },
  {
    id: 2,
    type: 'teacher_validation',
    title: 'Valider le profil enseignant de Sophie Laurent',
    description: 'Vérifier les documents et programmer un entretien',
    priority: 'medium',
    dueDate: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
    assignedTo: 1,
    status: 'pending'
  },
  {
    id: 3,
    type: 'schedule_conflict',
    title: 'Résoudre conflit d\'horaires Terminale S',
    description: 'Deux cours programmés simultanément en salle 201',
    priority: 'high',
    dueDate: new Date().toISOString(),
    assignedTo: 2,
    status: 'in_progress'
  }
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Set JSON response header
  res.setHeader('Content-Type', 'application/json');

  console.log(`${req.method} ${path}`);

  try {
    // Routes
    if (path === '/protected/me' && req.method === 'GET') {
      // Simuler différents utilisateurs selon l'token (pour test)
      const authHeader = req.headers.authorization;
      let user = mockUsers[0]; // Par défaut admin
      
      if (authHeader && authHeader.includes('student')) user = mockUsers[5];
      else if (authHeader && authHeader.includes('teacher')) user = mockUsers[2];
      else if (authHeader && authHeader.includes('secretariat')) user = mockUsers[1];
      
      res.writeHead(200);
      res.end(JSON.stringify(user));
    }
    else if (path === '/protected/users' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(mockUsers));
    }
    else if (path === '/courses' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(mockCourses));
    }
    else if (path === '/admin/teacher-requests' && req.method === 'GET') {
      // Demandes de validation d'enseignants (admin seulement)
      res.writeHead(200);
      res.end(JSON.stringify(teacherValidationRequests));
    }
    else if (path === '/admin/validate-teacher' && req.method === 'POST') {
      // Validation d'un enseignant
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Enseignant validé avec succès' }));
    }
    else if (path === '/secretariat/tasks' && req.method === 'GET') {
      // Tâches pour le secrétariat
      res.writeHead(200);
      res.end(JSON.stringify(secretariatTasks));
    }
    else if (path === '/secretariat/students/pending' && req.method === 'GET') {
      // Étudiants en attente d'inscription
      const pendingStudents = [
        { id: 8, name: 'Emma Rousseau', class: '2nde A', documents: ['bulletin.pdf', 'certificat.pdf'] },
        { id: 9, name: 'Thomas Petit', class: '1ère S', documents: ['bulletin.pdf', 'medical.pdf'] },
        { id: 10, name: 'Clara Moreau', class: 'Terminale L', documents: ['bulletin.pdf'] }
      ];
      res.writeHead(200);
      res.end(JSON.stringify(pendingStudents));
    }
    else if (path === '/teacher/dashboard' && req.method === 'GET') {
      // Tableau de bord spécifique enseignant
      const teacherData = {
        courses: mockCourses.filter(c => c.teacherId === 3),
        studentsCount: 52,
        avgGrades: 14.2,
        pendingAssignments: 12
      };
      res.writeHead(200);
      res.end(JSON.stringify(teacherData));
    }
    else if (path === '/admin/dashboard-stats' && req.method === 'GET') {
      // Statistiques pour le tableau de bord admin
      const adminStats = {
        total_students: mockUsers.filter(u => u.role === 'student').length,
        total_teachers: mockUsers.filter(u => u.role === 'teacher').length,
        validated_teachers: mockUsers.filter(u => u.role === 'teacher' && u.status === 'validated').length,
        pending_teacher_requests: teacherValidationRequests.filter(r => r.status === 'pending_review').length,
        total_courses: mockCourses.length,
        courses_needing_teacher: mockCourses.filter(c => c.status === 'need_teacher').length
      };
      res.writeHead(200);
      res.end(JSON.stringify(adminStats));
    }
    else if (path === '/secretariat/stats' && req.method === 'GET') {
      // Statistiques pour le tableau de bord secrétariat
      const secretariatStats = {
        pending_enrollments: 3,
        pending_teacher_requests: teacherValidationRequests.filter(r => r.status === 'pending_review').length,
        unresolved_conflicts: 1,
        documents_to_check: 5,
        tasks_today: secretariatTasks.filter(t => t.status !== 'completed').length,
        high_priority_tasks: secretariatTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
      };
      res.writeHead(200);
      res.end(JSON.stringify(secretariatStats));
    }
    else if (path === '/login' && req.method === 'POST') {
      // Simple mock login
      res.writeHead(200);
      res.end(JSON.stringify({ 
        token: 'mock-jwt-token-12345',
        message: 'Login successful'
      }));
    }
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock backend server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /protected/me`);
  console.log(`  GET  /protected/users`);
  console.log(`  GET  /courses`);
  console.log(`  POST /login`);
  console.log(`  GET  /admin/teacher-requests`);
  console.log(`  POST /admin/validate-teacher`);
  console.log(`  GET  /admin/dashboard-stats`);
  console.log(`  GET  /secretariat/tasks`);
  console.log(`  GET  /secretariat/stats`);
  console.log(`  GET  /secretariat/students/pending`);
  console.log(`  GET  /teacher/dashboard`);
});