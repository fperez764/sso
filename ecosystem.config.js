module.exports = {
  apps : [
    {
      name: 'next-sso',
      script: 'cd client && npm -- start && cd ..',
      args: 'start',
      local: {
        NODE_ENV: 'local' // APP_ENV=local
      },
      development: {
        NODE_ENV: 'dev' // APP_ENV=dev
      },
      production: {
        NODE_ENV: 'prod' // APP_ENV=prod
      }
    },
    {
      name: 'express-sso',
      script: 'cd server && npm -- start && cd ..',
      local: {
        NODE_ENV: 'local' // APP_ENV=local
      },
      development: {
        NODE_ENV: 'dev' // APP_ENV=dev
      },
      production: {
        NODE_ENV: 'prod' // APP_ENV=prod
      }
    },
  ], 

  deploy : {
    production : {
      key  : 'key.pem',
      user : 'uti2023',
      host : '192.168.238.65',
      ref  : 'origin/bug/varios',
      repo : 'ssh://git@gitlab.abe.bo:50512/uti/dev/sso.git',
      path : '/home/uti2023',
      'pre-deploy-local': '',
      'post-deploy' : 'cd client && npm install && npm run build && cd .. & pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
