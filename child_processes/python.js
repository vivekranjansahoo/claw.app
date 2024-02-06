const { spawn } = require('child_process');
const { MONGOURI } = require('../src/config/server-config');

const pythonProcess = spawn('python', ['search.py', MONGOURI]);
pythonProcess.stdin.setDefaultEncoding('utf-8');

module.exports = pythonProcess;