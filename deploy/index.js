var simple_deployer = require('simple-deployer')
var os = require('os')

var deployer = simple_deployer()

deployer.configuration = {
  host: 'rdi.eventosbrinson.com',
  port: 22,
  username: 'deploy',
  show_deploy_messages: true,
}

var appname = 'rdi-brinson-web-app'
var deploy_to = '/home/deploy/rdi-brinson-web-app'
var repo_url = 'git@github.com:EventosBrinson/rdi-brinson-web-app.git'
var limit_release_count = 5

var date = new Date();
var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
var repo_path = deploy_to + '/repo'
var releases_path = deploy_to + '/releases';
var current_path =  deploy_to + '/current'
var deployed_to = ""

var commands = [{
  header: 'git:clone' }, {

  instruction: 'git clone ' + repo_url + ' ' + repo_path,
  permited_return_statuses: [128] }, {

  instruction: 'cd ' + repo_path + ' && git remote update --prune' }, {

  instruction: 'cd ' + repo_path + ' && git reset origin/master --hard' }, {

  instruction: 'cd ' + repo_path + ' && git fetch' }, {
  
  header: 'npm:install dependecies' }, {

  instruction: 'cd ' + repo_path + ' && npm install' }, {
  
  header: 'npm:generate build' }, {

  instruction: 'cd ' + repo_path + ' && npm run build' }, {
  
  header: 'task:generate release' }, {

  instruction: 'mkdir -p ' + releases_path + '/unit' }, {

  instruction: 'ls -dt ' + releases_path + '/*' }, {

  instruction: function(lastResponse, code) {
    var lastDirectory = lastResponse.split('\n')[1]
    var today_position = lastDirectory.indexOf(today)
    var today_count = 1

    if(today_position != -1) {
      today_count = Number(lastDirectory.slice(today_position + today.length + 1)) + 1
    }

    deployed_to = releases_path + '/' + today + '-' + today_count

    return 'mkdir -p ' + deployed_to + ' && cp -a ' + repo_path +  '/. ' + deployed_to + '&& touch ' + deployed_to + '/deploy.txt'
  }}, {
  
  header: 'task:clean up releases' }, {

  instruction: 'rm -rf ' + releases_path + '/unit' }, {

  instruction: 'ls -dt ' + releases_path + '/*'}, {

  instruction: function(lastResponse, code) {
    var files = lastResponse.split('\n')

    if(files.length <= limit_release_count) {
      return ''
    } else {
      var command = ''

      for(var i = limit_release_count; i < files.length - 1; i++) {
        command +=  command !== '' ? ' && ' : ''
        command += 'rm -rf ' + files[i]
      }

      return command
    }
  }}, {
  
  header: 'pm2:kill' }, {

  instruction: 'pm2 delete ' + appname,
  permited_return_statuses: [1] }, {
  
  header: 'task:point to current' }, {

  instruction: 'rm -f ' + current_path }, {

  instruction: function(lastResponse, code) {
    return 'ln -s ' + deployed_to + ' ' + current_path
  }}, {
  
  header: 'pm2:start' }, {

  instruction: 'pm2 start ' + current_path + '/server --name ' + appname }, {
  
  header: 'deploy:revision' }, {

  instruction: function(lastResponse, code) {
    return 'echo "' + date + ': deploy on ' + deployed_to + ' by ' + os.hostname() + '" >> ' + deploy_to + '/deploy_revision.log'
  }}
]

deployer.deploy(commands)
