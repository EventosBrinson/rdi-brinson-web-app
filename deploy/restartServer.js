var Deployer = require('simple-deployer')

var deployer = new Deployer({
  host: 'rdi.eventosbrinson.com',
  port: 22,
  username: 'deploy',
  showDeployMessages: true
})

var appname = 'rdi-brinson-web-app'
var deploy_to = '/home/deploy/' + appname

var current_path =  deploy_to + '/current'

var commands = []

commands.push({
  header: 'pm2:kill'
})

commands.push({
  command: ['pm2', 'delete', appname].join(' '),
  continueOnErrorCode: true
})

commands.push({
  header: 'pm2:start'
})

commands.push({
  command: ['pm2', 'start', current_path + '/server', '--name', appname].join(' ')
})

deployer.deploy(commands)
