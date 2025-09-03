export default {
  apps: [{
    name: 'frontend-dev',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/user/webapp/frontend',
    watch: false,
    env: {
      NODE_ENV: 'development'
    }
  }]
}
