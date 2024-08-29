module.exports = {
    apps: [
      {
        name: 'clientes',
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 3010',
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  };