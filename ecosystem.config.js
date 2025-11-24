module.exports = {
  apps: [
    {
      name: 'techmapperz-backend',
      script: 'src/index.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 8000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: '/var/log/pm2/techmapperz-backend-error.log',
      out_file: '/var/log/pm2/techmapperz-backend-out.log',
      log_file: '/var/log/pm2/techmapperz-backend-combined.log',
      time: true,
      restart_delay: 1000,
      kill_timeout: 5000
    }
  ]
};

