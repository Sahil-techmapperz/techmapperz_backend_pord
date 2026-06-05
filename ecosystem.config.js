module.exports = {
  apps: [
    {
      name: 'techmapperz-backend',
      script: 'src/index.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      time: true,
      restart_delay: 1000,
      kill_timeout: 5000
    }
  ]
};

