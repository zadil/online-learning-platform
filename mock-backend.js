const http = require('http');
const url = require('url');

// Mock data
const mockUsers = [
  { 
    id: 1, 
    name: 'Votre Nom Réel', 
    email: 'votre.email@example.com', 
    role: 'student',
    CreatedAt: new Date('2024-01-15').toISOString()
  },
  { 
    id: 2, 
    name: 'Marie Dubois', 
    email: 'marie.dubois@ecole.fr', 
    role: 'teacher',
    CreatedAt: new Date('2024-02-01').toISOString()
  },
  { 
    id: 3, 
    name: 'Pierre Martin', 
    email: 'pierre.martin@etudiant.fr', 
    role: 'student',
    CreatedAt: new Date('2024-02-15').toISOString()
  },
  { 
    id: 4, 
    name: 'Sophie Laurent', 
    email: 'sophie.laurent@ecole.fr', 
    role: 'teacher',
    CreatedAt: new Date('2024-03-01').toISOString()
  }
];

const mockCourses = [
  { 
    id: 1, 
    title: 'Introduction à JavaScript',
    description: { String: 'Apprenez les bases de JavaScript avec des exemples pratiques' }
  },
  { 
    id: 2, 
    title: 'React Avancé',
    description: { String: 'Maîtrisez React avec les hooks et le context' }
  },
  { 
    id: 3, 
    title: 'Node.js Backend',
    description: { String: 'Créez des APIs robustes avec Node.js et Express' }
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
      // Return the first user as the authenticated user
      res.writeHead(200);
      res.end(JSON.stringify(mockUsers[0]));
    }
    else if (path === '/protected/users' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(mockUsers));
    }
    else if (path === '/courses' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(mockCourses));
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
});