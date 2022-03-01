#!/usr/bin/env node

// Run NW.js
const { exec, spawn } = require('child_process');
const path = require('path');
const appDir = process.argv.length > 2 ? process.argv[2] : '.';

let appManifest;
try {
  appManifest = require(path.resolve(appDir, 'package.json'));
} catch (error) {
  console.log(`Error reading package.json: ${error}`);
  process.exit(1);
}

const nwBin = require('hasbin').sync('nw')
  ? 'nw'
  : (appManifest.dependencies && Object.keys(appManifest.dependencies).includes('nw'))
    || (appManifest.devDependencies && Object.keys(appManifest.devDependencies).includes('nw'))
    ? 'npx nw'
    : null;

if (!nwBin) {
  console.log(`NW.js must be in %PATH% or included as a dependency in ${appDir}/package.json`);
  process.exit(1);
}

// Start NW.js process
const proc = exec(`${nwBin} ${appDir}`);

// Kill app on CTRL+C
process.on('SIGINT', () => {
  spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
});

// Keeps this wrapper process running
let keepAlive;
let quit = false;
function keepAliveCallback(){
  if(!quit) keepAlive = setTimeout(keepAliveCallback, 1000);
}
keepAliveCallback();

// Relay stdout and stderr from process until it exits
proc.stdout.on("data", function(data){
  process.stdout.write(data);
});
proc.stderr.on("data", function(data){
  process.stderr.write(data);
});
proc.on("exit", function(){
  quit = true;
});
