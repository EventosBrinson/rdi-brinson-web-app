var Deployer = require('simple-deployer')
var os = require('os')

var deployer = new Deployer({
  host: 'rdi.eventosbrinson.com',
  port: 22,
  username: 'deploy',
  showDeployMessages: true
})

var appname = 'rdi-brinson-web-app'
var deploy_to = '/home/deploy/rdi-brinson-web-app'
var repo_url = 'git@github.com:EventosBrinson/rdi-brinson-web-app.git'
var limit_release_count = 20

var date = new Date();
var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
var repo_path = deploy_to + '/' + appname
var releases_path = deploy_to + '/releases';
var current_path =  deploy_to + '/current'
var deployed_to = ""

var commands = []

commands.push({
  header: 'git:clone'
})

commands.push({
  command: ['cd', '/tmp', '&&', 'git', 'clone', repo_url].join(' '),
  continueOnErrorCode: true,
  local: true
})

commands.push({
  command: ['cd', '/tmp/' + appname, '&& git remote update --prune'].join(' '),
  local: true
})

commands.push({
  command: ['cd', '/tmp/' + appname, '&& git fetch'].join(' '),
  local: true
})

commands.push({
  header: 'npm:install dependecies'
})

commands.push({
  command: ['cd', '/tmp/' + appname, '&& npm install'].join(' '),
  local: true
})

commands.push({
  header: 'npm:generate build'
})

commands.push({
  command: ['cd', '/tmp/' + appname, '&& npm run build'].join(' '),
  local: true
})

commands.push({
  header: 'task:transfer release'
})

commands.push({
  command: ['cd', '/tmp', '&& tar -zcvf', appname + '.tar.gz', appname].join(' '),
  local: true
})

commands.push({
  command: ['scp', '-r', '/tmp/' + appname + '.tar.gz', 'deploy@rdi.eventosbrinson.com:' + deploy_to].join(' '),
  local: true
})

commands.push({
  command: ['cd', deploy_to, '&& tar -zxvf' + appname + '.tar.gz'].join(' ')
})

commands.push({
  header: 'task:clean up'
})

commands.push({
  command: ['cd', '/tmp', '&& rm -rf', appname].join(' '),
  local: true
})

commands.push({
  command: ['cd', '/tmp', '&& rm', appname + '.tar.gz'].join(' '),
  local: true
})

commands.push({
  header: 'task:generate release'
})

commands.push({
  command: ['mkdir', '-p', releases_path + '/unit'].join(' ')
})

commands.push({
  command: ['ls', '-dt', releases_path + '/*'].join(' ')
})

commands.push({
  dynamic: function(lastResult, code) {
    var lastDirectory = lastResult.split('\n')[1]
    var today_position = lastDirectory.indexOf(today)
    var today_count = 1

    if(today_position != -1) {
      today_count = Number(lastDirectory.slice(today_position + today.length + 1)) + 1
    }

    deployed_to = releases_path + '/' + today + '-' + today_count

    return { command: ['mkdir', '-p', deployed_to].join(' ') }
  }
})

commands.push({
  dynamic: function(lastResult, code) {
    return { 
      command: ['cp', '-a', repo_path +  '/.', deployed_to].join(' ')
    }
  }
})

commands.push({
  dynamic: function(lastResult, code) {
    return { 
      command: ['touch', deployed_to + '/deploy.txt'].join(' ')
    }
  }
})

commands.push({
  header: 'task:clean up'
})

commands.push({
  command: ['cd', deploy_to, '&& rm -rf', appname].join(' '),
})

commands.push({
  command: ['cd', deploy_to, '&& rm', appname + '.tar.gz'].join(' '),
})

commands.push({
  header: 'task:clean up releases'
})

commands.push({
  command: ['rm', '-rf', releases_path + '/unit'].join(' ')
})

commands.push({
  command: ['ls', '-dt', releases_path + '/*'].join(' ')
})

commands.push({
  dynamic: function(lastResult, code) {
    var files = lastResult.split('\n')

    if(files.length <= limit_release_count) {
      return { command: '' }
    } else {
      var command = ''

      for(var i = limit_release_count; i < files.length - 1; i++) {
        command +=  command !== '' ? ' && ' : ''
        command += 'rm -rf ' + files[i]
      }

      return { command: command }
    }
  }
})

commands.push({
  header: 'pm2:kill'
})

commands.push({
  command: ['pm2', 'delete', appname].join(' '),
  continueOnErrorCode: true
})

commands.push({
  header: 'task:point to current'
})

commands.push({
  command: ['rm', '-f', current_path].join(' ')
})

commands.push({
  dynamic: function(lastResult, code) {
    return { 
      command: ['ln', '-s', deployed_to, current_path].join(' ')
    }
  }
})

commands.push({
  header: 'pm2:start'
})

commands.push({
  command: ['pm2', 'start', current_path + '/server', '--name', appname].join(' ')
})

commands.push({
  header: 'deploy:revision'
})

commands.push({
  dynamic: function(lastResult, code) {
    return { 
      command: ['echo', '"' + date + ': deploy on ' + deployed_to + ' by ' + os.hostname() + '"', '>>', deploy_to + '/deploy_revision.log'].join(' ')
    }
  }
})

deployer.deploy(commands)
